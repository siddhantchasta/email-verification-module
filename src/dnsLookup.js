const dns = require("dns").promises

async function getMXRecords(domain) {

  try {

    const records = await dns.resolveMx(domain)

    const sorted = records.sort((a, b) => a.priority - b.priority)

    return sorted.map(record => record.exchange)

  } catch (error) {

    return []

  }

}

module.exports = {
  getMXRecords
}
