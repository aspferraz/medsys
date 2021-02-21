module.exports = app => {
    const estadosCivis = require("../controllers/estadocivil.controller.js");
  
    var router = require("express").Router();
  
    // Create a new estado
    router.post("/", estadosCivis.create);
  
    // Retrieve all estadosCivis
    router.get("/", estadosCivis.findAll);
  
    // Retrieve a single estado with id
    router.get("/:id", estadosCivis.findOne);
  
    // Update a estado with id
    router.put("/:id", estadosCivis.update);
  
    // Delete a estado with id
    router.delete("/:id", estadosCivis.delete);
  
    // Delete all estadosCivis
    //router.delete("/", estadosCivis.deleteAll);
  
    app.use('/api/estadoscivis', router);
  };