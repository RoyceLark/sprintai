// Written by SprintFlow. Import everything from here instead of '@playwright/test':
//   import { test, expect, proofStep } from './sprintflow-proof';
// It records a high-resolution video (Chromium screencast frames, encoded by SprintFlow with H.264), captions each
// step on screen so the video explains itself, and saves a full-resolution screenshot after every proof step.
import { test as base, type Page, type TestInfo } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

export * from '@playwright/test';

const REC = { width: 1920, height: 1080, scale: 2.0, quality: 95 };
// The test writer's own check runs (SPRINTFLOW_FAST): no recording and no screenshots - only whether it passes.
const FAST = !!process.env.SPRINTFLOW_FAST;

const CAPTION_STYLE = {
  position: 'fixed', left: '0', right: '0', bottom: '0', zIndex: '2147483647',
  background: 'rgba(17,17,17,0.85)', color: '#fff', font: '18px/1.4 system-ui, sans-serif',
  padding: '12px 20px', pointerEvents: 'none',
};

async function startRecording(page: Page, testInfo: TestInfo): Promise<() => Promise<void>> {
  if (FAST) return async () => {};
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
    // Salesforce proof org: sign in with SprintFlow's session first, outside the recording
    const login = process.env.SPRINTFLOW_SF_LOGIN;
    if (login) {
      await page.goto(login);
      await page.waitForURL((u) => u.pathname.startsWith('/lightning') || u.pathname.endsWith('home.jsp'),
        { timeout: 90000 }).catch(() => {});
      // Salesforce's own pop-ups and panels (a new-feature tour, the Guidance Center) must not cover the proof
      await page.waitForTimeout(3000);
      for (const name of ['Dismiss', 'Close', 'Got It', 'Skip']) {
        const b = page.getByRole('button', { name, exact: true });
        for (let i = 0; i < 3 && await b.first().isVisible().catch(() => false); i++) {
          await b.first().click({ timeout: 2000 }).catch(() => {});
        }
      }
      await page.keyboard.press('Escape').catch(() => {});
    }
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
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('data-caption', t);
        Object.assign(el.style, style);
        const css = document.createElement('style');
        css.textContent = '#__sprintflow_caption::after{content:attr(data-caption)}';
        document.documentElement.appendChild(css);
        document.documentElement.appendChild(el);
      });
    }, CAPTION_STYLE);
  }
  // The caption is drawn by CSS (::after) from an attribute and hidden from accessibility: it shows in the video, but
  // the tests' text and role locators never find it - a step titled "Open opportunities: 2" must not make
  // getByText('Open opportunities: 2') match twice.
  await page.evaluate(([t, style]) => {
    try { sessionStorage.setItem('__sprintflow_caption', t as string); } catch {}
    let el = document.getElementById('__sprintflow_caption');
    if (!el) {
      el = document.createElement('div');
      el.id = '__sprintflow_caption';
      el.setAttribute('aria-hidden', 'true');
      Object.assign(el.style, style);
      const css = document.createElement('style');
      css.textContent = '#__sprintflow_caption::after{content:attr(data-caption)}';
      (document.head || document.documentElement).appendChild(css);
      (document.body || document.documentElement).appendChild(el);
    }
    el.textContent = '';
    el.setAttribute('data-caption', t as string);
  }, [text, CAPTION_STYLE] as const).catch(() => {});
  await page.waitForTimeout(700);
}

let shot = 0;

/** A named, captioned test step, ending with a full-resolution screenshot:
 *  `await proofStep(page, 'Criterion 1: ...', async () => { ... })` */
export async function proofStep(page: Page, title: string, body: () => Promise<void>): Promise<void> {
  await base.step(title, async () => {
    if (FAST) { await body(); return; }
    await caption(page, title);
    await body();
    const info = base.info();
    const file = info.outputPath(`sprintflow-step-${String(++shot).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, fullPage: false }).catch(() => {});
    // a small copy for SprintFlow's visual check of the result (layout-sized, JPEG)
    await page.screenshot({ path: file.slice(0, -4) + '.review.jpg', type: 'jpeg', quality: 70, scale: 'css' })
      .catch(() => {});
    if (fs.existsSync(file)) await info.attach(`sprintflow-step: ${title}`, { path: file, contentType: 'image/png' });
  });
}
