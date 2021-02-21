module.exports = (sequelize, Sequelize, Model) => {

    class Servico extends Model { 
        toString() {
            return this.descricao; 
        }
    }

    Servico.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        descricao: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        valor: {
            type: Sequelize.DECIMAL(15,2),
            allowNull: false
        }
    }, {
        // Other model options go here
        tableName: 'servico',
        sequelize, // We need to pass the connection instance
        modelName: 'Servico' // We need to choose the model name
    });

    return Servico;
}