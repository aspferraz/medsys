const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./app/models");

var corsOptions = {
  // origin: "http://localhost:80"
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// this creates the tables if they don't exist (and does nothing if they already exists)
db.sequelize.sync();

// tests simple route
app.get("/", (req, res) => {
        res.json({message: "Welcome to medsys application."});
    }
);

require("./app/routes/estado.routes")(app);
require("./app/routes/cidade.routes")(app);
require("./app/routes/estadocivil.routes")(app);
require("./app/routes/profissao.routes")(app);
require("./app/routes/dadospessoais.routes")(app);
require("./app/routes/servico.routes")(app);
require("./app/routes/paciente.routes")(app);
require("./app/routes/historico.routes")(app);
require("./app/routes/recibo.routes")(app);
require("./app/routes/receita.routes")(app);

// set port, listen for requests
// const PORT = process.env.PORT || 8090;
const PORT = 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
