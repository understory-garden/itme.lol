import {
  deleteFile, asUrl
} from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

import { ansi, convertAnsi } from '~lib/color'
import adv from '~vocabs/adventure'

const yourself = async (_c, _a, _o, {hero, setResult, auth}) => {
  await deleteFile(asUrl(hero), {fetch: auth.fetch})
  setResult(`YOU EXPLODE IN A FLASH`)
}

export default ({
  yourself
})
