module.exports = {
    HOST: "localhost",
    USER: "mysql",
    PASSWORD: "${DB_SECRET}",
    DB: "medsys",
    dialect: "mariadb",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
