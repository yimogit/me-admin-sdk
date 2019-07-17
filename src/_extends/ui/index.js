import * as pages from './pages'
import * as fetch from './fetch'
import * as rules from './rules'

export default {
  pages,
  fetch,
  rules: rules.gen
}
