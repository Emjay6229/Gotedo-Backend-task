import { test } from '@japa/runner'

test.group('Requests request controller', () => {
  test('submit a support request', async ({ client }) => {
    const fields = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@example.com',
      messageTitle: 'Support Request',
      messageBody: 'This is a test support request.',
    }

    const response = await client.post('/log-request').fields(fields)
    response.assertStatus(200)
    console.log(response.body())
  })
})
