const db = require("../models");
const EstadoCivil = db.estadosCivis;
const Op = db.Sequelize.Op;

// Create and Save a new EstadoCivil
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a EstadoCivil
    const estadoCivil = {
        nome: req.body.nome
    };

    // Save EstadoCivil in the database
    EstadoCivil.create(estadoCivil)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the estadoCivil."
            });
        });
};

// Retrieve all EstadosCivis from the database.
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    const page = req.query.page;
    const size = req.query.size;
    const sortBy = req.query.sortby || "id";
    const sortDesc = req.query.sortdesc;

    var condition;
    if (nome) {
        condition =
        {    
            "nome": {
                [Op.like]: `%${nome}%`
            }
        }
    }
    else {
        condition = null;
    }

    EstadoCivil.findAll({ 
        where: condition,
        order: [
            [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'],
        ],
        offset: page ? ((page - 1) * size) : undefined,
        limit: size || undefined,
        subQuery: false 
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving estadosCivis."
            });
        });
};

// Find a single EstadoCivil with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    EstadoCivil.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving estadoCivil with id=" + id
            });
        });
};

// Update a EstadoCivil by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    EstadoCivil.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "EstadoCivil was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update estadoCivil with id=${id}. Maybe EstadoCivil was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating estadoCivil with id=" + id
            });
        });
};

// Delete a EstadoCivil with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    EstadoCivil.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "EstadoCivil was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete estadoCivil with id=${id}. Maybe EstadoCivil was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete estadoCivil with id=" + id
            });
        });

};

// Delete all EstadosCivis from the database.
exports.deleteAll = (req, res) => {
    EstadoCivil.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} estadosCivis were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all estadosCivis."
            });
        });
};


