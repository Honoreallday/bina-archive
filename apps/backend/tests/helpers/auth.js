const jwt = require('jsonwebtoken');

// Generates a valid admin JWT for use in test requests.
// Uses the same JWT_SECRET set in tests/setup.js.
function authHeader() {
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `Bearer ${token}`;
}

module.exports = { authHeader };
