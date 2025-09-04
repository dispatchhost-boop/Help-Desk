
const mysql = require('mysql2');

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'ds12aug',
  connectionLimit: 100
});

// Your existing query function
const mySqlQury = (qry, values = []) => {
  return new Promise((resolve, reject) => {
    conn.query(qry, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { conn, mySqlQury };