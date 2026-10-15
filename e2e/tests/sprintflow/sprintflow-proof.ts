// Written by SprintFlow. Import everything from here instead of '@playwright/test':
//   import { test, expect, proofStep } from './sprintflow-proof';
// It records a high-resolution video (Chromium screencast frames, encoded by SprintFlow with H.264), captions each
// step on screen so the video explains itself, and saves a full-resolution screenshot after every proof step.
import { test as base, type Page, type TestInfo } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

export * from '@playwright/test';

const REC = { width: 1920, height: 1080, scale: 2.0, quality: 95 };

const CAPTION_STYLE = {
  position: 'fixed', left: '0', right: '0', bottom: '0', zIndex: '2147483647',
  background: 'rgba(17,17,17,0.85)', color: '#fff', font: '18px/1.4 system-ui, sans-serif',
  padding: '12px 20px', pointerEvents: 'none',
};

async function startRecording(page: Page, testInfo: TestInfo): Promise<() => Promise<void>> {
  const dir = testInfo.outputPath('sprintflow-frames');
  fs.mkdirSync(dir, { recursive: true });
  const frames: { file: string; ts: number }[] = [];
  let cdp: any;
  try {
    cdp = await page.context().newCDPSession(page);
  } catch {
    return async () => {};  // not Chromium: Playwright's built-in video remains as a fallback
  }
  let n = 0;
  cdp.on('Page.screencastFrame', (f: any) => {
    const file = path.join(dir, `f${String(n++).padStart(6, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    frames.push({ file, ts: (f.metadata && f.metadata.timestamp) || Date.now() / 1000 });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {
    format: 'jpeg', quality: REC.quality, everyNthFrame: 1,
    maxWidth: Math.round(REC.width * REC.scale), maxHeight: Math.round(REC.height * REC.scale),
  });
  return async () => {
    await page.waitForTimeout(1000).catch(() => {});  // hold the final state on screen
    await cdp.send('Page.stopScreencast').catch(() => {});
    const index = path.join(dir, 'frames.json');
    fs.writeFileSync(index, JSON.stringify({ width: Math.round(REC.width * REC.scale),
      height: Math.round(REC.height * REC.scale), end: Date.now() / 1000, frames }));
    await testInfo.attach('sprintflow-frames', { path: index, contentType: 'application/json' });
  };
}

export const test = base.extend<{}>({
  viewport: [{ width: REC.width, height: REC.height }, { option: true }],
  deviceScaleFactor: [REC.scale, { option: true }],
  page: async ({ page }, use, testInfo) => {
    const stop = await startRecording(page, testInfo);
    await use(page);
    await stop();
  },
});

const installed = new WeakSet<Page>();

/** Show `text` as an on-screen caption; it survives navigations. */
export async function caption(page: Page, text: string): Promise<void> {
  if (!installed.has(page)) {
    installed.add(page);
    await page.addInitScript((style) => {
      const t = sessionStorage.getItem('__sprintflow_caption');
      if (t) window.addEventListener('DOMContentLoaded', () => {
        const el = document.createElement('div');
        el.id = '__sprintflow_caption';
        el.textContent = t;
        Object.assign(el.style, style);
        document.documentElement.appendChild(el);
      });
    }, CAPTION_STYLE);
  }
  await page.evaluate(([t, style]) => {
    try { sessionStorage.setItem('__sprintflow_caption', t as string); } catch {}
    let el = document.getElementById('__sprintflow_caption');
    if (!el) {
      el = document.createElement('div');
      el.id = '__sprintflow_caption';
      Object.assign(el.style, style);
      (document.body || document.documentElement).appendChild(el);
    }
    el.textContent = t as string;
  }, [text, CAPTION_STYLE] as const).catch(() => {});
  await page.waitForTimeout(700);
}

let shot = 0;

/** A named, captioned test step, ending with a full-resolution screenshot:
 *  `await proofStep(page, 'Criterion 1: ...', async () => { ... })` */
export async function proofStep(page: Page, title: string, body: () => Promise<void>): Promise<void> {
  await base.step(title, async () => {
    await caption(page, title);
    await body();
    const info = base.info();
    const file = info.outputPath(`sprintflow-step-${String(++shot).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, fullPage: false }).catch(() => {});
    if (fs.existsSync(file)) await info.attach(`sprintflow-step: ${title}`, { path: file, contentType: 'image/png' });
  });
}
