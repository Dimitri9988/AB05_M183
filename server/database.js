const sqlite3 = require("sqlite3").verbose();

const insertContent = `INSERT INTO posts (title, content) VALUES
('Introduction to JavaScript', 'JavaScript is a dynamic language primarily used for web development...'),
('Functional Programming', 'Functional programming is a paradigm where functions take center stage...'),
('Asynchronous Programming in JS', 'Asynchronous programming allows operations to run in parallel without blocking the main thread...')
`;




const selectContend = `SELECT * FROM posts`;




const initializeDatabase = () => {
  const db = new sqlite3.Database("./my-database.db");
  return db;
};



const insertDB = (db, query) => {
  return new Promise((resolve, reject) => {
    db.run(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const queryDB = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};





module.exports = { initializeDatabase, queryDB, insertDB, insertContent};





