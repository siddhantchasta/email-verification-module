const { isValidEmailFormat } = require("./utils")
const { getMXRecords } = require("./dnsLookup")
const { checkMailbox } = require("./smtpCheck")
const { getDidYouMean } = require("./didYouMean")

async function verifyEmail(email) {

  const startTime = Date.now()

  const timestamp = new Date().toISOString()

  try {

    if (!email) {
      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: "empty_email",
        domain: null,
        mxRecords: [],
        executiontime: 0,
        error: "Email is empty",
        timestamp
      }
    }

    // syntax validation
    if (!isValidEmailFormat(email)) {

      const suggestion = getDidYouMean(email)

      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: suggestion ? "typo_detected" : "invalid_syntax",
        didyoumean: suggestion,
        domain: null,
        mxRecords: [],
        executiontime: (Date.now() - startTime) / 1000,
        error: "Invalid email syntax",
        timestamp
      }

    }

    const domain = email.split("@")[1]

    // typo detection
    const suggestion = getDidYouMean(email)

    if (suggestion) {

      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: "typo_detected",
        didyoumean: suggestion,
        domain,
        mxRecords: [],
        executiontime: (Date.now() - startTime) / 1000,
        error: null,
        timestamp
      }

    }

    // MX lookup
    const mxRecords = await getMXRecords(domain)

    if (!mxRecords.length) {

      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: "no_mx_records",
        domain,
        mxRecords: [],
        executiontime: (Date.now() - startTime) / 1000,
        error: "No mail servers found",
        timestamp
      }

    }

    // SMTP check
    const smtpResult = await checkMailbox(mxRecords[0], email)

    let result = "unknown"
    let resultcode = 3
    let subresult = "connection_error"

    if (smtpResult.valid === true) {
      result = "valid"
      resultcode = 1
      subresult = "mailbox_exists"
    }

    if (smtpResult.valid === false) {
      result = "invalid"
      resultcode = 6
      subresult = "mailbox_does_not_exist"
    }

    return {
      email,
      result,
      resultcode,
      subresult,
      domain,
      mxRecords,
      executiontime: (Date.now() - startTime) / 1000,
      error: null,
      timestamp
    }

  } catch (error) {

    return {
      email,
      result: "unknown",
      resultcode: 3,
      subresult: "connection_error",
      domain: null,
      mxRecords: [],
      executiontime: (Date.now() - startTime) / 1000,
      error: error.message,
      timestamp
    }

  }

}

module.exports = { verifyEmail }
