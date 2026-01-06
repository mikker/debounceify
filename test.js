const test = require('brittle')
const debounce = require('./')

test('basic', async function (t) {
  t.plan(2)
  const d = debounce(() => {
    t.pass('called')
  })

  for (let i = 0; i < 100; i++) d()
  await d()
})

test('debounced returns', async function (t) {
  t.plan(3)

  let cnt = 0
  const d = debounce(() => {
    t.pass('called')
    return cnt++
  })

  for (let i = 0; i < 100; i++) d()
  t.alike(await d(), 1)
})

test('debounced throws', async function (t) {
  t.plan(4)

  let cnt = 0
  const d = debounce(async () => {
    t.pass('called')
    cnt++
    if (cnt === 1) {
      throw new Error('sup')
    }
    return cnt
  })

  d().catch((err) => t.alike(err.message, 'sup'))
  d()
  d()
  d()
  t.alike(await d(), 2)
})
