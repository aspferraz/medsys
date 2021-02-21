var path = require('path');
const Report = require('fluentreports').Report;

const db = require("../models");

const Paciente = db.pacientes;
const Op = db.Sequelize.Op;

exports.getReceitaReport = async (req, res) => {

    const paciente_id = req.query.paciente_id;
    const receita_text = req.query.receita_text;

    try {
        let paciente = await Paciente.findOne({
            where: {
                "id": {
                    [Op.eq]: paciente_id
                }
            },
            include: ["DadosPessoais"],
            raw: true,
            nest: true
        });

        let medico = {
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

        const options = {
            nome_medico: medico.nome,
            cpf_medico: medico.cpf,
            cremeb_medico: medico.cremeb,
            dt_receita: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            data: [{
                receita_text_lines: receita_text.split('\n')
            }]
        };

        console.log(paciente);


        const header = function (rpt, data) {

            rpt.newLine(3);

            rpt.print(`${medico.nome}`, {fontSize: 12, align: 2})
            rpt.print([
                        `Cremeb: ${medico.cremeb}`, 
                        `CPF: ${medico.cpf}`, 
                        `${medico.clinica.nome}`,
                        `Endereço: ${medico.clinica.endereco}`,
                        `${medico.clinica.cidade}, ${medico.clinica.uf}`, 
                        `CEP: ${medico.clinica.cep}`, 
                        `Tel.: ${medico.clinica.telefone}`], {fontSize: 10, align: 2});

            rpt.newLine(3);
            
            rpt.print([`Paciente: ${paciente.DadosPessoais.nome + " " + paciente.DadosPessoais.sobrenome}`], {fontSize: 11, fontNormal: true, align: 1})
            
            rpt.newLine(3);

            rpt.print(data.receita_text_lines, {font: "Stanford", fontSize: 18, fontItalic: true, align: 1})
        }

        const footer = function (rpt) {
            rpt.print([`${medico.clinica.cidade}, ${options.dt_receita}`], {
                fontSize: 10,
                align: 2,
                y: 740
            });
        };

        // Create a new Report Engine
        // pipeStream is predefined in this report to make it display in the browser
        const rpt = new Report(res);

        // rpt.registerFont("Celliad", {
        //     normal: path.join(__dirname,'../assets/fonts/Celliad.ttf'), 
        //     } 
        // );

        rpt.registerFont("Stanford", {
            normal: path.join(__dirname,'../assets/fonts/Stanford.ttf'), 
            } 
        );

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
            message: err.message || "Error retrieving Paciente with id=" + paciente_id
        });

    }
}