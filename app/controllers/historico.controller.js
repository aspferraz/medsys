const db = require("../models");
const Historico = db.historicos;
const Op = db.Sequelize.Op;

// Create and Save a new Historico
exports.create = (req, res) => {
    // Validate request
    if (!req.body.paciente_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Historico
    const historico = {
        paciente_id: req.body.paciente_id,
        data: req.body.data,
        evolucao: req.body.evolucao
    };

    // Save Historico in the database
    Historico.create(historico)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Historico."
            });
        });
};

exports.count = (req, res) => {
    Historico.count({
            distinct: 'id',
            where: {}
        })
        .then(data => {
            res.send({
                "count": data
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while counting historicos."
            });
        });
};

// Retrieve all Historicos from the database.
exports.findAll = (req, res) => {
    const paciente_id = req.query.paciente_id;
    const data = req.query.data;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 100;
    const sortBy = req.query.sortby || "id";
    const sortDesc = req.query.sortdesc;

    var condition;
    if (paciente_id || data) {
        condition = {
            [Op.and]: [
                paciente_id ? {
                    "paciente_id": {
                        [Op.eq]: paciente_id
                    }
                } : true,
                data ? {
                    "data": {
                        [Op.gt]: new Date(data),
                        [Op.lt]: (function () {
                            let dt = new Date(data);
                            dt.setDate(dt.getDate() + 1);
                            return dt;
                        })()
                    }
                } : true
            ]
        }
    } else {
        condition = null;
    }

    Historico.findAll({
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
                message: err.message || "Some error occurred while retrieving Historicos."
            });
        });
};

// Find a single Historico with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Historico.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Historico with id=" + id
            });
        });
};

// Update a Historico by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Historico.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Historico was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Historico with id=${id}. Maybe Historico was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Historico with id=" + id
            });
        });
};

// Delete a Historico with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Historico.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Historico was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Historico with id=${id}. Maybe Historico was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete Historico with id=" + id
            });
        });

};

// Delete all Historicos from the database.
exports.deleteAll = (req, res) => {
    Historico.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Historicos were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Historicos."
            });
        });
};