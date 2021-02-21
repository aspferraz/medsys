module.exports = app => {
    const cidades = require("../controllers/cidade.controller.js");
  
    var router = require("express").Router();
  
    // Create a new cidade
    router.post("/", cidades.create);
  
    // Retrieve all cidades
    router.get("/", cidades.findAll);
  
    // Retrieve a single cidade with id
    router.get("/:id", cidades.findOne);
  
    // Update a cidade with id
    router.put("/:id", cidades.update);
  
    // Delete a cidade with id
    router.delete("/:id", cidades.delete);
  
    // Delete all cidades
    //router.delete("/", cidades.deleteAll);
  
    app.use('/api/cidades', router);
  };