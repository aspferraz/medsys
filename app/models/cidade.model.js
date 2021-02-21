module.exports = (sequelize, Sequelize, Model) => {

    class Cidade extends Model {
        toString() {
            return this.nome;
        }
    }

    Cidade.init({
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
    }, {
        // Other model options go here
        tableName: 'cidade',
        sequelize, // We need to pass the connection instance
        modelName: 'Cidade' // We need to choose the model name
    });

    let Estado = sequelize.models.Estado;

    Estado.hasMany(Cidade,
        {   
            as: "Cidades",
            foreignKey: {
                name: 'estado_id',
                allowNull: true
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    );
        
    Cidade.belongsTo(Estado, { as: "Estado", foreignKey: 'estado_id' });

    return Cidade;
}