const Report = require('fluentreports').Report;
// var path = require('path');
const db = require("../models");
const Recibo = db.recibos;
const Estado = db.estados;
const Cidade = db.cidades;
const Op = db.Sequelize.Op;

const extenso = require("extenso");

const getUfEstado = async function (responsavelPagamento) {
    if (responsavelPagamento.endereco) {
        try {
            let parsedEndereco = JSON.parse(responsavelPagamento.endereco);
            if (parsedEndereco.uf)
                return parsedEndereco.uf;
        } catch (SyntaxError) {
            console.log(SyntaxError.message);
        }
    }
    if (responsavelPagamento.estado_id) {
        try {
            let estado = await Estado.findOne({
                where: {
                    "id": {
                        [Op.eq]: responsavelPagamento.estado_id
                    }
                },
                raw: true,
                nest: true
            });
            return estado.uf;
        } catch (err) {
            console.log(err);
        }
    }
    return "";

}

const getNomeCidade = async function (responsavelPagamento) {
    if (responsavelPagamento.endereco) {
        try {
            let parsedEndereco = JSON.parse(responsavelPagamento.endereco);
            if (parsedEndereco.localidade)
                return parsedEndereco.localidade;
        } catch (SyntaxError) {
            console.log(SyntaxError.message);
        }
    }
    if (responsavelPagamento.cidade_id) {
        try {
            let cidade = await Cidade.findOne({
                where: {
                    "id": {
                        [Op.eq]: responsavelPagamento.cidade_id
                    }
                },
                raw: true,
                nest: true
            });
            return cidade.nome;
        } catch (err) {
            console.log(err);
        }
    }
    return "";

}

const getEnderecoFormatado = function (responsavelPagamento) {
    const enderecoStr = responsavelPagamento.endereco;
    if (enderecoStr) {
        let r = "";
        try {
            let parsedEndereco = JSON.parse(enderecoStr);
            if (parsedEndereco.logradouro)
                r += parsedEndereco.logradouro;
            if (parsedEndereco.complemento)
                r += (r.length ? " ," : "") + parsedEndereco.complemento;
            if (parsedEndereco.bairro)
                r += (r.length ? " - " : "") + parsedEndereco.bairro;
        } catch (SyntaxError) {
            console.log(SyntaxError.message);
            r = enderecoStr;
        }
        if (responsavelPagamento.cep)
            r += (r.length ? " - " : "") + "CEP: " + responsavelPagamento.cep;
        return r;
    }
    return "";
};

const getDataFormatada = function (isoDateStr) {
    if (isoDateStr) {
        return new Date(isoDateStr).toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

    }
    return "";
}

