const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const formatUser = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  onecardId: row.onecard_id,
  role: row.role,
});

const register = async (req, res) => {
  const { firstName, lastName, email, onecardId, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'firstName, lastName, email, and password are required' });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const row = await User.createUser({ firstName, lastName, email, onecardId, passwordHash });
  const user = formatUser(row);
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const row = await User.findByEmail(email);
  if (!row) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  const match = await bcrypt.compare(password, row.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  const user = formatUser(row);
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ user, token });
};

const updateProfile = async (req, res) => {
  const { firstName, lastName, email, onecardId, password } = req.body;
  const userId = req.user.id;

  if (email) {
    const existing = await User.findByEmail(email);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ message: 'That email is already used by another account.' });
    }
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const row = await User.updateUser(userId, { firstName, lastName, email, onecardId, passwordHash });

  if (!row) return res.status(404).json({ message: 'User not found' });

  res.json({ user: formatUser(row) });
};

module.exports = { register, login, updateProfile };
