import { isElement } from './cfns.js'

import { addHook } from './capture.js'

/**
 * 监控输入，将全角标点转换为半角标点
 * @param {HTMLElement|selector} tar - 需要被绑定的 HTMLElement 对象或 HTMLElement 对象选择器
 */
export default function angle(tar) {
  if (typeof tar === 'string') {
    tar = document.querySelector(tar)
  }
  
  if (!isElement(tar)) {
    throw new Error('无效的 HTMLElement 节点')
  }
  
  let name
  
  switch (tar.nodeName.toLowerCase()) {
    case 'input':
      name = 'value'
      break
    default:
      name = 'textContent'
      break
  }
  
  tar.addEventListener('beforeinput', function(e) {
    e.preventDefault()
    e.inputType == 'insertText' && (tar[name] = `${tar[name]}${e.data}`)
  })
  
  // 这一层的作用是劫持原型链的 getter/setter，即使通过 js 赋值也能进行监听
  addHook(tar, name, function(value) {
    let code, char = /[\uff00-\uffff\u3000]/g.exec(value)
    while (char) {
      code = char[0].charCodeAt()
      if (code == 12288) {
        code = 32
      }
      if (code >= 65281 && code <= 65374) {
        code = code - 65248
      }
      value = value.replace(new RegExp(char[0], 'gi'), String.fromCharCode(code))
      char = /[\uff00-\uffff\u3000]/g.exec(value)
    }
    return value
  }, 'before')
}
