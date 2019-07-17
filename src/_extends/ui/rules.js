class Rules {
  constructor(name, trigger) {
    this.rules = []
    this.name = name
    this.trigger = trigger || 'blur'
  }

  required(action) {
    action = action || '输入'
    this.rules.push({
      required: true,
      message: '请' + action + this.name,
      trigger: this.trigger
    })

    return this
  }

  selectRequired() {
    return this.required('选择')
  }

  length(min, max) {
    this.rules.push({
      min: min,
      max: max,
      message: this.name + '必须是 ' + min + ' - ' + max + ' 个字符',
      trigger: this.trigger
    })

    return this
  }

  number(min, max) {
    var rule = {
      type: 'number',
      message: this.name + '必须是数字',
      trigger: this.trigger
    }

    if (min >= 0 && max >= 0) {
      rule.min = min
      rule.max = max
      rule.message = this.name + '必须是 ' + min + ' - ' + max + ' 之间的数字'
    }

    this.rules.push(rule)
    return this
  }

  integer(min, max) {
    var rule = {
      type: 'integer',
      message: this.name + '必须是整数',
      trigger: this.trigger
    }

    if (min >= 0 && max >= 0) {
      rule.min = min
      rule.max = max
      rule.message = this.name + '必须是 ' + min + ' - ' + max + ' 之间的整数'
    }

    this.rules.push(rule)
    return this
  }

  build() {
    return this.rules
  }
}

export function gen(name, trigger) {
  return new Rules(name, trigger)
}
