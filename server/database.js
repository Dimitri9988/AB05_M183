const sqlite3 = require("sqlite3").verbose();

const insertContent = `INSERT INTO posts (title, content) VALUES
('Introduction to JavaScript', 'JavaScript is a dynamic language primarily used for web development...'),
('Functional Programming', 'Functional programming is a paradigm where functions take center stage...'),
('Asynchronous Programming in JS', 'Asynchronous programming allows operations to run in parallel without blocking the main thread...')
`;
req.log.info("Inserted content into the database.");

const selectContend = `SELECT * FROM posts`;
req.log.info("Selected content from the database.");

const initializeDatabase = () => {
  const db = new sqlite3.Database("./my-database.db");
  req.log.info("Initialized the database.");
  return db;
};

const insertDB = (db, query) => {
  return new Promise((resolve, reject) => {
    db.run(query, [], (err, rows) => {
      if (err) {
        req.log.error("Failed to insert data into the database.");
        return reject(err);
      }
      req.log.info("Data inserted into the database.");
      resolve(rows);
    });
  });
};

const queryDB = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        req.log.error("Failed to query data from the database.");
        return reject(err);
      }
      req.log.info("Data queried from the database.");
      resolve(rows);
    });
  });
};





module.exports = { initializeDatabase, queryDB, insertDB, insertContent};





