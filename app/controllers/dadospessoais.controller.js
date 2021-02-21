const db = require("../models");
const DadosPessoais = db.dadospessoais;
const Op = db.Sequelize.Op;

// Create and Save a new DadosPessoais
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome && !req.body.razao_social) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a DadosPessoais
    const dadosPessoais = {
        tipo_pessoa: req.body.tipo_pessoa,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        sexo: req.body.sexo,
        dt_nascimento: req.body.dt_nascimento,
        razao_social: req.body.razao_social,
        nome_fantasia: req.body.nome_fantasia,
        rg: req.body.rg,
        orgao_emissor: req.body.orgao_emissor,
        cpf: req.body.cpf,
        cnpj: req.body.cnpj,
        nie: req.body.nie,
        nim: req.body.nim,
        email: req.body.email,
        website: req.body.website,
        telefone: req.body.telefone,
        celular: req.body.celular,
        cep: req.body.cep,
        endereco: req.body.endereco,
        pagador: req.body.pagador,
        estado_id: req.body.estado_id,
        cidade_id: req.body.cidade_id,
        estado_civil_id: req.body.estado_civil_id,
        profissao_id: req.body.profissao_id
    };

    // Save DadosPessoais in the database
    DadosPessoais.create(dadosPessoais)
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
                    message: "Some error occurred while creating the DadosPessoais."
                });

        });
};

exports.getCondition = function (context, attrPrefix="", attrSuffix="") {
    let op = Op.and; 
    if (context.operator) {
        op = context.operator.toLowerCase() === "and" ? Op.and : Op.or;
    }  

    let r = {
        [op]: [
            context.tipo_pessoa ? {
                [`${attrPrefix}tipo_pessoa${attrSuffix}`]: {
                    [Op.like]: `${context.tipo_pessoa}`
                }
            } : true,
            context.nome ? {
                [`${attrPrefix}nome${attrSuffix}`]: {
                    [Op.like]: `%${context.nome}%`
                }
            } : true,
            context.sobrenome ? {
                [`${attrPrefix}sobrenome${attrSuffix}`]: {
                    [Op.like]: `%${context.sobrenome}%`
                }
            } : true,
            context.sexo ? {
                [`${attrPrefix}sexo${attrSuffix}`]: {
                    [Op.like]: `${context.sexo}`
                }
            } : true,
            context.dt_nascimento ? {
                [`${attrPrefix}dt_nascimento${attrSuffix}`]: {
                    [Op.eq]: context.dt_nascimento
                }
            } : true,
            context.razao_social ? {
                [`${attrPrefix}razao_social${attrSuffix}`]: {
                    [Op.like]: `%${context.razao_social}%`
                }
            } : true,
            context.nome_fantasia ? {
                [`${attrPrefix}nome_fantasia${attrSuffix}`]: {
                    [Op.like]: `%${context.nome_fantasia}%`
                }
            } : true,
            context.rg ? {
                [`${attrPrefix}rg${attrSuffix}`]: {
                    [Op.like]: `%${context.rg}%`
                }
            } : true,
            context.orgao_emissor ? {
                [`${attrPrefix}orgao_emissor${attrSuffix}`]: {
                    [Op.like]: `%${context.orgao_emissor}%`
                }
            } : true,
            context.cpf ? {
                [`${attrPrefix}cpf${attrSuffix}`]: {
                    [Op.like]: `%${context.cpf}%`
                }
            } : true,
            context.cnpj ? {
                [`${attrPrefix}cnpj${attrSuffix}`]: {
                    [Op.like]: `%${context.cnpj}%`
                }
            } : true,
            context.nie ? {
                [`${attrPrefix}nie${attrSuffix}`]: {
                    [Op.like]: `%${context.nie}%`
                }
            } : true,
            context.nim ? {
                [`${attrPrefix}nim${attrSuffix}`]: {
                    [Op.like]: `%${context.nim}%`
                }
            } : true,
            context.email ? {
                [`${attrPrefix}email${attrSuffix}`]: {
                    [Op.like]: `%${context.email}%`
                }
            } : true,
            context.website ? {
                [`${attrPrefix}website${attrSuffix}`]: {
                    [Op.like]: `%${context.website}%`
                }
            } : true,
            context.telefone ? {
                [`${attrPrefix}telefone${attrSuffix}`]: {
                    [Op.eq]: context.telefone
                }
            } : true,
            context.celular ? {
                [`${attrPrefix}celular${attrSuffix}`]: {
                    [Op.eq]: context.celular
                }
            } : true,
            context.cep ? {
                [`${attrPrefix}cep${attrSuffix}`]: {
                    [Op.like]: `%${context.cep}%`
                }
            } : true,
            context.endereco ? {
                [`${attrPrefix}endereco${attrSuffix}`]: {
                    [Op.like]: `%${context.endereco}%`
                }
            } : true,
            context.pagador ? {
                [`${attrPrefix}pagador${attrSuffix}`]: {
                    [Op.eq]: context.pagador
                }
            } : true,
            context.estado_id ? {
                [`${attrPrefix}estado_id${attrSuffix}`]: {
                    [Op.eq]: context.estado_id
                }
            } : true,
            context.cidade_id ? {
                [`${attrPrefix}cidade_id${attrSuffix}`]: {
                    [Op.eq]: context.cidade_id
                }
            } : true,
            context.estado_civil_id ? {
                [`${attrPrefix}estado_civil_id${attrSuffix}`]: {
                    [Op.eq]: context.estado_civil_id
                }
            } : true,
            context.profissao_id ? {
                [`${attrPrefix}profissao_id${attrSuffix}`]: {
                    [Op.eq]: context.profissao_id
                }
            } : true
        ]
    };
    
    // for(var property in r[op]) {
    //     console.log(property + "=" + r[op][property]);
    // }
    return r;
};

