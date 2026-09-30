# Security Policy

## Reporting a vulnerability

Please avoid publishing credentials, tokens, private keys, personal data, or exploitable security details in a public issue.

If you discover a vulnerability in ImgSanitizer:

1. Do not include real secrets or private user files in reports.
2. Provide the smallest reproducible example possible.
3. Prefer GitHub's private vulnerability reporting / Security Advisory flow when available for this repository.
4. If private reporting is unavailable, contact the maintainer through the GitHub profile before publishing exploit details.

## Secret handling

- Never commit `.env` files containing real credentials.
- Never commit private keys, certificates with private material, service-account files, or deployment tokens.
- If a secret is committed, revoke or rotate it immediately. Removing it in a later commit does not remove it from Git history.
- Use environment variables or the hosting provider's secret store for runtime credentials.

## Image privacy

The hosted version processes uploaded images in memory and returns the sanitized output in the same request. The application code does not intentionally persist uploaded images.

For the strongest privacy boundary, run the project locally.
