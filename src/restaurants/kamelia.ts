import { JSDOM } from 'jsdom'
import * as _ from 'lodash'
import { Restaurant } from './types'
import * as moment from 'moment'
import { fetchPage } from './utils'

function parseMenu(html: string) {
  const dom = new JSDOM(html)

  const currentDate = moment().format('DD. MM. YYYY')

  let response = `${currentDate} \n`

  const dates = dom.window.document.querySelectorAll('#vpravo > u')
  const tables = dom.window.document.querySelectorAll('#vpravo > div table')

  const index = _.findIndex(dates, (x) => x.textContent.includes(currentDate))

  if (tables[index]) {
    const menu = tables[index]
    const rows = menu.querySelectorAll('tr')

    rows.forEach((row) => {
      const cols = row.querySelectorAll('td')
      response = `${response}${_.reduce(
        cols,
        (acc, col) => {
          const text = _.trim(col.textContent)
          if (_.isEmpty(text) || text == '&nbsp;') return acc
          return _.isEmpty(acc) ? text : `${acc} - ${text}`
        },
        ''
      )} \n`
    })
  }

  return response
}

const kameliaUrl = 'https://www.penzionkamelia.sk/menu-dna-restauracia/'

export const kamelia: Restaurant = {
  name: 'Kamelia',
  url: kameliaUrl,
  getMenu: async () => {
    const response = await fetchPage(kameliaUrl)
    const menu = parseMenu(response)
    return menu
  }
}