// Retrieve all DadosPessoaiss from the database.
exports.findAll = (req, res) => {

    const associations = req.query.associations;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 100;
    const sortBy = req.query.sortby || "nome";
    const sortDesc = req.query.sortdesc;

    let condition = null;
    if (Object.keys(req.query).filter((k) => !["associations", "page", "size", "sortBy", "sortDesc"].includes(k)).length !== 0)
    {
        condition =
            this.getCondition({
                "operator": req.query.operator,
                "tipo_pessoa": req.query.tipo_pessoa,
                "nome": req.query.nome,
                "sobrenome": req.query.sobrenome,
                "sexo": req.query.sexo,
                "dt_nascimento": req.query.dt_nascimento,
                "razao_social": req.query.razao_social,
                "nome_fantasia": req.query.nome_fantasia,
                "rg": req.query.rg,
                "orgao_emissor": req.query.orgao_emissor,
                "cpf": req.query.cpf,
                "cnpj": req.query.cnpj,
                "nie": req.query.nie,
                "nim": req.query.nim,
                "email": req.query.email,
                "website": req.query.website,
                "telefone": req.query.telefone,
                "celular": req.query.celular,
                "cep": req.query.cep,
                "endereco": req.query.endereco,
                "pagador": req.query.pagador,
                "estado_id": req.query.estado_id,
                "cidade_id": req.query.cidade_id,
                "estado_civil_id": req.query.estado_civil_id,
                "profissao_id": req.query.profissao_id
            });
    }

    DadosPessoais.findAll({
            where: condition,
            include: associations,
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
                message: err.message || "Some error occurred while retrieving DadosPessoais."
            });
        });
};

exports.findAllPagadores = (req, res) => {
    DadosPessoais.findAll({
            where: {
                pagador: true
            }
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving DadosPessoais."
            });
        });
};

// Find a single DadosPessoais with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    DadosPessoais.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving DadosPessoais with id=" + id
            });
        });
};

// Update a DadosPessoais by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    DadosPessoais.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "DadosPessoais was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update DadosPessoais with id=${id}. Maybe DadosPessoais was not found or req.body is empty!`
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
                    message: "Error updating DadosPessoais with id=" + id
                });
        });
};

// Delete a DadosPessoais with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    DadosPessoais.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "DadosPessoais was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete DadosPessoais with id=${id}. Maybe DadosPessoais was not found!`
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
                    message: "Could not delete DadosPessoais with id=" + id
                });
        });

};

// Delete all DadosPessoaiss from the database.
exports.deleteAll = (req, res) => {
    DadosPessoais.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} DadosPessoais were deleted successfully!`
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
                    message: "Some error occurred while removing all DadosPessoais."
                });
        });
};