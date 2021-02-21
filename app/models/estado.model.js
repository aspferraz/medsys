module.exports = (sequelize, Sequelize, Model) => {

    class Estado extends Model { 
        toString() {
            return this.nome; 
        }
    }

    Estado.init({
        // Model attributes are defined here
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        nome: {
            type: Sequelize.STRING
        },
        uf: {
            type: Sequelize.STRING
        }
    }, {
        // Other model options go here
        tableName: 'estado',
        sequelize, // We need to pass the connection instance
        modelName: 'Estado' // We need to choose the model name
    });

    return Estado;
}