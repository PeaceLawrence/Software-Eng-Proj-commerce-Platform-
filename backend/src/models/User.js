const pool = require('../config/db');

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      first_name    VARCHAR(100) NOT NULL,
      last_name     VARCHAR(100) NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      onecard_id    VARCHAR(50),
      password_hash TEXT NOT NULL,
      role          VARCHAR(20) DEFAULT 'user',
      created_at    TIMESTAMP DEFAULT NOW()
    );
  `);
};

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async ({ firstName, lastName, email, onecardId, passwordHash }) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, onecard_id, password_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [firstName, lastName, email.toLowerCase(), onecardId, passwordHash]
  );
  return result.rows[0];
};

const updateUser = async (id, { firstName, lastName, email, onecardId, passwordHash }) => {
  const result = await pool.query(
    `UPDATE users
     SET first_name    = COALESCE($1, first_name),
         last_name     = COALESCE($2, last_name),
         email         = COALESCE($3, email),
         onecard_id    = COALESCE($4, onecard_id),
         password_hash = COALESCE($5, password_hash)
     WHERE id = $6
     RETURNING *`,
    [firstName || null, lastName || null, email ? email.toLowerCase() : null, onecardId || null, passwordHash || null, id]
  );
  return result.rows[0];
};

module.exports = { createUserTable, findByEmail, findById, createUser, updateUser };
