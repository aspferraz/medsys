module.exports = app => {
    const estados = require("../controllers/estado.controller.js");
  
    var router = require("express").Router();
  
    // Create a new estado
    router.post("/", estados.create);
  
    // Retrieve all estados
    router.get("/", estados.findAll);
  
    // Retrieve a single estado with id
    router.get("/:id", estados.findOne);
  
    // Update a estado with id
    router.put("/:id", estados.update);
  
    // Delete a estado with id
    router.delete("/:id", estados.delete);
  
    // Delete all estados
    //router.delete("/", estados.deleteAll);
  
    app.use('/api/estados', router);
  };