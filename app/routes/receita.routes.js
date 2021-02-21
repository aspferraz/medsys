module.exports = app => {

    const relatorios = require("../reports/receita.reports.js");
  
    var router = require("express").Router();

    router.get("/pdf", relatorios.getReceitaReport);
    
    app.use('/api/receitas', router);
}