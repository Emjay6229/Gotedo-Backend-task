import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportRequest from 'App/Models/SupportRequest'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class RequestsController {
  public async handleCreateSupportRequest({ request, response }: HttpContextContract) {
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

      const supportRequest = new SupportRequest()

      const user = await User.findBy('email_address', payload.emailAddress)

      /* If user doesn't exist in the users table, create new user 
          and establish table relationship using user id.
      */
      if (!user) {
        const userObj = {
          full_name: `${payload.firstName} ${payload.lastName}`,
          email_address: payload.emailAddress,
        }

        const newUser = await User.create(userObj)
        supportRequest.user_id = newUser.id
      } else {
        supportRequest.user_id = user.id
      }

      supportRequest.first_name = payload.firstName
      supportRequest.last_name = payload.lastName
      supportRequest.email_address = payload.emailAddress
      supportRequest.message_title = payload.messageTitle
      supportRequest.message_body = payload.messageBody

      // Handle file upload
      if (!payload.file || !payload.file.isValid) return 'File Not Uploaded'

      await payload.file?.move(Application.tmpPath('file-uploads'))
      supportRequest.file_name = payload.file?.clientName

      // save request and return response
      await supportRequest.save()

      return response.status(201).json({
        supportRequest,
        fileUpload: 'Successful',
        isPersisted: supportRequest.$isPersisted,
      })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async getAllUsers({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      return response.status(200).json(users)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // Show multiple Support Request with same email
  public async showMultipleSupportRequest({ params, response }: HttpContextContract) {
    try {
      const email = params.email
      const requests = await SupportRequest.query().where('email_address', email)
      return response.status(200).json(requests)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
