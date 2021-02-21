module.exports = app => {
    const recibos = require("../controllers/recibo.controller.js");
    const relatorios = require("../reports/recibo.reports.js");
  
    var router = require("express").Router();
  
    // Create a new estado
    router.post("/", recibos.create);
  
    // Retrieve all recibos
    router.get("/", recibos.findAll);

    router.get("/pdf/:id/options", relatorios.getReciboReport);

    router.get("/pdf", relatorios.getRecibosReport);

    // Retrieve the quantity of recibos
    router.get("/count", recibos.count);
  
    // Retrieve a single estado with id
    router.get("/:id", recibos.findOne);
  
    // Update a estado with id
    router.put("/:id", recibos.update);
  
    // Delete a estado with id
    router.delete("/:id", recibos.delete);
  
    // Delete all recibos
    //router.delete("/", recibos.deleteAll);
  
    app.use('/api/recibos', router);
  };