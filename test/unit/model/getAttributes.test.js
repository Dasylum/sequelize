'use strict';

const chai = require('chai');

const expect = chai.expect;
const Support = require('../support');

const current = Support.sequelize;
const _ = require('lodash');
const DataTypes = require('sequelize/lib/data-types');

function assertDataType(property, dataType) {
  expect(property.type.constructor.key).to.equal(dataType.key);
}

describe(Support.getTestDialectTeaser('Model'), () => {
  describe('getAttributes', () => {
    it('should return attributes with getAttributes()', () => {
      const Model = current.define(
        'User',
        { username: DataTypes.STRING },
        { timestamps: false },
      );
      const attributes = Model.getAttributes();

      expect(Object.keys(attributes)).to.eql(['id', 'username']);

      // Type must be casted or it will cause circular references errors
      assertDataType(attributes.id, DataTypes.INTEGER);
      assertDataType(attributes.username, DataTypes.STRING);

      expect(attributes.id).to.include({
        Model,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        _autoGenerated: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id',
      });
      expect(attributes.username).to.include({
        Model,
        fieldName: 'username',
        _modelAttribute: true,
        field: 'username',
      });
    });

    it('will contain timestamps if enabled', () => {
      const Model = current.define('User', { username: DataTypes.STRING });
      const attributes = Model.getAttributes();

      expect(Object.keys(attributes)).to.include.members([
        'createdAt',
        'updatedAt',
      ]);

      // Type must be casted or it will cause circular references errors
      assertDataType(attributes.createdAt, DataTypes.DATE);
      assertDataType(attributes.updatedAt, DataTypes.DATE);

      expect(attributes.createdAt).to.include({
        allowNull: false,
        _autoGenerated: true,
        Model,
        fieldName: 'createdAt',
        _modelAttribute: true,
        field: 'createdAt',
      });
      expect(attributes.updatedAt).to.include({
        allowNull: false,
        _autoGenerated: true,
        Model,
        fieldName: 'updatedAt',
        _modelAttribute: true,
        field: 'updatedAt',
      });
    });

    it('will contain timestamps if enabled', () => {
      const Model = current.define(
        'User',
        {
          username: DataTypes.STRING,
          virtual: {
            type: DataTypes.VIRTUAL,
            get() {
              return 1;
            },
          },
        },
        { timestamps: false },
      );
      const attributes = Model.getAttributes();

      expect(Object.keys(attributes)).to.include.members(['virtual']);
      assertDataType(attributes.virtual, DataTypes.VIRTUAL);
      expect(attributes.virtual).to.include({
        Model,
        fieldName: 'virtual',
        _modelAttribute: true,
        field: 'virtual',
      });
    });
  });
});
