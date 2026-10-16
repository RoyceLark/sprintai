const {
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidService,
  isValidDate,
  isValidTime,
  validateEnquiry,
} = require("../validation.js");

function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayStr = formatDate(today);
const yesterdayStr = formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000));
const tomorrowStr = formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));

describe("isValidName", function () {
  test("accepts a normal name", function () {
    expect(isValidName("Jane Doe")).toBe(true);
  });

  test("rejects empty string", function () {
    expect(isValidName("")).toBe(false);
  });

  test("rejects whitespace only", function () {
    expect(isValidName("   ")).toBe(false);
  });

  test("rejects single character (boundary)", function () {
    expect(isValidName("A")).toBe(false);
  });

  test("accepts exactly two characters (boundary)", function () {
    expect(isValidName("Al")).toBe(true);
  });
});

describe("isValidEmail", function () {
  test("accepts a valid email", function () {
    expect(isValidEmail("customer@example.com")).toBe(true);
  });

  test("rejects missing @", function () {
    expect(isValidEmail("customerexample.com")).toBe(false);
  });

  test("rejects missing domain dot", function () {
    expect(isValidEmail("customer@example")).toBe(false);
  });

  test("rejects empty string", function () {
    expect(isValidEmail("")).toBe(false);
  });

  test("rejects non-string input", function () {
    expect(isValidEmail(null)).toBe(false);
  });
});

describe("isValidPhone", function () {
  test("accepts a 10-digit phone number", function () {
    expect(isValidPhone("9876543210")).toBe(true);
  });

  test("accepts formatted phone number with symbols", function () {
    expect(isValidPhone("+1 (987) 654-3210")).toBe(true);
  });

  test("rejects too-short number (boundary)", function () {
    expect(isValidPhone("12345")).toBe(false);
  });

  test("accepts exactly 7 digits (boundary)", function () {
    expect(isValidPhone("1234567")).toBe(true);
  });

  test("rejects too-long number (boundary)", function () {
    expect(isValidPhone("1234567890123456")).toBe(false);
  });

  test("rejects empty string", function () {
    expect(isValidPhone("")).toBe(false);
  });
});

describe("isValidService", function () {
  test("accepts a selected service", function () {
    expect(isValidService("Hair Styling")).toBe(true);
  });

  test("rejects empty selection", function () {
    expect(isValidService("")).toBe(false);
  });
});

describe("isValidDate", function () {
  test("accepts today's date (boundary)", function () {
    expect(isValidDate(todayStr)).toBe(true);
  });

  test("accepts a future date", function () {
    expect(isValidDate(tomorrowStr)).toBe(true);
  });

  test("rejects a past date (boundary)", function () {
    expect(isValidDate(yesterdayStr)).toBe(false);
  });

  test("rejects empty string", function () {
    expect(isValidDate("")).toBe(false);
  });

  test("rejects an invalid date string", function () {
    expect(isValidDate("not-a-date")).toBe(false);
  });
});

describe("isValidTime", function () {
  test("accepts a valid HH:MM time", function () {
    expect(isValidTime("14:30")).toBe(true);
  });

  test("rejects empty string", function () {
    expect(isValidTime("")).toBe(false);
  });

  test("rejects a malformed time", function () {
    expect(isValidTime("2:30 PM")).toBe(false);
  });
});

describe("validateEnquiry", function () {
  test("is valid when all fields are correct", function () {
    const result = validateEnquiry({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      service: "Hair Styling",
      date: tomorrowStr,
      time: "14:30",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test("returns an error per invalid field", function () {
    const result = validateEnquiry({
      name: "",
      email: "bad-email",
      phone: "123",
      service: "",
      date: yesterdayStr,
      time: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.service).toBeDefined();
    expect(result.errors.date).toBeDefined();
    expect(result.errors.time).toBeDefined();
  });

  test("reports only the invalid fields", function () {
    const result = validateEnquiry({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      service: "",
      date: tomorrowStr,
      time: "14:30",
    });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(["service"]);
  });
});
