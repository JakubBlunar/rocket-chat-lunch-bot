import { Command } from '../types'
import { driver } from '@rocket.chat/sdk'
import * as _ from 'lodash'
import { Restaurant } from '../restaurants/types'
import { allRestaurants } from '../restaurants'

export const lunch: Command = {
  name: ['obed!', '!obed', 'hlad!', '!hlad'],
  execute: async (message, params) => {
    if (!_.isEmpty(params)) {
      const restaurants = _.uniqBy(
        _.reduce<string, Restaurant[]>(
          params,
          (acc, param) => {
            for (const index in allRestaurants) {
              const restaurant = allRestaurants[index]
              if (_.includes(_.toLower(restaurant.name), _.toLower(param))) {
                return [...acc, restaurant]
              }
            }
            return acc
          },
          [] as Restaurant[]
        ),
        (x) => x.name
      )

      if (_.isEmpty(restaurants)) {
        await driver.sendToRoom('Nenašiel som žiadnu reštauráciu.', message.rid)
      } else {
        const menuResponse = await getMenuFromRestaurants(restaurants)
        await driver.sendToRoom(menuResponse, message.rid)
      }
    } else {
      const menuResponse = await getMenuFromRestaurants(allRestaurants)
      await driver.sendToRoom(menuResponse, message.rid)
    }
  }
}

async function getMenuFromRestaurants(restaurants: Restaurant[]) {
  let menuResponse = ''
  for (const index in restaurants) {
    const restaurant = restaurants[index]

    menuResponse = `${menuResponse}${restaurant.name} - ${restaurant.url} \n`

    const menu = await restaurant.getMenu()

    menuResponse = `${menuResponse} ${menu} \n\n`
  }
  return menuResponse
}
