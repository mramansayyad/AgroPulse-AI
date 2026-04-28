# Security Policy

## Supported Versions

Only the latest version of AgroPulse AI is supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our users and their data seriously. If you believe you have found a security vulnerability, please do NOT open a public issue. Instead, please report it to us by following these steps:

1. Send an email to [mr.sayyadaman@gmail.com] (replace with real email).
2. Include as much detail as possible, including steps to reproduce.
3. We will acknowledge your report within 48 hours.

We follow a responsible disclosure policy and ask that you do not disclose the vulnerability publicly until we have had a chance to fix it and notify our users.

### API Key Security

**CRITICAL:** Never commit your `VITE_GEMINI_API_KEY` or any other credentials to the repository. The `.gitignore` file is configured to exclude `.env` files. If you accidentally commit a key, rotate it immediately in the Google Cloud Console.
