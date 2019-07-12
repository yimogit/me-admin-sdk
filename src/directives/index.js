import { checkAuth } from '../_extends/ui/pages'
export default {
  auth: {
    inserted: (el, binding) => {
      if (binding.value && !checkAuth(binding.value)) {
        if (binding.arg === 'remove') {
          el.remove()
        } else {
          el.remove()
          // el.className += ' is-disabled '
          // el.setAttribute('disabled', 'disabled')
        }
      }
    }
  },
  footerBtns: {
    inserted: (el, binding) => {
      function change() {
        if (el.className.indexOf('custom-content-footer') === -1) {
          el.className += ' custom-content-footer'
        }
        el.style.width = el.parentElement.offsetWidth + 'px'
        el.parentElement.style.paddingBottom = el.offsetHeight + 'px'
      }
      change()
      window.ChangeFooterEvent = function() {
        setTimeout(change, 500)
      }
    }
  }
}
