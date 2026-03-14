const SMTPConnection = require("smtp-connection")

async function checkMailbox(mxHost, email) {

  return new Promise((resolve) => {

    const connection = new SMTPConnection({
      host: mxHost,
      port: 25,
      secure: false,
      connectionTimeout: 10000
    })

    connection.connect(() => {

      connection.send(
        {
          from: "verify@test.com",
          to: email
        },
        "",
        (err, info) => {

          if (!err) {

            connection.quit()

            return resolve({
              valid: true,
              code: 250,
              message: "Mailbox exists"
            })

          }

          if (err.responseCode === 550) {

            connection.quit()

            return resolve({
              valid: false,
              code: 550,
              message: "Mailbox does not exist"
            })

          }

          if (err.responseCode === 450) {

            connection.quit()

            return resolve({
              valid: null,
              code: 450,
              message: "Greylisted / temporary failure"
            })

          }

          connection.quit()

          resolve({
            valid: null,
            code: err.responseCode || null,
            message: err.message
          })

        }
      )

    })

    connection.on("error", (error) => {

      resolve({
        valid: null,
        code: err?.responseCode || null,
        message: err?.message || "connection_error"
      })


    })

  })

}

module.exports = { checkMailbox }
