const express = require("express")
const { verifyEmail } = require("./verifyEmail")

const app = express()
app.use(express.json())

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
