import pool from "../config/db.js";

const createUserTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(100) NOT NULL, 
    role VARCHAR(50) DEFAULT 'user' NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(), 
    active BOOLEAN DEFAULT true NOT NULL,
    password_changed_at TIMESTAMP, 
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP
)`;

  try {
    await pool.query(queryText);
    console.log("User table created successfully or already exists");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

export default createUserTable;
