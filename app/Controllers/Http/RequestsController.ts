import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Request from 'App/Models/SupportRequest'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RequestsController {
  public async handleRequest({ request, response }: HttpContextContract) {
    // Define validation schema
    const newRequestSchema = schema.create({
      firstName: schema.string(),
      lastName: schema.string(),
      emailAddress: schema.string({}, [rules.email()]),
      messageTitle: schema.string(),
      messageBody: schema.string(),
      file: schema.file.optional({
        size: '5mb',
        extnames: ['pdf', 'jpg', 'png'],
      }),
    })

    try {
      // validate requests
      const payload = await request.validate({ schema: newRequestSchema })

      // create and save a new request
      const supportRequest = new Request()

      supportRequest.first_name = payload.firstName
      supportRequest.last_name = payload.lastName
      supportRequest.message_title = payload.messageTitle
      supportRequest.message_body = payload.messageBody
      supportRequest.user_id = payload.emailAddress

      await payload.file?.moveToDisk('./')

      supportRequest.file_name = payload.file?.clientName

      await supportRequest.save()

      console.log(supportRequest)

      return supportRequest
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async getUsers() {}

  public getRequests() {}

  public getSingleRequest() {}
}
