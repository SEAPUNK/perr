'use strict'

const guaranteedError = require('guaranteed-error')

function makePortableError (srcErr, extras) {
  const err = new Error('')
  Object.defineProperty(err, 'name', {
    value: srcErr.name,
    enumerable: true,
    configurable: true,
    writable: true
  })
  Object.defineProperty(err, 'message', {
    value: srcErr.message,
    enumerable: true,
    configurable: true,
    writable: true
  })
  Object.defineProperty(err, 'stack', {
    value: srcErr.stack,
    enumerable: true,
    configurable: true,
    writable: true
  })

  Object.defineProperty(err, 'toJSON', {
    value: function () {
      const retval = {}
      for (let key of Object.keys(this)) {
        retval[key] = this[key]
      }
      return retval
    },
    enumerable: false,
    configrable: true,
    writable: true
  })

  if (extras) {
    for (let key of Object.keys(extras)) {
      Object.defineProperty(err, key, {
        value: extras[key],
        enumerable: true,
        configurable: true,
        writable: true
      })
    }
  }

  return err
}

function objectToError (obj) {
  // Create a dummy error.
  let err = new Error('')
  const extras = {}

  // Delete existing fields, to make room for guaranteed-error.
  delete err.name
  delete err.message
  delete err.stack

  if (!obj) {
    // Don't do anything, guaranteedError will fill the fields in.
  } else if (typeof obj === 'string') {
    err.message = obj
  } else {
    err.name = obj.name
    err.message = obj.message
    err.stack = obj.stack

    for (let key of Object.keys(obj)) {
      if (key === 'name' || key === 'message' || key === 'stack') continue
      Object.defineProperty(extras, key, {
        value: obj[key],
        enumerable: true,
        configurable: true,
        writable: true
      })
    }
  }

  // Run through guaranteedError
  err = guaranteedError(err)

  // Make portable
  return makePortableError(err, extras)
}

function errorToObject (err, extras) {
  let retval = {}

  // portable errors have toJSON defined, and
  // we are going to use all of its enumerable properties
  if (err.toJSON) {
    for (let key of Object.keys(err)) {
      retval[key] = err[key]
    }
  } else {
    retval = {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  }

  if (extras) {
    for (let key of Object.keys(extras)) {
      Object.defineProperty(retval, key, {
        value: extras[key],
        enumerable: true,
        configurable: true,
        writable: true
      })
    }
  }
  return retval
}

exports.convert = makePortableError
exports.toErr = objectToError
exports.toObj = errorToObject
