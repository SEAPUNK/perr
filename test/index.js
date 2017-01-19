import test from 'ava'
import perr from '../'

test('readme examples should work', t => {
  t.plan(18)

  const plainError = new Error('something happened')
  plainError.statusCode = 500
  t.is(String(plainError), 'Error: something happened')
  t.deepEqual(JSON.parse(JSON.stringify(plainError)), JSON.parse(JSON.stringify({
    statusCode: 500
  })))

  const portableError1 = perr.convert(plainError)
  t.is(String(plainError), 'Error: something happened')

  t.deepEqual(JSON.parse(JSON.stringify(portableError1)), JSON.parse(JSON.stringify({
    name: 'Error',
    message: 'something happened',
    stack: portableError1.stack
  })))

  const portableError2 = perr.convert(plainError, {
    statusCode: plainError.statusCode,
    somethingElse: 'nice'
  })
  t.is(String(portableError2), 'Error: something happened')
  t.deepEqual(JSON.parse(JSON.stringify(portableError2)), JSON.parse(JSON.stringify({
    name: 'Error',
    message: 'something happened',
    stack: portableError2.stack,
    statusCode: 500,
    somethingElse: 'nice'
  })))

  const plainErrObj = perr.toObj(plainError, {
    somethingElse: 'nice'
  })
  t.deepEqual(plainErrObj, {
    name: 'Error',
    message: 'something happened',
    stack: plainErrObj.stack,
    somethingElse: 'nice'
  })

  const obj1 = {
    name: 'Error',
    message: 'something happened',
    stack: 'Error: something happened\n   at <anonymous>:1:20',
    somethingElse: 'nice'
  }
  const createdError1 = perr.toErr(obj1)
  t.is(createdError1 instanceof Error, true)
  t.is(createdError1.stack, obj1.stack)
  t.is(createdError1.somethingElse, 'nice')

  const createdError2 = perr.toErr({
    stack: 'asdf: something happened'
  })
  t.is(createdError2 instanceof Error, true)
  t.is(createdError2.name, 'Error')
  t.is(createdError2.message, '<No error message provided>')
  t.is(createdError2.stack, 'asdf: something happened')

  const createdError3 = perr.toErr('something happened')
  t.is(createdError3 instanceof Error, true)
  t.is(createdError3.name, 'Error')
  t.is(createdError3.message, 'something happened')
  t.is(createdError3.stack, 'Error: something happened\n    at <unknown>')
})
