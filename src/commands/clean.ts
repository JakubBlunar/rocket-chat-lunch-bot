import { Command } from '../types'
import { api } from '@rocket.chat/sdk'

export const clean: Command = {
  name: 'clean!',
  execute: async (message) => {
    const maxDate = new Date(8640000000000000)
    const minDate = new Date(-8640000000000000)

    await api.post('rooms.cleanHistory', {
      roomId: message.rid,
      latest: maxDate,
      oldest: minDate
    })
  }
}
