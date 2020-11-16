# Backwater Systems – Core

A web browser–hosted runtime library

---

## Components

- ### Errors (`core.errors`)

    - #### `EnumerationValidationError`
    - #### `HTTPResponseError`
    - #### `ImplementationError`
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
        - #### `get`
        - #### `head`
        - #### `parseResponse`
        - #### `post`
        - #### `put`
        - #### `sendRequest`

    - ### Hash Parameters (`core.webUtilities.hashParameters`)

        - #### `getList`
        - #### `getValue`
        - #### `setValue`

    - #### `injectHTML`

- ### Reference Data (`core.REFERENCE`)

---

Designed by [Nate Gehringer](mailto:ngehringer@gmail.com).

© 2017 [Backwater Systems](https://backwater.systems)
