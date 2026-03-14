# Email Verification Module

Node.js service for verifying email addresses using DNS and SMTP with typo detection and automated testing.

This project checks whether an email address is valid by performing:

* Email syntax validation
* DNS MX record lookup
* SMTP mailbox verification
* Typo detection using Levenshtein distance

It also provides:

* REST API for email verification
* CLI tool for quick checks
* 15+ Jest unit tests with edge-case coverage

---

## Features

* Validate email syntax using regex
* Retrieve MX records using DNS lookup
* Verify mailbox existence via SMTP
* Detect common email domain typos (e.g., `gmial.com → gmail.com`)
* Structured JSON response format
* REST API endpoint
* Command line interface (CLI)
* Jest unit testing with 15+ test cases

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Running Tests

Run the Jest test suite:

```bash
npm test
```

---

## CLI Usage

You can verify an email directly from the terminal:

```bash
node cli.js user@example.com
```

Example output:

```json
{
  "email": "user@example.com",
  "result": "valid",
  "resultcode": 1,
  "subresult": "mailbox_exists"
}
```

---

## API Usage

You can test the email verification endpoint using `curl`.

Start the server:

```bash
node src/server.js
```

Then run:

```bash
curl -X POST http://localhost:3000/verify-email \
-H "Content-Type: application/json" \
-d '{"email":"user@gmial.com"}'
```

Example response:

```json
{
  "email": "user@gmial.com",
  "result": "invalid",
  "resultcode": 6,
  "subresult": "typo_detected",
  "didyoumean": "user@gmail.com"
}
```


---

## Project Structure

```
email-verifier
│
├── src
│   ├── verifyEmail.js
│   ├── smtpCheck.js
│   ├── dnsLookup.js
│   ├── didYouMean.js
│   ├── utils.js
│   └── server.js
│
├── tests
│   └── verifyEmail.test.js
│
├── cli.js
├── package.json
└── README.md
```

---

## Important Note

Some email providers (such as Gmail, Outlook, and Yahoo) block SMTP mailbox verification for privacy and anti-spam reasons.

In these cases, the system may return:

```
result: "unknown"
```

This behavior is expected and reflects real-world email verification limitations.

---

## How It Works

The email verification process follows a multi-step validation pipeline:

### 1. Email Syntax Validation

The input email is first validated using a regular expression to ensure it follows standard email formatting rules.

Example checks:

* Presence of `@`
* Valid domain format
* No invalid characters

---

### 2. Typo Detection

Common domain typos are detected using the **Levenshtein edit distance algorithm**.

If the edit distance between the provided domain and a known domain (e.g., `gmail.com`, `yahoo.com`) is ≤ 2, the system suggests a correction.

Example:

```
user@gmial.com → user@gmail.com
```

---

### 3. DNS MX Record Lookup

The domain is queried for **MX (Mail Exchange) records** using Node.js DNS utilities.

MX records determine which mail servers are responsible for receiving emails for a domain.

Example:

```
gmail.com → gmail-smtp-in.l.google.com
```

If no MX records exist, the email domain is considered invalid.

---

### 4. SMTP Mailbox Verification

The system attempts to connect to the mail server using the **SMTP protocol**.

The verification flow:

```
HELO
MAIL FROM:test@example.com
RCPT TO:user@example.com
```

The SMTP server response determines the result:

| SMTP Code | Meaning                      |
| --------- | ---------------------------- |
| 250       | Mailbox exists               |
| 550       | Mailbox does not exist       |
| 450       | Temporary error / greylisted |

---

### 5. Structured Response

The module returns a structured JSON response containing:

* verification result
* result codes
* MX records
* execution time
* timestamp
* optional typo suggestions

Example response:

```json
{
  "email": "user@example.com",
  "result": "valid",
  "resultcode": 1,
  "subresult": "mailbox_exists"
}
```
---

## Author

Siddhant Chasta
