// const files = require.context('./test/', true, /\.vue/)
// console.log(files.keys())

import Layout from './test/_Layout'
import Index from './test/index'
import Button from './test/button'
import Select from './test/select'
import TablePager from './test/table-pager'
import Upload from './test/upload'

export default {
  path: '/test',
  name:'test',
  redirect: '/test/index',
  component: Layout,
  children: [
    {
      path: 'index',
      component: Index
    },
    {
      path: 'button',
      component: Button
    },
    {
      path: 'select',
      component: Select
    },
    {
      path: 'table-pager',
      component: TablePager
    },
    {
      path: 'upload',
      component: Upload
    }
  ]
}
