import { JSDOM } from 'jsdom'
import * as _ from 'lodash'
import { Restaurant } from './types'
import { fetchPage } from './utils'

function parseMenu(html: string) {
  const dom = new JSDOM(html)
  const currentDayElement =
    dom.window.document.querySelector('#main .text .dList')

  const date = currentDayElement.querySelector('b').innerHTML

  let response = `${date} \n`

  const rows = currentDayElement.querySelectorAll('tr')

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

  return response
}

const rmutUrl = 'http://www.pivarskabasta.sk/menu-dna/?tlacit'

export const rmut: Restaurant = {
  name: 'Rmut',
  url: rmutUrl,
  getMenu: async () => {
    const response = await fetchPage(rmutUrl)
    const menu = parseMenu(response)
    return menu
  }
}
