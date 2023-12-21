import { test } from '@japa/runner'

test.group('Requests request controller', () => {
  test('submit a support request', async ({ client }) => {
    const response = await client.post('/log-request')

    console.log(response.body())
  })
})
