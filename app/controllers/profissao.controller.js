const db = require("../models");
const Profissao = db.profissoes;
const Op = db.Sequelize.Op;

// Create and Save a new Profissao
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Profissao
    const profissao = {
        nome: req.body.nome
    };

    // Save Profissao in the database
    Profissao.create(profissao)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the profissao."
            });
        });
};

// Retrieve all EstadosCivis from the database.
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    const page = req.query.page;
    const size = req.query.size;
    const sortBy = req.query.sortby || "nome";
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

    Profissao.findAll({ 
        where: condition,
        order: [
            [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'],
        ],
        offset: page ? ((page-1)*size) : undefined,
        limit: size || undefined,
        subQuery: false 
     })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving profissoes."
            });
        });
};

// Find a single Profissao with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Profissao.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving profissao with id=" + id
            });
        });
};

// Update a Profissao by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Profissao.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Profissao was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update profissao with id=${id}. Maybe Profissao was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating profissao with id=" + id
            });
        });
};

// Delete a Profissao with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Profissao.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Profissao was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete profissao with id=${id}. Maybe Profissao was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete profissao with id=" + id
            });
        });

};

// Delete all EstadosCivis from the database.
exports.deleteAll = (req, res) => {
    Profissao.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} profissoes were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all profissoes."
            });
        });
};


