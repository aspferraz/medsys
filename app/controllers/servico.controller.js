const db = require("../models");
const Servico = db.servicos;
const Op = db.Sequelize.Op;

// Create and Save a new Servico
exports.create = (req, res) => {
    // Validate request
    if (!req.body.descricao) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Servico
    const servico = {
        descricao: req.body.descricao,
        valor: req.body.valor
    };

    // Save Servico in the database
    Servico.create(servico)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            if (err) {
                let msg;
                if (err.errors)
                    msg = err.errors[0].message;
                else if (err.parent)
                    msg = err.parent.code;
                else
                    msg = err.message;
                res.status(500).send({
                    message: msg
                });
            } else
                res.status(500).send({
                    message: "Some error occurred while creating the servico."
                });
        });
};

exports.count = (req, res) => {
    Servico.count({
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
                message: err.message || "Some error occurred while counting servicos."
            });
        });
};

exports.getCondition = function (context, attrPrefix="", attrSuffix="") {
    let op = Op.and;
    if (context.operator) {
        op = context.operator.toLowerCase() === "and" ? Op.and : Op.or;
    }
    return {
        [op]: [
            context.descricao ? {
                [`${attrPrefix}descricao${attrSuffix}`]: {
                    [Op.like]: `%${context.descricao}%`
                }
            } : true,
            context.valor ? {
                [`${attrPrefix}valor${attrSuffix}`]: {
                    [Op.eq]: context.valor
                }
            } : true
        ]
    }
};

// Retrieve all Servicos from the database.
exports.findAll = (req, res) => {

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 100;
    const sortBy = req.query.sortby || "id";
    const sortDesc = req.query.sortdesc;

    let condition = null;
    if (Object.keys(req.query).filter((k) => !["operator", "page", "size", "sortBy", "sortDesc"].includes(k)).length !== 0) {
        condition = this.getCondition({
            "operator": req.query.operator,
            "descricao": req.query.descricao,
            "valor": req.query.valor
        });
    } 

    Servico.findAndCountAll({
            where: condition,
            order: [
                [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'],
            ],
            offset: page ? ((page - 1) * size) : undefined,
            limit: size || undefined,
            subQuery: false
        })
        .then(data => {
            res.send({
                "servicos": data.rows,
                "count": data.count
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving servicos."
            });
        });
};

// Find a single Servico with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Servico.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving servico with id=" + id
            });
        });
};

// Update a Servico by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Servico.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Servico was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update servico with id=${id}. Maybe Servico was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            if (err) {
                let msg;
                if (err.errors)
                    msg = err.errors[0].message;
                else if (err.parent)
                    msg = err.parent.code;
                else
                    msg = err.message;
                res.status(500).send({
                    message: msg
                });
            } else
                res.status(500).send({
                    message: err.message || "Error updating servico with id=" + id
                });
        });
};

// Delete a Servico with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Servico.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Servico was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete servico with id=${id}. Maybe Servico was not found!`
                });
            }
        })
        .catch(err => {
            if (err) {
                let msg;
                if (err.errors)
                    msg = err.errors[0].message;
                else if (err.parent)
                    msg = err.parent.code;
                else
                    msg = err.message;
                res.status(500).send({
                    message: msg
                });
            } else
                res.status(500).send({
                    message: "Could not delete servico with id=" + id
                });
        });

};

// Delete all Servicos from the database.
exports.deleteAll = (req, res) => {
    Servico.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} servicos were deleted successfully!`
            });
        })
        .catch(err => {
            if (err) {
                let msg;
                if (err.errors)
                    msg = err.errors[0].message;
                else if (err.parent)
                    msg = err.parent.code;
                else
                    msg = err.message;
                res.status(500).send({
                    message: msg
                });
            } else
                res.status(500).send({
                    message: "Some error occurred while removing all servicos."
                });
        });
};