perr
===

[![npm version](https://img.shields.io/npm/v/perr.svg?style=flat-square)](https://npmjs.com/package/perr)
[![javascript standard style](https://img.shields.io/badge/code%20style-standard-blue.svg?style=flat-square)](http://standardjs.com/)
[![travis build](https://img.shields.io/travis/SEAPUNK/perr/master.svg?style=flat-square)](https://travis-ci.org/SEAPUNK/perr)
[![coveralls coverage](https://img.shields.io/coveralls/SEAPUNK/perr.svg?style=flat-square)](https://coveralls.io/github/SEAPUNK/perr)
[![david dependencies](https://david-dm.org/SEAPUNK/perr.svg?style=flat-square)](https://david-dm.org/SEAPUNK/perr)
[![david dev dependencies](https://david-dm.org/SEAPUNK/perr/dev-status.svg?style=flat-square)](https://david-dm.org/SEAPUNK/perr)

Portable errors for Javascript

`npm install perr`

- [usage](#usage)

---

usage
---

```js
import perr from 'perr'

//
// Perr lets you create "portable" error objects to use throughout
// your applications.
//

const plainError = new Error('something happened')
plainError.statusCode = 500
String(plainError) // Error: something happened
JSON.parse(JSON.stringify(plainError))
// {
//   "statusCode": 500
// }

//
// Now, let's try to create a portable error out of this.
// perr.convert(err, props) takes an Error instance and an
// optional "props" object, and returns an Error instance,
// modified to be JSON stringifiable
//

const portableError1 = perr.convert(plainError)
String(portableError1) // Error: something happened
JSON.parse(JSON.stringify(portableError1))
// {
//   "name": "Error",
//   "message": "something happened",
//   "stack": "Error: something happened\n   at <anonymous>:1:20"
// }

//
// Even if the plain error's properties are enumerable, perr.convert(err, props)
// does not pick them onto the portable error unless you explicitly specify
// so.
// This is to prevent surprises, since with modules like `got()`, errors can
// have additional properties which aren't necessarily enumerable.
//

const portableError2 = perr.convert(plainError, {
  statusCode: plainError.statusCode,
  somethingElse: 'nice'
})
String(portableError2) // Error: something happened
JSON.parse(JSON.stringify(portableError2))
// {
//   "name": "Error",
//   "message": "something happened",
//   "stack": "Error: something happened\n   at <anonymous>:1:20",
//   "statusCode": 500,
//   "somethingElse": "nice"
// }

//
// perr.toObj(err, props) creates a plain object from an error.
// This is a more efficient equivalent of calling
// JSON.parse(JSON.stringify(perr.toObj(err, props)))
//
// This works on both plain and "portable" errors.
//

const plainErrObj = perr.toObj(plainError, {
  somethingElse: 'nice'
})
// {
//   "name": "Error",
//   "message": "something happened",
//   "stack": "Error: something happened\n   at <anonymous>:1:20",
//   "somethingElse": "nice"
// }

//
// perr.toErr(obj) converts an error object to a portable Error
// instance. The error will be run through the guaranteed-error module,
// to fill in name, message, and stack, if they are missing.
//
// If obj is a simple string, that will be the error's `message`.
//

const createdError1 = perr.toErr({
  name: 'Error',
  message: 'something happened',
  stack: 'Error: something happened\n   at <anonymous>:1:20',
  somethingElse: 'nice'
})
createdError1 instanceof Error // true
createdError1.stack // Error: something happened\n   at <anonymous>:1:20
createdError1.somethingElse // nice

const createdError2 = perr.toErr({
  stack: 'asdf: something happened'
})
createdError2.name // Error
createdError2.message // <No error message provided>
createdError2.stack // asdf: something happened

const createdError3 = perr.toErr('something happened')
createdError3.name // Error
createdError3.message // something happened
createdError3.stack // Error: something happened\n    at <unknown>

```
