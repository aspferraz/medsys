module.exports = (sequelize, Sequelize, Model) => {

    class DadosPessoais extends Model {

        getNomeCompleto() {
            return this.nome + ' ' + this.sobrenome;
        }

        toString() {
            return this.getNomeCompleto();
        }
    }

    DadosPessoais.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        tipo_pessoa: {
            type: Sequelize.STRING(1),
            defaultValue: "F",
            validate: {
                isIn: {
                    args: [
                        ['F', 'J']
                    ],
                    msg: "Must be F or J"
                }
            }
        },
        nome: {
            type: Sequelize.STRING,
        },
        sobrenome: {
            type: Sequelize.STRING
        },
        sexo: {
            type: Sequelize.STRING(1),
            validate: {
                isIn: {
                    args: [
                        ['M', 'F']
                    ],
                    msg: "Must be M or F"
                }
            }
        },
        dt_nascimento: {
            type: Sequelize.DATEONLY,
            validade: {
                isBefore: {
                    args: (new Date()).toISOString().substring(0, 10),
                    msg: "Must be before today"
                }
            }
        },
        razao_social: {
            type: Sequelize.STRING
        },
        nome_fantasia: {
            type: Sequelize.STRING
        },
        rg: {
            type: Sequelize.STRING(15),
            unique: 'uq_rg_orgao_emissor'
        },
        orgao_emissor: {
            type: Sequelize.STRING(56),
            unique: 'uq_rg_orgao_emissor'
        },
        cpf: {
            type: Sequelize.STRING(15),
            unique: 'uq_cpf'

        }, 
        cnpj: {
            type: Sequelize.STRING(19),
            unique: 'uq_cnpj'

        },
        nie: {
            type: Sequelize.STRING(20)

        },
        nim: {
            type: Sequelize.STRING(20)

        },
        email: {
            type: Sequelize.STRING(100)

        },
        website: {
            type: Sequelize.STRING(100)
        },
        telefone: {
            type: Sequelize.BIGINT(14)  
        },
        celular: {
            type: Sequelize.BIGINT(14)  
        },
        cep: {
            type: Sequelize.STRING(10)
        },
        endereco: {
            type: Sequelize.TEXT
        },
        pagador: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        }


    }, {
        // Other model options go here
        uniqueKeys: {
            uq_rg_orgao_emissor: {
                fields: ['rg', 'orgao_emissor']
            },
            uq_cpf: {
                fields: ['cpf']
            },
            uq_cnpj: {
                fields: ['cnpj']
            }
        },
        tableName: 'dados_pessoais',
        sequelize, // We need to pass the connection instance
        modelName: 'DadosPessoais' // We need to choose the model name
    });

    let Estado = sequelize.models.Estado;

    Estado.hasMany(DadosPessoais,
        {   
            as: "DadosPessoais",
            foreignKey: {
                name: 'estado_id',
                allowNull: true
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    DadosPessoais.belongsTo(Estado, { as: "Estado", foreignKey: 'estado_id' });

    let Cidade = sequelize.models.Cidade;

    Cidade.hasMany(DadosPessoais,
        {   
            as: "DadosPessoais",
            foreignKey: {
                name: 'cidade_id',
                allowNull: true
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    DadosPessoais.belongsTo(Cidade, { as: "Cidade", foreignKey: 'cidade_id' });

    let EstadoCivil = sequelize.models.EstadoCivil;

    EstadoCivil.hasMany(DadosPessoais,
        {   
            as: "DadosPessoais",
            foreignKey: {
                name: 'estado_civil_id',
                allowNull: true
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    DadosPessoais.belongsTo(EstadoCivil, { as: "EstadoCivil", foreignKey: 'estado_civil_id' });

    let Profissao = sequelize.models.Profissao;

    Profissao.hasMany(DadosPessoais,
        {   
            as: "DadosPessoais",
            foreignKey: {
                name: 'profissao_id',
                allowNull: true
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    DadosPessoais.belongsTo(Profissao, { as: "Profissao", foreignKey: 'profissao_id' });

    return DadosPessoais;
}