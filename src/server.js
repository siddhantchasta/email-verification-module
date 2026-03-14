const express = require("express")
const { verifyEmail } = require("./verifyEmail")

const app = express()

app.use(express.json())

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "email-verifier" })
})

app.post("/verify-email", async (req, res) => {

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: "Email required" })
  }

  const result = await verifyEmail(email)

  res.json(result)

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
