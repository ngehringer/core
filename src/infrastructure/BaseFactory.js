import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseFactory {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseFactory.name}`; }

  static get typeList() {
    // ensure the extending class implements a “_baseType” property
    if ( !utilities.validation.validateType(this._baseType, Function) ) throw new errors.ImplementationError('_baseType', this.CLASS_NAME);

    // initialize the registered type list, if necessary
    if ( !utilities.validation.validateType(this._typeList, Object) ) {
      // attempt to seed the registered type list with the extending class’s “_initialTypeList” property
      if ( utilities.validation.validateType(this._initialTypeList, Object) ) {
        // ensure all of the initially-registered types extend the factory’s base type
        const invalidTypeNameList = Object.keys(this._initialTypeList).filter(
          (typeName) => !utilities.validation.validateInheritance(this._initialTypeList[typeName], this._baseType)
        );
        if (invalidTypeNameList.length !== 0) {
          const implementationErrors = invalidTypeNameList.map(
            (typeName) => new errors.TypeValidationError(typeName, this._baseType)
          );
          throw implementationErrors;
        }

        // build the type register from the factory’s initial type list
        this._typeList = { ...this._initialTypeList };
      }
      else {
        this._typeList = {};
      }
    }

    return this._typeList;
  }

  static _getType(typeName) {
    const type = this.typeList[typeName] || null;

    return type;
  }

  static create(typeName, options) {
    if ( !utilities.validation.isNonEmptyString(typeName) ) throw new errors.TypeValidationError('typeName', String);
    if ( !utilities.validation.validateType(options, Object) && (options !== null) ) throw new errors.TypeValidationError('options', Object);

    // retrieve the specified type’s class
    const Type = this._getType(typeName);
    if (Type === null) throw new Error(`“${typeName}” is not a registered type.`);

    // create an instance of the specified class
    const instance = new Type(options);

    return instance;
  }

  static registerType(typeName, typeClass) {
    // ensure the extending class implements a “_baseType” property
    if ( !utilities.validation.validateType(this._baseType, Function) ) throw new errors.ImplementationError('_baseType', this.CLASS_NAME);

    if ( !utilities.validation.isNonEmptyString(typeName) ) throw new errors.TypeValidationError('typeName', String);
    if ( !utilities.validation.validateType(typeClass, Function) ) throw new errors.TypeValidationError('typeClass', Function);
    // ensure the specified class extends the factory’s base type
    if ( !utilities.validation.validateInheritance(typeClass, this._baseType) ) throw new errors.TypeValidationError('typeClass', this._baseType);

    // attempt to retrieve the type from the type registry
    const type = this._getType(typeName);
    if (type !== null) throw new Error(`“${typeName}” is already a registered type.`);

    // add the type to the registry
    this.typeList[typeName] = typeClass;
  }

  static unregisterType(typeName) {
    if ( !utilities.validation.isNonEmptyString(typeName) ) throw new errors.TypeValidationError('typeName', String);

    // attempt to retrieve the type from the type registry
    const type = this._getType(typeName);
    if (type === null) throw new Error(`“${typeName}” is not a registered type.`);

    // remove the type from the registry
    delete this.typeList[typeName];
  }
}


export default BaseFactory;