exports.getRecibosReport = async (req, res) => {
    const dt_inicial = req.query.dt_inicial;
    let dt_final = req.query.dt_final;
    const sortBy = req.query.sortby || "data";
    const sortDesc = req.query.sortdesc;
    let condition = {}
    if (dt_inicial) {
        if (!dt_final) {
            dt_final = new Date().toISOString().split("T")[0];
        }
        condition = {
            data: {
                [Op.between]: [dt_inicial, dt_final]
            }
        };
    }
    try {

        let recibos = await Recibo.findAll({
            where: condition,
            include: ["ResponsavelPagamento", {
                model: db.pacientes,
                as: "Paciente",
                include: ["DadosPessoais"]
            }, "Servico"],
            order: [
                [sortBy, sortDesc === 'true' ? 'DESC' : 'ASC']
            ],
            raw: true,
            nest: true
        });

        // console.log(recibos);

        const capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let primary_data = recibos.map(function (r) {
            let nome_responsavel = "",
                documento_responsavel = "";
            if (r.ResponsavelPagamento.tipo_pessoa === "F") {
                nome_responsavel = r.ResponsavelPagamento.nome + " " + r.ResponsavelPagamento.sobrenome;
                documento_responsavel = r.ResponsavelPagamento.cpf;
            } else if (r.ResponsavelPagamento.tipo_pessoa === "J") {
                nome_responsavel = r.ResponsavelPagamento.razao_social;
                documento_responsavel = r.ResponsavelPagamento.cnpj;
            }
            return {
                "id": r.id,
                "data": getDataFormatada(r.data),
                "mes": capitalizeFirstLetter(new Date(r.data).toLocaleString('pt-BR', {
                    month: 'long'
                })) + "." + new Date(r.data).getFullYear().toString().substr(-2),
                "data_consulta": r.data_consulta,
                "paciente.nome": r.Paciente.DadosPessoais.nome + " " + r.Paciente.DadosPessoais.sobrenome,
                "responsavel_pagamento.nome": nome_responsavel,
                "responsavel_pagamento.documento": documento_responsavel,
                "servico.descricao": r.Servico.descricao,
                "servico.valor": r.Servico.valor
            };
        });

        var detail = function (x, r) {
            x.fontSize(9);
            x.band([{
                    data: r.id,
                    width: 40
                },
                {
                    data: r.data,
                    width: 50,
                    align: 3
                },
                {
                    data: r["paciente.nome"],
                    width: 140,
                    align: 3
                },
                {
                    data: r["responsavel_pagamento.nome"],
                    width: 140,
                    align: 3
                },
                {
                    data: r["responsavel_pagamento.documento"],
                    width: 70,
                    align: 3
                },
                {
                    data: r["servico.descricao"],
                    width: 60,
                    align: 3
                },
                {
                    data: r["servico.valor"],
                    width: 40,
                    align: 3
                }
            ], {
                x: 30,
                wrap: 1
            });
        };

        var mesReciboHeader = function (x, r) {
            x.fontSize(10);
            x.fontBold();
            x.band([{
                data: r.mes,
                width: 240,
                fontBold: true
            }], {
                x: 20
            });
            x.fontNormal();
            x.fontSize(9);
        };

        var mesReciboFooter = function (x, r) {
            x.fontBold();
            x.band([{
                    data: `Total em ${r.mes}: `,
                    width: 260,
                    align: 3
                },
                {
                    data: x.totals["servico.valor"],
                    width: 40,
                    align: 3
                }
            ], {
                x: 270
            });
            x.newLine();
            x.fontNormal();
        };

        var recibosHeader = function (x) {
            x.fontSize(9);
            x.band([{
                    data: 'Cod.',
                    width: 70,
                    align: 2
                },
                {
                    data: 'Data',
                    width: 50,
                    align: 1
                },
                {
                    data: 'Paciente',
                    width: 140,
                    align: 1
                },
                {
                    data: 'Responsável pelo pagamento',
                    width: 140,
                    align: 1
                },
                {
                    data: 'Doc. Responsável',
                    width: 70,
                    align: 1
                },
                {
                    data: 'Serviço',
                    width: 60,
                    align: 1
                },
                {
                    data: 'Valor(R$)',
                    width: 40,
                    align: 1
                }
            ], {
                x: 0
            }); // , font: "AldotheApache"});
            x.bandLine(1);
        };

        var finalSummary = function (x) {
            x.bandLine(1);
            x.fontSize(11);
            x.fontBold();
            x.band([{
                    data: `Total Geral: `,
                    width: 250,
                    align: 3
                },
                {
                    data: x.totals["servico.valor"],
                    width: 50,
                    align: 3
                }
            ], {
                x: 270
            });
        };

        const rpt = new Report(res)
            .data(primary_data)
            .margins(20)
            .pageheader(["Recibos por período: " + (dt_inicial ? `De ${getDataFormatada(dt_inicial)} até ${getDataFormatada(dt_final)}` : "Todos")])
            .finalSummary(finalSummary)
            .detail(detail)
            .sum("servico.valor")
            .groupBy("mes")
            .header(recibosHeader)
            .groupBy("mes")
            .sum("servico.valor")
            .header(mesReciboHeader)
            .footer(mesReciboFooter);


        rpt.render();

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Recibos."
        });
    }
}

