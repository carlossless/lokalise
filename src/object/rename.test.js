/* eslint-env jest */

import rename from './rename'

describe('rename', () => {
  it('move values from old keys to new', async () => {
    const original = {
      one: 'foo',
      two: 'bar',
      no: 'touching'
    }
    const expected = {
      three: 'foo',
      four: 'bar',
      no: 'touching'
    }
    expect(rename(original, ['one', 'two'], ['three', 'four'])).toEqual(expected)
  })
})
