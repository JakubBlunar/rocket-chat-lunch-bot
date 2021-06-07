// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv')
const result = dotenv.config({
  path: `.env.${process.env.NODE_ENV.toLowerCase()}`
})

if (result.error) throw result.error

import { CONFIG } from './config'
import { driver, settings } from '@rocket.chat/sdk'
import * as _ from 'lodash'
import { commands } from './commands'

let myUserId

const runBot = async () => {
  if (CONFIG.prod) {
    driver.useLog({
      debug: _.noop,
      error: console.error,
      info: _.noop,
      warn: console.warn,
      warning: console.warn
    })
  }

  settings.dm = true

  await driver.connect({ host: CONFIG.host, useSsl: CONFIG.ssl })
  myUserId = await driver.login({
    username: CONFIG.user,
    password: CONFIG.pass
  })

  await driver.joinRooms(CONFIG.rooms)
  await driver.subscribeToMessages()

  driver.reactToMessages(processMessages)

  console.log('BOT STARTED AND WAITING FOR COMMANDS')
}

const processMessages = async (err, message, messageConfig) => {
  try {
    if (CONFIG.prod) {
      if (message.bot) return
      if (!message.unread) return
    }
    if (
      messageConfig.roomType == 'c' &&
      !_.includes(CONFIG.rooms, messageConfig.roomName)
    ) {
      return
    }
    if (err || message.u._id === myUserId) return

    const split = _.split(message.msg, ' ')
    const commandName = _.head(split)

    if (!commandName) return

    const command = _.find(commands, (x) =>
      _.isArray(x.name)
        ? _.some(x.name, (y) => _.toLower(y) === _.toLower(commandName))
        : _.toLower(x.name) === _.toLower(commandName)
    )
    const params = _.tail(split)

    if (command) {
      await command.execute(message, params)
    }
  } catch (e) {
    console.error(e)
  }
}

try {
  runBot()
} catch (e) {
  console.error(e)
  process.exit(1)
}
