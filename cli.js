#!/usr/bin/env node

const { verifyEmail } = require("./src/verifyEmail")

const email = process.argv[2]

if (!email) {
  console.log("Usage: node cli.js <email>")
  process.exit(1)
}

verifyEmail(email).then(console.log)
