module.exports = app => {
    const servicos = require("../controllers/servico.controller.js");
  
    var router = require("express").Router();
  
    // Create a new estado
    router.post("/", servicos.create);
  
    // Retrieve all servicos
    router.get("/", servicos.findAll);

    // Retrieve the quantity of servicos
    router.get("/count", servicos.count);
  
    // Retrieve a single estado with id
    router.get("/:id", servicos.findOne);
  
    // Update a estado with id
    router.put("/:id", servicos.update);
  
    // Delete a estado with id
    router.delete("/:id", servicos.delete);
  
    // Delete all servicos
    //router.delete("/", servicos.deleteAll);
  
    app.use('/api/servicos', router);
  };