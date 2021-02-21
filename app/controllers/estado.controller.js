const db = require("../models");
const Estado = db.estados;
const Op = db.Sequelize.Op;

// Create and Save a new Estado
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Estado
    const estado = {
        nome: req.body.nome,
        uf: req.body.uf
    };

    // Save Estado in the database
    Estado.create(estado)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the estado."
            });
        });
};

// Retrieve all Estados from the database.
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    const uf = req.query.uf;
    const page = req.query.page;
    const size = req.query.size;
    const sortBy = req.query.sortby || "nome";
    const sortDesc = req.query.sortdesc;

    var condition;
    if (nome || uf) {
        condition =
        {
            [Op.and]: [
                nome ? { "nome": { [Op.like]: `%${nome}%` } } : true,
                uf ? { "uf": { [Op.like]: `%${uf}%` } } : true
            ]
        }
    }
    else {
        condition = null;
    }

    Estado.findAll({ 
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
                    err.message || "Some error occurred while retrieving estados."
            });
        });
};

// Find a single Estado with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Estado.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving estado with id=" + id
            });
        });
};

// Update a Estado by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Estado.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Estado was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update estado with id=${id}. Maybe Estado was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating estado with id=" + id
            });
        });
};

// Delete a Estado with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Estado.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Estado was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete estado with id=${id}. Maybe Estado was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete estado with id=" + id
            });
        });

};

// Delete all Estados from the database.
exports.deleteAll = (req, res) => {
    Estado.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} estados were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all estados."
            });
        });
};


