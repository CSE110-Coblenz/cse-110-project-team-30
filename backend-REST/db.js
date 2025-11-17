// require('dotenv').config();
// const mysql = require('mysql2/promise');

// const dbConfig = {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//    ssl: {
//         // 这告诉它需要验证 SSL 证书
//         // 如果连接失败，你可能需要从 Aiven 下载 CA 证书
//         rejectUnauthorized: true 
        
//         // 如果上面失败了，你可能需要从 Aiven 控制台下载
//         // 'ca.pem' 文件，放到项目里，然后取消下面这行的注释:
//         // ca: fs.readFileSync(path.join(__dirname, 'ca.pem'))
//       },

//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0
    
// };

// let pool = null;

// /**
//  * Returns a single shared MySQL pool instance (singleton).
//  * Creates the pool on first call and reuses it thereafter.
//  */
// function getPool() {
//     if (!pool) {
//         pool = mysql.createPool(dbConfig);
//         console.log('Created MySQL pool (singleton).');
//     }
//     return pool;
// }

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

let pool;

function getPool() {
  if (pool) {
    return pool;
  }

  console.log('🔌 Creating Aiven database connection pool (using CA certificate)...');
  
  // Path fix: __dirname is the 'backend-REST' folder
  // 'ca.pem' is also in the 'backend-REST' folder
  const caPath = path.join(__dirname, 'ca.pem');
  console.log(`Loading CA certificate from path: ${caPath}`);

  try {
    if (!fs.existsSync(caPath)) {
      throw new Error(`CA certificate file not found! Ensure 'ca.pem' and 'db.js' are in the same folder ('backend-REST').`);
    }

    //
    // Key fix: Use 'DB_' variables from .env file
    //
    pool = mysql.createPool({
      host: process.env.DB_HOST,       // Matches .env
      user: process.env.DB_USER,       // Matches .env
      password: process.env.DB_PASSWORD, // Matches .env
      database: process.env.DB_NAME,     // Matches .env
      port: process.env.DB_PORT,         // Matches .env
      
      // Read ca.pem file and use for SSL
      ssl: {
        ca: fs.readFileSync(caPath)
      },

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('✅ Aiven database connection pool created successfully.');
    
  } catch (err) {
    console.error('❌ Failed to create database connection pool:', err);
    // If .env variables are not loaded (Server.js issue) or cert path is wrong, you will see the error here
  }

  return pool;
}

module.exports = {
  getPool
};