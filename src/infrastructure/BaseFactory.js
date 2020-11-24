import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseFactory {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseFactory.name}`; }

  static get typeRegister() {
    // ensure the extending factory implements a “_baseType” property
    if ( !utilities.validation.validateType(this._baseType, Function) ) throw new errors.ImplementationError('_baseType', this.CLASS_NAME);

    // initialize the type register cache, if necessary
    if ( !utilities.validation.validateType(this._typeRegister, Object) ) {
      // seed the type register cache with the extending class’s “_initialTypeRegister” property, if it is valid …
      if ( utilities.validation.validateType(this._initialTypeRegister, Object) ) {
        // ensure all of the initially-registered types extend the factory’s base type
        const invalidTypeNameList = Object.keys(this._initialTypeRegister).filter(
          (typeName) => !utilities.validation.validateInheritance(this._initialTypeRegister[typeName], this._baseType)
        );
        if (invalidTypeNameList.length !== 0) {
          const typeValidationErrors = invalidTypeNameList.map(
            (typeName) => new errors.TypeValidationError(typeName, this._baseType)
          );
          if (typeValidationErrors.length === 1) throw typeValidationErrors[0];
          else throw new Error(
            typeValidationErrors
              .map( (typeValidationError) => typeValidationError.message )
              .join(' ')
          );
        }

        // populate the type register cache with the factory’s initial type register
        this._typeRegister = { ...this._initialTypeRegister };
      }
      // … otherwise, initialize an empty type register cache
      else {
        this._typeRegister = {};
      }
    }

    return this._typeRegister;
  }

  static _getType(typeName) {
    const type = this.typeRegister[typeName] ?? null;

    return type;
  }

  static create(typeName, ...rest) {
    if ( !utilities.validation.isNonEmptyString(typeName) ) throw new errors.TypeValidationError('typeName', String);

    // retrieve the specified type’s class
    const Type = this._getType(typeName);
    if (Type === null) throw new Error(`“${typeName}” is not a registered type.`);

    // create an instance of the specified class
    const instance = new Type(...rest);

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
    this.typeRegister[typeName] = typeClass;
  }

  static unregisterType(typeName) {
    if ( !utilities.validation.isNonEmptyString(typeName) ) throw new errors.TypeValidationError('typeName', String);

    // attempt to retrieve the type from the type registry
    const type = this._getType(typeName);
    if (type === null) throw new Error(`“${typeName}” is not a registered type.`);

    // remove the type from the registry
    delete this.typeRegister[typeName];
  }
}


export default BaseFactory;