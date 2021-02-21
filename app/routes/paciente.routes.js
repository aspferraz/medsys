module.exports = app => {
    const pacientes = require("../controllers/paciente.controller.js");
  
    var router = require("express").Router();
  
    // Create a new paciente
    router.post("/", pacientes.create);
  
    // Retrieve all pacientes
    router.get("/", pacientes.findAll);

     // Retrieve the quantity of servicos
     router.get("/count", pacientes.count);
  
    // Retrieve a single paciente with id
    router.get("/:id", pacientes.findOne);
  
    // Update a paciente with id
    router.put("/:id", pacientes.update);
  
    // Delete a paciente with id
    router.delete("/:id", pacientes.delete);
  
    // Delete all pacientes
    //router.delete("/", pacientes.deleteAll);
  
    app.use('/api/pacientes', router);
  };