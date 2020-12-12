import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseFactory {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseFactory.name}`; }

  static get typeRegister() {
    // abort if the extending factory does not implement a `_baseType` property
    if (typeof this._baseType !== 'function') throw new errors.ImplementationError('_baseType', this.CLASS_NAME);

    // initialize the type register cache, if necessary
    if (
      (typeof this._typeRegister !== 'object')
      || (this._typeRegister === null)
    ) {
      // seed the type register cache with the extending class’s “_initialTypeRegister” property, if it is valid …
      if (
        (typeof this._initialTypeRegister === 'object')
        && (this._initialTypeRegister !== null)
      ) {
        /**
         * The list of the names of the initially-registered types that do not extend the factory’s base type
         */
        const invalidTypeNameList = Object.keys(this._initialTypeRegister).filter(
          (typeName) => !utilities.validation.validateInheritance(this._initialTypeRegister[typeName], this._baseType)
        );
        if (invalidTypeNameList.length !== 0) {
          /**
           * A list of `TypeValidationError`s describing the initially-registered types that do not extend the factory’s base type
           */
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

        /**
         * The factory’s type register cache
         * @private
         */
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
    /**
     * The specified type class from the register (or `null`)
     */
    const type = this.typeRegister[typeName] ?? null;

    return type;
  }

  static create(typeName, ...rest) {
    // abort if the specified `typeName` parameter value is invalid
    if (
      (typeof typeName !== 'string')
      || !utilities.validation.isNonEmptyString(typeName)
    ) throw new errors.TypeValidationError('typeName', String);

    /**
     * The class of the specified type
     */
    const Type = this._getType(typeName);

    // abort if the specified type was not retrieved from the type register
    if (Type === null) throw new Error(`“${typeName}” is not a registered type.`);

    /**
     * A new instance of the specified class, provided the specified parameters
     */
    const instance = new Type(...rest);

    return instance;
  }

  static registerType(typeName, typeClass) {
    // abort if the extending factory does not implement a `_baseType` property
    if (typeof this._baseType !== 'function') throw new errors.ImplementationError('_baseType', this.CLASS_NAME);

    // abort if the specified `typeName` parameter value is invalid
    if (
      (typeof typeName !== 'string')
      || !utilities.validation.isNonEmptyString(typeName)
    ) throw new errors.TypeValidationError('typeName', String);

    // abort if the specified `typeClass` parameter value is invalid
    if (typeof typeClass !== 'function') throw new errors.TypeValidationError('typeClass', Function);

    // abort if the specified class does not extend the factory’s base type
    if ( !utilities.validation.validateInheritance(typeClass, this._baseType) ) throw new errors.TypeValidationError('typeClass', this._baseType);

    /**
     * The type retrieved from the type registry
     */
    const type = this._getType(typeName);
    if (type !== null) throw new Error(`“${typeName}” is already a registered type.`);

    // add the type to the registry
    this.typeRegister[typeName] = typeClass;
  }

  static unregisterType(typeName) {
    // abort if the specified `typeName` parameter value is invalid
    if (
      (typeof typeName !== 'string')
      || !utilities.validation.isNonEmptyString(typeName)
    ) throw new errors.TypeValidationError('typeName', String);

    /**
     * The type retrieved from the type registry
     */
    const type = this._getType(typeName);
    if (type === null) throw new Error(`“${typeName}” is not a registered type.`);

    // remove the type from the registry
    delete this.typeRegister[typeName];
  }
}


export default BaseFactory;