exports.getReciboReport = async (req, res) => {
    const id = req.params.id;
    const descricao_servico = req.query.descricao_servico;
    const valor_servico = req.query.valor_servico;

    console.log("id: " + id, "descricao_servico: " + descricao_servico, "valor_servico: " + valor_servico);

    try {
        let recibo = await Recibo.findOne({
            where: {
                "id": {
                    [Op.eq]: id
                }
            },
            include: ["ResponsavelPagamento", {
                model: db.pacientes,
                as: "Paciente",
                include: ["DadosPessoais"]
            }, "Servico"],
            raw: true,
            nest: true
        });

        console.log(recibo);

        recibo.medico = {
            nome: "Dr. Silvio Marques",
            cremeb: "1729",
            cpf: "002.883.305-87",
            clinica: {
                nome: "Gastroenterologia e Clínica Geral",
                cep: "44001-205",
                endereco: "R Barão do Rio Branco, 1345 - Centro",
                cidade: "Feira de Santana",
                uf: "BA",
                telefone: "(75) 3623-0522"
            }
        };

        if (valor_servico) {
            recibo.Servico.valor = valor_servico*1;
        }
        if (descricao_servico) {
            recibo.Servico.descricao = descricao_servico;
        }

        console.log(recibo.Servico.descricao);
        console.log(recibo.Servico.valor);


        // Interesting Data Structure, but we can still use it...
        const options = {
            nome_medico: recibo.medico.nome,
            cpf_medico: recibo.medico.cpf,
            cremeb_medico: recibo.medico.cremeb,
            dt_recibo: new Date(recibo.data).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            data: [{
                id: recibo.id,
                dt_consulta: recibo.data_consulta ? new Date(recibo.data_consulta).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : "",
                nome_paciente: recibo.Paciente.DadosPessoais.nome + " " + recibo.Paciente.DadosPessoais.sobrenome,
                cpf_paciente: recibo.Paciente.DadosPessoais.cpf,
                is_paciente_pagador: recibo.Paciente.DadosPessoais.id === recibo.ResponsavelPagamento.id,
                nome_responsavel: recibo.ResponsavelPagamento.tipo_pessoa === "F" ? recibo.ResponsavelPagamento.nome + " " + recibo.ResponsavelPagamento.sobrenome : recibo.ResponsavelPagamento.razao_social,
                documento_responsavel: recibo.ResponsavelPagamento.tipo_pessoa === "F" ? recibo.ResponsavelPagamento.cpf : recibo.ResponsavelPagamento.cnpj,
                tipo_documento_responsavel: recibo.ResponsavelPagamento.tipo_pessoa === "F" ? "CPF" : "CNPJ",
                endereco_responsavel: getEnderecoFormatado(recibo.ResponsavelPagamento),
                estado_uf_responsavel: await getUfEstado(recibo.ResponsavelPagamento),
                cidade_responsavel: await getNomeCidade(recibo.ResponsavelPagamento),
                telefone_responsavel: recibo.ResponsavelPagamento.telefone,
                descricao_servico: recibo.Servico.descricao,
                valor_servico: (recibo.Servico.valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                valor_servico_por_extenso: 
                extenso((recibo.Servico.valor).toLocaleString('pt-BR'), {
                    mode: 'currency'
                })
            }]
        };

        // This is your routine that gets run any time a header needs to be printed.
        const header = function (rpt, data) {

            rpt.newLine(5);

            rpt.print(`${recibo.medico.nome}`, {
                fontSize: 12,
                align: 2
            })
            rpt.print([
                `Cremeb: ${recibo.medico.cremeb}`,
                `CPF: ${recibo.medico.cpf}`,
                `${recibo.medico.clinica.nome}`,
                `Endereço: ${recibo.medico.clinica.endereco}`,
                `${recibo.medico.clinica.cidade}, ${recibo.medico.clinica.uf}`,
                `CEP: ${recibo.medico.clinica.cep}`,
                `Tel.: ${recibo.medico.clinica.telefone}`
            ], {
                fontSize: 10,
                align: 2
            });

            rpt.newLine(4);

            rpt.print([`RECIBO`], {
                fontSize: 12,
                align: 2
            })
            // rpt.print([`RECIBO nº ${recibo.id}`], {fontSize: 11, align: 2})


            rpt.fontSize(11);
            rpt.newLine(6);


            const dadosPacienteStr = data.is_paciente_pagador ? "ao(a) mesmo(a)" : `a ${data.nome_paciente}, CPF: ${data.cpf_paciente || "(não informado)"}`;

            rpt.print([
                `   Recebi de ${data.nome_responsavel}, ${data.tipo_documento_responsavel}: ${data.documento_responsavel}, a importância de ${data.valor_servico} (${data.valor_servico_por_extenso}) por serviços de ${data.descricao_servico} prestados ${dadosPacienteStr} em ${data.dt_consulta},   `
            ], {});


        };

        // And this is the function that runs anytime a footer needs to get run.
        const footer = function (rpt) {
            rpt.print([`${recibo.medico.clinica.cidade}, ${options.dt_recibo}`], {
                fontSize: 11,
                align: 3,
                y: 440
            });
        };

        // Create a new Report Engine
        // pipeStream is predefined in this report to make it display in the browser
        const rpt = new Report(res);

        // Configure the Defaults
        rpt
            .margins(30)
            .header(header)
            .pageFooter(footer)
            .data(options.data);

        // Run the Report
        // displayReport is predefined to make it display in the browser
        rpt.render();

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Error retrieving Recibo with id=" + id
        });
    }
};