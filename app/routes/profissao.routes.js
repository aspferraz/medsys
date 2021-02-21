module.exports = app => {
    const profissoes = require("../controllers/profissao.controller.js");
  
    var router = require("express").Router();
  
    // Create a new estado
    router.post("/", profissoes.create);
  
    // Retrieve all profissoes
    router.get("/", profissoes.findAll);
  
    // Retrieve a single estado with id
    router.get("/:id", profissoes.findOne);
  
    // Update a estado with id
    router.put("/:id", profissoes.update);
  
    // Delete a estado with id
    router.delete("/:id", profissoes.delete);
  
    // Delete all profissoes
    //router.delete("/", profissoes.deleteAll);
  
    app.use('/api/profissoes', router);
  };