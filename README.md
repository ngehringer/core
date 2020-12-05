# Backwater Systems – Core

A web browser–hosted runtime library

---

## Components

- ### Errors (`core.errors`)

    - #### `EnumerationValidationError`
    - #### `HTTPResponseError`
    - #### `ImplementationError`
    - #### `InvalidParameterValueError`
    - #### `ItemRetrievalError`
    - #### `TypeValidationError`

- ### Infrastructure (`core.infrastructure`)

    - #### `BaseFactory`
    - #### `BaseModel`
    - #### `BaseViewModel`
    - #### `EventSource`
    - #### `PaginationOptions`
    - #### `Response`

- ### Logging (`core.logging`)

    - #### `BaseLogger`
    - #### `ConsoleLogger`
    - #### `LogItem`
    - #### `NullLogger`
    - #### `REFERENCE`

- ### Utilities (`core.utilities`)

    - ### Conversion (`core.utilities.conversion`)

        - #### `convertToDate`
        - #### `convertToNumber`

    - ### Formatting (`core.utilities.formatting`)

        - #### `formatNumber`
        - #### `pluralize`

    - ### Validation (`core.utilities.validation`)

        - #### `isNonEmptyString`
        - #### `isNumber`
        - #### `validateEnumeration`
        - #### `validateInheritance`
        - #### `validateType`

    - #### `generateUUID`

- ### Web Utilities (`core.webUtilities`)

    - ### Ajax (`core.webUtilities.ajax`)

        - #### `delete`
        - #### `generateQueryString`
        - #### `generateRequest`
        - #### `get`
        - #### `head`
        - #### `options`
        - #### `parseResponseBody`
        - #### `patch`
        - #### `post`
        - #### `put`
        - #### `sendRequest`

    - ### Hash Parameters (`core.webUtilities.hashParameters`)

        - #### `getList`
        - #### `getValue`
        - #### `setValue`

    - #### `injectHTML`

- ### Reference Data (`core.REFERENCE`)

## Development Notes

### npm Scripts

- #### `build` (alias: `build:production`)
    Builds the package into a single ECMAScript Module in the `dist/` folder using Rollup (configuration is located in `/rollup.config.js`).
- #### `build:development`
    Builds the package into a bundle of ECMAScript Modules in the `dist/` folder.
- #### `clean`
    Removes any build, test, code coverage, etc. artifacts from the package’s folder.
- #### `coverage`
    Generates a code coverage report for the unit test suite using Istanbul (configuration is located in `/.nycrc.json`). An HTML version of the report is generated in the `coverage/` folder.
- #### `lint`
    Runs ESLint on the package’s source files (configuration is located in `/.eslintrc.json`).
- #### `test`
    Executes the unit test suite using AVA (configuration is located in `/ava.config.js`).

---

Written by [Nate Gehringer](mailto:ngehringer@gmail.com).

© 2017 [Backwater Systems](https://backwater.systems/)