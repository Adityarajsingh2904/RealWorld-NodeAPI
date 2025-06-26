# Repo Guidelines for Codex Agents

## Auto-doc Generation via LLM

# Codex Prompt: Generate inline route documentation in Express.js API

For each file in `/routes/api/*.js`, insert inline JSDoc-style comments above every route handler.
Each comment must include:
- HTTP method (GET, POST, PUT, DELETE)
- URL path
- Whether authentication is required
- Description of input (request body or params)
- Description of expected output (status code and JSON keys)

Use this format:

```
/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 * @body    { email: String, password: String }
 * @return  { user: { token, email, username, bio, image } }
 */
```

Ensure the output preserves original route logic and formatting.

## Intelligent Test Coverage Mapper

# Codex Prompt: Suggest missing API test cases based on route logic

Analyze all route files in `/routes/api/*.js` and compare with existing Postman tests in `/tests/api-tests.postman.json`.

Output a list of endpoints that:
- Are implemented but not tested
- Are partially tested (missing edge cases, error scenarios)
- Have no negative test coverage (e.g., invalid input, unauthorized access)

Format each suggestion as:

```
Missing: `POST /api/users/login`
Reason: No test for missing password field
```

Return the full list of missing test scenarios for manual or auto-generation.

## Running tests

Use the following command to run the test suite:

```bash
npm test
```
