// middleware\db.js
// const express = require('express');
// const mysql = require('mysql');


// // database connection and query promisify
// var conn = mysql.createPool({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'new_password',
//     database : 'dispatch',


//     connectionLimit : 100
//   });


// const mySqlQury =(qry)=>{
//     return new Promise((resolve, reject)=>{
//         conn.query(qry, (err, row)=>{
//             if (err) return reject(err);
//             resolve(row)
//         })
//     }) 
// }


// module.exports = {conn, mySqlQury}
const mysql = require('mysql2')

// Create a connection pool
var conn = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'ds12aug',
    connectionLimit : 100
  });

console.log('Connection configuration:', conn.config);

// Check if the connection is connected
conn.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database!');
        connection.release(); // Release the connection back to the pool
    }
});

console.log('Connection pool status:', conn._allConnections.length);

// Function to execute queries with support for parameterized queries
const mySqlQury = (qry, values = []) => {
    return new Promise((resolve, reject) => {
        conn.query(qry, values, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = { conn, mySqlQury };
