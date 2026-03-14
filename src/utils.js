function isValidEmailFormat(email) {

  if (!email || typeof email !== "string") {
    return false
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return regex.test(email)

}

module.exports = {
  isValidEmailFormat
}
