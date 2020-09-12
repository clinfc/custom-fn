
// 是 HTMLElement 节点
export function isElement(tar) {
  return tar instanceof HTMLElement
}

export function isNode(tar) {
  return tar instanceof Node
}

// 获取指定目标的数据类型
export function type(tar) {
  return Object.prototype.toString.call(tar).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 兼容出来 String.prototype.padStart
export function padStart(tar, length, padString = '') {
  tar = `${tar}`
  if (''.padStart) {
    return tar.padStart(length, padString)
  }
  return tar.length > length ? tar : `${Array(length).join(padString)}${tar}`.slice(-length)
} 