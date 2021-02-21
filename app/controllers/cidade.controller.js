const db = require("../models");
const Cidade = db.cidades;
const Op = db.Sequelize.Op;

// Create and Save a new Cidade
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Cidade
    const cidade = {
        nome: req.body.nome,
        estado_id: req.body.estado_id
    };

    // Save Cidade in the database
    Cidade.create(cidade)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Cidade."
            });
        });
};

// Retrieve all Cidades from the database.
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    const estado_id = req.query.estado_id;
    const page = req.query.page;
    const size = req.query.size;
    const sortBy = req.query.sortby || "nome";
    const sortDesc = req.query.sortdesc;

    var condition;
    if (nome || estado_id) {
        condition =
        {
            [Op.and]: [
                nome ? { "nome": { [Op.like]: `%${nome}%` } } : true,
                estado_id ? { "estado_id": { [Op.eq]: estado_id } } : true
            ]
        }
    }
    else {
        condition = null;
    }

    Cidade.findAll({ 
        where: condition,
        order: [
            [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'],
        ],
        offset: page ? ((page-1)*size) : undefined,
        limit: size || undefined,
        subQuery:false 
     })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Cidades."
            });
        });
};

// Find a single Cidade with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Cidade.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Cidade with id=" + id
            });
        });
};

// Update a Cidade by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Cidade.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Cidade was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Cidade with id=${id}. Maybe Cidade was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Cidade with id=" + id
            });
        });
};

// Delete a Cidade with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Cidade.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Cidade was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Cidade with id=${id}. Maybe Cidade was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete Cidade with id=" + id
            });
        });

};

// Delete all Cidades from the database.
exports.deleteAll = (req, res) => {
    Cidade.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Cidades were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Cidades."
            });
        });
};


