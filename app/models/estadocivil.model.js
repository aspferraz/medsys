module.exports = (sequelize, Sequelize, Model) => {

    class EstadoCivil extends Model { 
        toString() {
            return this.nome; 
        }
    }

    EstadoCivil.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        nome: {
            type: Sequelize.STRING
        }
    }, {
        // Other model options go here
        tableName: 'estado_civil',
        sequelize, // We need to pass the connection instance
        modelName: 'EstadoCivil' // We need to choose the model name
    });

    return EstadoCivil;
}