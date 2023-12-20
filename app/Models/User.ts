import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import SupportRequests from 'App/Models/SupportRequest'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public full_name: string

  @column()
  public email_address: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => SupportRequests)
  public supportRequests: HasMany<typeof SupportRequests>
}
