import { JSDOM } from 'jsdom'
import * as _ from 'lodash'
import { Restaurant } from './types'
import * as moment from 'moment'
import { fetchPage } from './utils'

const dayOfWeek = [
  'Nedeľa',
  'Pondelok',
  'Utorok',
  'Streda',
  'Štvrtok',
  'Piatok',
  'Sobota'
]

function parseMenu(html: string) {
  const dom = new JSDOM(html)

  const currentDate = moment()

  let response = `${currentDate.format('DD. MM. YYYY')} \n`

  const menuTable = dom.window.document.querySelector('#banner .content table')
  if (menuTable) {
    const rows = menuTable.querySelectorAll('tr')

    let writing = false

    rows.forEach((row) => {
      const cols = row.querySelectorAll('td')
      if (_.isEmpty(cols)) return true
      const firstColContent = cols[0].textContent.trim()
      if (!writing) {
        if (firstColContent == dayOfWeek[currentDate.day()]) {
          writing = true
        }
        if (firstColContent && !_.includes(dayOfWeek, firstColContent)) {
          writing = true
          return true
        }
      } else {
        if (firstColContent) {
          writing = false
        }
      }

      if (_.every(cols, (col) => _.isEmpty(col.textContent))) return true

      if (writing) {
        response = `${response}${_.reduce(
          cols,
          (acc, col, index) => {
            if (index == 0) return acc
            const text = _.trim(col.textContent)
            if (index == 1 && _.isEmpty(text)) return `${acc} ---------`
            if (_.isEmpty(text) || text == '&nbsp;') return acc
            return _.isEmpty(acc) ? text : `${acc} - ${text}`
          },
          ''
        )} \n`
      }
      return true
    })
  }

  return response
}

const kusokUrl = 'https://kusokstastia.sk/menu.php'

export const kusok: Restaurant = {
  name: 'Kusok Stastia',
  url: kusokUrl,
  getMenu: async () => {
    const response = await fetchPage(kusokUrl)
    const menu = parseMenu(response)
    return menu
  }
}
