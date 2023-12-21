import { test } from '@japa/runner'
import { file } from '@ioc:Adonis/Core/Helpers'

test.group('Requests request controller', () => {
  test('submit a support request', async ({ client }) => {
    const fakeAvatar = await file.generatePng('5mb')

    const response = await client
      .post('/api/log-request')
      .file('avatar', fakeAvatar.contents, { filename: fakeAvatar.name })
      .fields({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john.doe@example.com',
        messageTitle: 'Support Request',
        messageBody: 'This is a test support request.',
      })

    response.assertStatus(200)
    console.log(response.body())
  })
})
