module.exports = (sequelize, Sequelize, Model) => {

    class Historico extends Model { 
        toString() {
            return this.data + ' - ' + this.evolucao; 
        }
    }

    Historico.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        data: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false  
        },
        evolucao: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        // Other model options go here
        tableName: 'historico',
        sequelize, // We need to pass the connection instance
        modelName: 'Historico' // We need to choose the model name
    });

    let Paciente = sequelize.models.Paciente;

    Paciente.hasMany(Historico,
        {   
            as: "Historicos",
            foreignKey: {
                name: 'paciente_id',
                allowNull: false
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Historico.belongsTo(Paciente, { as: "Paciente", foreignKey: 'paciente_id'});

    return Historico;
}