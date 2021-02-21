const dbConfig = require("../config/db.config.js");

const {Sequelize, Model, Transaction} = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false
  },
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Transaction = Transaction;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.estados = require("./estado.model.js")(sequelize, Sequelize, Model);
db.cidades = require("./cidade.model.js")(sequelize, Sequelize, Model);
db.estadosCivis = require("./estadocivil.model.js")(sequelize, Sequelize, Model);
db.profissoes = require("./profissao.model.js")(sequelize, Sequelize, Model);
db.dadospessoais = require("./dadospessoais.model.js")(sequelize, Sequelize, Model);
db.servicos = require("./servico.model.js")(sequelize, Sequelize, Model);
db.pacientes = require("./paciente.model.js")(sequelize, Sequelize, Model);
db.historicos = require("./historico.model.js")(sequelize, Sequelize, Model);
db.recibos = require("./recibo.model.js")(sequelize, Sequelize, Model);

module.exports = db;
