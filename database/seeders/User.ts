import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        full_name: 'Jane Doe',
        email_address: 'janedoe@gmail.com',
      },

      {
        full_name: 'Gill Christopher',
        email_address: 'gillchris@gmail.com',
      },

      {
        full_name: 'Sally Pol',
        email_address: 'sallypol@gmail.com',
      },

      {
        full_name: 'Sean Blackface',
        email_address: 'blacksean@gmail.com',
      },

      {
        full_name: 'Rosey Cole',
        email_address: 'roseycole@gmail.com',
      },

      {
        full_name: 'Marie Currie',
        email_address: 'mariecurrie@gmail.com',
      },

      {
        full_name: 'Sarah Connor',
        email_address: 'sarahconnor@gmail.com',
      },

      {
        full_name: 'Julie James',
        email_address: 'juliejames@gmail.com',
      },

      {
        full_name: 'Danny Brian',
        email_address: 'dannyBrian@gmail.com',
      },

      {
        full_name: 'Johnny Bravo',
        email_address: 'johnnyBravo@gmail.com',
      },
    ])
  }
}
