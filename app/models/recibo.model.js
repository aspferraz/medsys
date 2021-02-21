module.exports = (sequelize, Sequelize, Model) => {

    class Recibo extends Model {
        toString() {
            return this.id;
        }
    }

    Recibo.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        data: {
            allowNull: false,
            type: Sequelize.DATEONLY
        },
        data_consulta: {
            type: Sequelize.DATEONLY
        }
    }, {
        // Other model options go here
        tableName: 'recibo',
        sequelize, // We need to pass the connection instance
        modelName: 'Recibo' // We need to choose the model name
    });

    let Servico = sequelize.models.Servico;

    Servico.hasMany(Recibo,
        {   
            as: "Recibos",
            foreignKey: {
                name: 'servico_id',
                allowNull: false
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Recibo.belongsTo(Servico, { as: "Servico", foreignKey: 'servico_id' });

    let Paciente = sequelize.models.Paciente;

    Paciente.hasMany(Recibo,
        {   
            as: "Recibos",
            foreignKey: {
                name: 'paciente_id',
                allowNull: false
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Recibo.belongsTo(Paciente, { as: "Paciente", foreignKey: 'paciente_id' });

    let DadosPessoais = sequelize.models.DadosPessoais;

    DadosPessoais.hasMany(Recibo,
        {   
            as: "Recibos",
            foreignKey: {
                name: 'dados_pessoais_responsavel_id',
                allowNull: false
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Recibo.belongsTo(DadosPessoais, { as: "ResponsavelPagamento", foreignKey: 'dados_pessoais_responsavel_id' });

    return Recibo;
}