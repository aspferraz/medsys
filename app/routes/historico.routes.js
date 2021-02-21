module.exports = app => {
    const historicos = require("../controllers/historico.controller.js");
  
    var router = require("express").Router();
  
    // Create a new historico
    router.post("/", historicos.create);
  
    // Retrieve all historicos
    router.get("/", historicos.findAll);

    // Retrieve the quantity of historicos
    router.get("/count", historicos.count);
  
    // Retrieve a single historico with id
    router.get("/:id", historicos.findOne);
  
    // Update a historico with id
    router.put("/:id", historicos.update);
  
    // Delete a historico with id
    router.delete("/:id", historicos.delete);
  
    // Delete all historicos
    //router.delete("/", historicos.deleteAll);
  
    app.use('/api/historicos', router);
  };