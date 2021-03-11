
const result = require('dotenv').config();

if (result.error) {
  throw result.error
}
 
//console.log(result.parsed)

module.exports = {
    HOST: "localhost",
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    dialect: "mariadb",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
