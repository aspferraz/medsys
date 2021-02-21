const db = require("../models");
const Recibo = db.recibos;
const dadosPessoaisCtl = require("./dadospessoais.controller.js");
const servicoCtl = require("./servico.controller.js");
// const pacienteCtl = require("./paciente.controller.js");
const Op = db.Sequelize.Op;

// Create and Save a new Recibo
exports.create = (req, res) => {
    // Validate request
    if (!req.body.servico_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Recibo
    const recibo = {
        data: req.body.data,
        data_consulta: req.body.data_consulta,
        servico_id: req.body.servico_id,
        paciente_id: req.body.paciente_id,
        dados_pessoais_responsavel_id: req.body.dados_pessoais_responsavel_id
    };

    // Save Recibo in the database
    Recibo.create(recibo)
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
                    message: "Some error occurred while creating the Recibo."
                });
        });
};

exports.count = (req, res) => {
    Recibo.count({
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

const getOperator = function (context) {
    let op = Op.and;
    if (context.operator) {
        op = context.operator.toLowerCase() === "and" ? Op.and : Op.or;
    }
    return op;
}

exports.getCondition = function (context, attrPrefix = "", attrSuffix = "") {
    let op = getOperator(context);
    return {
        [op]: [
            context.data ? {
                [`${attrPrefix}data${attrSuffix}`]: {
                    [Op.eq]: context.data
                }
            } : true,
            context.data_consulta ? {
                [`${attrPrefix}data_consulta${attrSuffix}`]: {
                    [Op.eq]: context.data_consulta
                }
            } : true,
            context.servico_id ? {
                [`${attrPrefix}servico_id${attrSuffix}`]: {
                    [Op.eq]: context.servico_id
                }
            } : true,
            context.paciente_id ? {
                [`${attrPrefix}paciente_id${attrSuffix}`]: {
                    [Op.eq]: context.paciente_id
                }
            } : true,
            context.dados_pessoais_responsavel_id ? {
                [`${attrPrefix}dados_pessoais_responsavel_id${attrSuffix}`]: {
                    [Op.eq]: context.dados_pessoais_responsavel_id
                }
            } : true
        ]
    }
};

const getAssociationCondition = function (req, associationName, provider) {
    let params = Object.keys(req.query).filter(k => k.toLowerCase().includes(associationName.toLowerCase()));
    if (params.length) {
        let context = new Object();
        context["operator"] = req.query.operator;
        for (let param of params) {
            context[param.split('.')[(param.match(/\./g) || []).length]] = req.query[param];
        }

        return provider.getCondition(context, `$${associationName}.`, `$`);
    }
    return null;
}

// Retrieve all Recibos from the database.
exports.findAll = (req, res) => {
    console.log(req.query);
    let associations = [];
    if (req.query.associations) associations.push(req.query.associations);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 100;
    const sortBy = req.query.sortby || "id";
    const sortDesc = req.query.sortdesc;

    let condition = null;

    if (Object.keys(req.query).filter((k) => ["associations", "operator", "paciente.dadospessoais", "servico.", "responsavelpagamento.", "page", "size", "sortby", "sortdesc"].every(p => !k.toLowerCase().includes(p))).length > 0) {
        condition = this.getCondition({
            "operator": req.query.operator,
            "data": req.query.data,
            "data_consulta": req.query.data_consulta,
            "servico_id": req.query.servico_id,
            "paciente_id": req.query.paciente_id,
            "dados_pessoais_responsavel_id": req.query.dados_pessoais_responsavel_id
        });
    }

    let op = getOperator({
        "operator": req.query.operator
    });

    if (!condition) {
        condition = {
            [op]: []
        };
    }

    let responsavelPagamentoCondition = getAssociationCondition(req, "ResponsavelPagamento", dadosPessoaisCtl);
    if (responsavelPagamentoCondition) {
        let values = responsavelPagamentoCondition[op];
        let cValues = condition[op];
        cValues.push(values);
        condition[op] = cValues;
    }
    associations.push("ResponsavelPagamento");

    let servicoCondition = getAssociationCondition(req, "Servico", servicoCtl);
    if (servicoCondition) {
        let values = servicoCondition[op];
        let cValues = condition[op];
        cValues.push(values);
        condition[op] = cValues;
    }
    associations.push("Servico");

    let dadosPessoaisPacienteCondition = getAssociationCondition(req, "Paciente.DadosPessoais", dadosPessoaisCtl);
    if (dadosPessoaisPacienteCondition) {
        let values = dadosPessoaisPacienteCondition[op];
        let cValues = condition[op];
        cValues.push(values);
        condition[op] = cValues;
    }
    associations.push({
        model: db.pacientes,
        as: "Paciente",
        where: {},
        include: {
            model: db.dadospessoais,
            as: "DadosPessoais",
            where: {}
        }
    });

    // console.log(associations);
    // console.log(condition);
    let order;

    if (sortBy.split(".").length > 1) {
        if (sortBy.toLowerCase().startsWith("responsavelpagamento")) {
            order = [{
                model: db.dadospessoais,
                as: 'ResponsavelPagamento'
            }, sortBy.split('.')[(sortBy.match(/\./g) || []).length], sortDesc === 'true' ? 'DESC' : 'ASC']
        } else if (sortBy.toLowerCase().startsWith("servico")) {
            order = [{
                model: db.servicos,
                as: 'Servico'
            }, sortBy.split('.')[(sortBy.match(/\./g) || []).length], sortDesc === 'true' ? 'DESC' : 'ASC']
        } else if (sortBy.toLowerCase().startsWith("paciente.dadospessoais")) {
            order = [{
                    model: db.pacientes,
                    as: 'Paciente'
                },

                {
                    model: db.dadospessoais,
                    as: 'DadosPessoais'
                },
                sortBy.split('.')[(sortBy.match(/\./g) || []).length], sortDesc === 'true' ? 'DESC' : 'ASC'
            ]
        }
    } else {
        order = [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC'];
    }

    Recibo.findAndCountAll({
            where: condition,
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
                "recibos": data.rows,
                "count": data.count
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Recibos."
            });
        });
};

// Find a single Recibo with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Recibo.findOne({
            where: {
                "id": {
                    [Op.eq]: id
                }
            },
            include: ["ResponsavelPagamento", {model: db.pacientes, as: "Paciente", include: ["DadosPessoais"]}, "Servico"]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Recibo with id=" + id
            });
        });
};

// Update a Recibo by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Recibo.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Recibo was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Recibo with id=${id}. Maybe Recibo was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Recibo with id=" + id
            });
        });
};

// Delete a Recibo with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Recibo.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Recibo was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Recibo with id=${id}. Maybe Recibo was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete Recibo with id=" + id
            });
        });

};

// Delete all Recibos from the database.
exports.deleteAll = (req, res) => {
    Recibo.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Recibos were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Recibos."
            });
        });
};