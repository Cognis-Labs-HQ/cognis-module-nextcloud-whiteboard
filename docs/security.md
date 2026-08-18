# Security checklist

- Declare the narrowest component and capability dependencies.
- Authenticate and authorize before reading a body or invoking business logic.
- Bound request size, validate types/ranges, normalize identifiers, and parameterize persistence through the DB executor.
- Use Node/Web Crypto for IDs, tokens, secrets, and keys; never `Math.random()`.
- Return stable public errors without stack traces, SQL, paths, secrets, or upstream response bodies.
- Log caught failures at error level with component, operation, and safe identifiers; log state changes at info level.
- Avoid secrets, personal data, and credentials in tests, artwork, screenshots, logs, or the manifest.
- Review every dependency and external origin. Prefer no runtime dependencies.
- Test disable/enable/uninstall cycles for routes, capabilities, hooks, timers, sockets, schema/data retention, and cache behavior.
- Treat the manifest hash inventory as release evidence, not a substitute for code review or signatures.
