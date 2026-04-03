const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = Router();

// POST /api/admin/login
// Body: { password: string }
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
