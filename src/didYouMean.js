const levenshtein = require("fast-levenshtein")

const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com"
]

function getDidYouMean(email) {

  if (!email || !email.includes("@")) return null

  const [name, domain] = email.split("@")

  let bestMatch = null
  let bestDistance = Infinity

  for (const correctDomain of COMMON_DOMAINS) {

    const distance = levenshtein.get(domain, correctDomain)

    if (distance > 0 && distance <= 2 && distance < bestDistance) {
      bestMatch = correctDomain
      bestDistance = distance
    }

  }

  if (bestMatch) {
    return `${name}@${bestMatch}`
  }

  return null
}

module.exports = { getDidYouMean }
