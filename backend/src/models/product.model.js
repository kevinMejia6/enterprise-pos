


// Este archivo define el modelo de datos para la entidad "Product" en la base de datos.

const { DataTypes, Model } = require('sequelize');

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },

        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'El nombre del producto es obligatorio'
            },
            len: {
              args: [2, 150],
              msg: 'El nombre debe contener entre 2 y 150 caracteres'
            }
          }
        },

        barcode: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: {
            name: 'products_barcode_unique',
            msg: 'El código de barras ya está registrado'
          },
          validate: {
            notEmpty: {
              msg: 'El código de barras es obligatorio'
            },
            len: {
              args: [3, 100],
              msg: 'El código de barras debe contener entre 3 y 100 caracteres'
            }
          }
        },

        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          get() {
            const value = this.getDataValue('price');
            return value === null ? null : Number(value);
          },
          validate: {
            isDecimal: {
              msg: 'El precio debe ser un valor numérico'
            },
            min: {
              args: [0.01],
              msg: 'El precio debe ser mayor que cero'
            }
          }
        },

        description: {
          type: DataTypes.STRING(500),
          allowNull: true
        },

        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        defaultScope: {
          attributes: {
            exclude: []
          }
        }
      }
    );

    return Product;
  }
}

module.exports = Product;