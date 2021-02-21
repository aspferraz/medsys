module.exports = app => {
    const dadosPessoais = require("../controllers/dadospessoais.controller.js");
  
    var router = require("express").Router();
  
    // Create a new dadospessoais
    router.post("/", dadosPessoais.create);
  
    // Retrieve all dadospessoais
    router.get("/", dadosPessoais.findAll);

    router.get("/pagadores", dadosPessoais.findAllPagadores);
  
    // Retrieve a single dadospessoais with id
    router.get("/:id", dadosPessoais.findOne);
  
    // Update a dadospessoais with id
    router.put("/:id", dadosPessoais.update);
  
    // Delete a dadospessoais with id
    router.delete("/:id", dadosPessoais.delete);
  
    // Delete all dadospessoais
    //router.delete("/", dadospessoais.deleteAll);
  
    app.use('/api/dadospessoais', router);
  };