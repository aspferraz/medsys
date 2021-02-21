module.exports = (sequelize, Sequelize, Model) => {

    class Profissao extends Model { 
        toString() {
            return this.nome; 
        }
    }

    Profissao.init({
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
        tableName: 'profissao',
        sequelize, // We need to pass the connection instance
        modelName: 'Profissao' // We need to choose the model name
    });

    return Profissao;
}