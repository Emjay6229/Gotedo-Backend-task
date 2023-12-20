import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportRequest from 'App/Models/SupportRequest'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

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

      // check if user exists in the users table
      const checkEmail = await User.findBy('email', payload.emailAddress)
      if (!checkEmail) return "This user doesn't exist in the users table"

      // create and save a new request
      const supportRequest = new SupportRequest()

      supportRequest.first_name = payload.firstName
      supportRequest.last_name = payload.lastName
      supportRequest.email_address = payload.emailAddress
      supportRequest.message_title = payload.messageTitle
      supportRequest.message_body = payload.messageBody
      supportRequest.user_id = payload.emailAddress

      // Handle file upload
      if (payload.file && payload.file.isValid) {
        await payload.file.move(Application.tmpPath('file-uploads'))
        supportRequest.file_name = payload.file.clientName
      } else {
        console.log('Problem with file. Check file upload or file type')
      }

      await supportRequest.save()

      return response.status(201).json({
        supportRequest,
        isPersisted: supportRequest.$isPersisted,
      })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async getAllUsers({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      return response.status(201).json(users)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public getRequests() {}

  public async getRequestByUserId({ request, response }: HttpContextContract) {
    try {
      const params = request.params()
      const requests = await SupportRequest.findBy('email', params.id)
      return response.status(201).json(requests)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
