const db = require("../models");
const Paciente = db.pacientes;
const dadosPessoaisCtl = require("./dadospessoais.controller.js");
const Op = db.Sequelize.Op;

// var _ = require('lodash');

const isEmpty = obj => !Object.getOwnPropertySymbols(obj).length && !Object.getOwnPropertyNames(obj).length;

// Create and Save a new Paciente
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.DadosPessoais.nome) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const t = await db.sequelize.transaction();
    try {
        // Save Paciente in the database
        let result = await Paciente.create(req.body, {
            include: ["DadosPessoais"],
            t
        });

        await t.commit();
        res.send(result);

    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Paciente."
        });
    }
}

exports.count = (req, res) => {
    Paciente.count({
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
                message: err.message || "Some error occurred while counting pacientes."
            });
        });
};

exports.getCondition = function (context, attrPrefix = "", attrSuffix = "") {
    if (context.id || context.dados_pessoais_id) {
        let op = Op.and;
        if (context.operator) {
            op = context.operator.toLowerCase() === "and" ? Op.and : Op.or;
        }

        return {
            [op]: [
                context.id ? {
                    [`${attrPrefix}id${attrSuffix}`]: {
                        [Op.eq]: context.id
                    }
                } : true,
                context.dados_pessoais_id ? {
                    [`${attrPrefix}dados_pessoais_id${attrSuffix}`]: {
                        [Op.eq]: context.dados_pessoais_id
                    }
                } : true
            ]
        };
    }
    return null;
}

const getAssociationCondition = function (req, associationName, provider, forWhereClause = true) {
    let params = Object.keys(req.query).filter(k => k.toLowerCase().includes(associationName.toLowerCase()));
    if (params.length) {
        let context = new Object();
        context["operator"] = req.query.operator;
        for (let param of params) {
            context[param.split('.')[(param.match(/\./g) || []).length]] = req.query[param];
        }
        return forWhereClause ? provider.getCondition(context, '$DadosPessoais.', '$') : provider.getCondition(context);
    }
    return null;
}

// Retrieve all Pacientes from the database.
exports.findAll = async (req, res) => {
    console.log(req.query);
    let associations = [];
    if (req.query.associations) associations.push(req.query.associations);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 100;
    const sortBy = req.query.sortby || "id";
    const sortDesc = req.query.sortdesc;

    let condition = this.getCondition({
        "id": req.query.id,
        "dados_pessoais_id": req.query.dados_pessoais_id
    });
    let dadosPessoaisCondition = getAssociationCondition(req, "dadosPessoais", dadosPessoaisCtl);

    console.log(condition);
    console.log(dadosPessoaisCondition);
    condition = Object.assign({}, condition, dadosPessoaisCondition);

    associations.push("DadosPessoais");

    let order;

    if (sortBy.split(".").length > 1) {
        if (sortBy.toLowerCase().startsWith("dadospessoais")) {
            order = [{
                model: db.dadospessoais,
                as: 'DadosPessoais'
            }, sortBy.split('.')[(sortBy.match(/\./g) || []).length], sortDesc === 'true' ? 'DESC' : 'ASC']
        } else if (sortBy.toLowerCase().startsWith("recibos")) {
            order = [{
                model: db.recibos,
                as: 'Recibos'
            }, sortBy.split('.')[(sortBy.match(/\./g) || []).length], sortDesc === 'true' ? 'DESC' : 'ASC']
        }
    } else {
        order = [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'];
    }

    console.log(condition);
    
    
    Paciente.findAndCountAll({
        where: isEmpty(condition) ? true : { [Op.or]: condition },
        include: associations,
        order: [
            order,
        ],
        offset: page ? ((page - 1) * size) : undefined,
        limit: size || undefined,
        subQuery: false
    })
        .then(data => {
            res.send({
                "pacientes": data.rows,
                "count": data.count
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Pacientes."
            });
        });
};

// Find a single Paciente with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Paciente.findOne({
        where: {
            "id": {
                [Op.eq]: id
            }
        },
        include: ["DadosPessoais", "Recibos", "Historicos"]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Paciente with id=" + id
            });
        });
};

// Update a Paciente 
exports.update = async (req, res) => {
    const t = await db.sequelize.transaction();

    let paciente = Paciente.build(req.body, {
        isNewRecord: false,
        include: ["DadosPessoais"]
    });

    try {
        await paciente.DadosPessoais.save({
            transaction: t
        });
        await paciente.save({
            transaction: t
        });
        await t.commit();
        res.send({
            message: "Paciente was updated successfully."
        });
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: err.message || "Error updating Paciente with id=" + req.params.id
        });
    }
};

// Delete a Paciente with the specified id in the request (plus all recibos associated)
exports.delete = async (req, res) => {
    const t = await db.sequelize.transaction();
    const id = req.params.id;
    try {
        let paciente = (await Paciente.findOne({
            where: {
                "id": id
            },
            include: ["Recibos", "DadosPessoais"],
            transaction: t
        })).toJSON();

        if (paciente) {
            if (paciente.Recibos && paciente.Recibos.length > 0) {
                let recibosIds = paciente.Recibos.map(r => r.id);
                let destroyed = await db.recibos.destroy({
                    where: {
                        "id": recibosIds
                    },

                }, {
                    transaction: t
                });
                if (!destroyed)
                    throw "couldn't remove recibos with ids: " + recibosIds;
            }
            let destroyed = await Paciente.destroy({
                where: {
                    "id": paciente.id
                }
            }, {
                transaction: t
            });

            destroyed = destroyed && await db.dadospessoais.destroy({
                where: {
                    "id": paciente.DadosPessoais.id
                }
            }, {
                transaction: t
            });


            if (destroyed) {
                await t.commit();
                res.send({
                    message: "Paciente was deleted successfully!"
                });
            } else
                throw new Error();
        } else {
            throw `Paciente with id=${id} was not found`;
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: err.message || `Cannot delete Paciente with id=${id}. Maybe Paciente was not found!`
        });
    }
}

// Delete all Pacientes from the database.
exports.deleteAll = async (req, res) => {
    Paciente.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Pacientes were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Pacientes."
            });
        });
};