module.exports = (sequelize, Sequelize, Model) => {

    class Paciente extends Model { 
        toString() {
            return this.id; 
        }
    }

    Paciente.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        }
    }, {
        // Other model options go here
        tableName: 'paciente',
        sequelize, // We need to pass the connection instance
        modelName: 'Paciente' // We need to choose the model name
    });

    let DadosPessoais = sequelize.models.DadosPessoais;

    DadosPessoais.hasOne(Paciente,
        {   
            as: "Paciente",
            foreignKey: {
                name: 'dados_pessoais_id',
                allowNull: false
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Paciente.belongsTo(DadosPessoais, { as: "DadosPessoais", foreignKey: 'dados_pessoais_id' });

    return Paciente;
}