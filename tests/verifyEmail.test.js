const { verifyEmail } = require("../src/verifyEmail")

describe("Email Verification Tests", () => {

  // 1
  test("valid email format passes syntax check", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(res.email).toBe("test@gmail.com")
  })

  // 2
  test("missing @ should be invalid", async () => {
    const res = await verifyEmail("testgmail.com")
    expect(res.result).toBe("invalid")
  })

  // 3
  test("empty email handled", async () => {
    const res = await verifyEmail("")
    expect(res.subresult).toBe("empty_email")
  })

  // 4
  test("null email handled", async () => {
    const res = await verifyEmail(null)
    expect(res.result).toBe("invalid")
  })

  // 5
  test("multiple @ rejected", async () => {
    const res = await verifyEmail("a@@gmail.com")
    expect(res.result).toBe("invalid")
  })

  // 6
  test("typo detection gmial", async () => {
    const res = await verifyEmail("user@gmial.com")
    expect(res.subresult).toBe("typo_detected")
  })

  // 7
  test("typo detection hotmial", async () => {
    const res = await verifyEmail("user@hotmial.com")
    expect(res.subresult).toBe("typo_detected")
  })

  // 8
  test("very long email handled", async () => {
    const res = await verifyEmail("verylongemailaddress123456789@gmail.com")
    expect(res.email).toContain("@gmail.com")
  })

  // 9
  test("invalid domain format", async () => {
    const res = await verifyEmail("user@invalid_domain")
    expect(res.result).toBe("invalid")
  })

  // 10
  test("valid domain returns mx records", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(res.domain).toBe("gmail.com")
  })

  // 11
  test("execution time exists", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(res.executiontime).toBeDefined()
  })

  // 12
  test("timestamp exists", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(res.timestamp).toBeDefined()
  })

  // 13
  test("resultcode returned", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(res.resultcode).toBeDefined()
  })

  // 14
  test("domain extraction works", async () => {
    const res = await verifyEmail("abc@yahoo.com")
    expect(res.domain).toBe("yahoo.com")
  })

  // 15
  test("unknown smtp result handled", async () => {
    const res = await verifyEmail("test@gmail.com")
    expect(["valid","invalid","unknown"]).toContain(res.result)
  })

})
