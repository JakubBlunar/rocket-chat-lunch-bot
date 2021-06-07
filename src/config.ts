import * as _ from 'lodash'
export const CONFIG = Object.seal({
  host: process.env.ROCKETCHAT_URL,
  user: process.env.ROCKETCHAT_USER,
  pass: process.env.ROCKETCHAT_PASSWORD,
  ssl: process.env.SSL == 'true',
  rooms: _.reject(
    _.split(process.env.BOT_SHELL_ROOM_NAME, ','),
    _.isEmpty
  ) as string[],
  prod: process.env.NODE_ENV == 'Production'
})
