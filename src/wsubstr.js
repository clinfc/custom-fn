/**
 * 指定宽度（PX），样式切割字符串 
 */

// 创建字符计算容器
function createNode(str, css) {
  let span = document.createElement('span')
  let options = {
    opacity: 0,
    zIndex: -100,
    width: 0,
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }
  if (typeof css === 'object') {
    Object.assign(options, css)
  }
  for (let [k, v] of Object.entries(options)) {
    span.style[k] = v
  }
  let text = document.createTextNode(str)
  span.appendChild(text)
  document.body.appendChild(span)
  
  return {
    span,
    text
  }
}

// 获取基础数据
function basicData(span, str, maxWidth) {
  let width = span.scrollWidth    // 字符串的总宽
  let average = width / str.length // 单个字符的平均宽度
  let size = Math.ceil(maxWidth / average) - 1  // maxWidth 宽度的字符串大概有多少个字符，由于平均字符宽度肯定比实际宽度小，所以最少需要减一
  
  return { width, average, size }
}

// 比较两个浮点数是否相等
function equal(f1, f2) {
  return Math.abs(f1 - f2) < Number.EPSILON
}


// 计算当前字符串的宽度是否达标
function computed(span, text, childStr, maxWidth, average) {
  text.textContent = childStr
  let w = span.scrollWidth
  if (w < maxWidth || equal(w, maxWidth)) { // 字符穿宽度 <= maxWidth
    let d = maxWidth - w
    if (d < average) {  // 当前字符串宽度与最大宽度误差在一个平均字符宽度以内
      return {
        done: true,
        diff: 0
      }
    } else {  // 当前字符串宽度与最大宽度误差超过一个字符
      return {
        done: false,
        diff: -Math.floor(d / average)  // 少了多少个字符
      }
    }
  } else { // 字符穿宽度 > maxWidth
    return {
      done: false,
      diff: Math.ceil((w - maxWidth) / average) // 多了多少个字符
    }
  }
}

// 切割字符串
function split(span, text, str, start, end, maxWidth, average) {
  let childStr = str.slice(start, end)
  let { done, diff } = computed(span, text, childStr, maxWidth, average)
  if (done) {
    return childStr
  } else {
    if (diff > 0) {
      childStr = str.slice(start, end - diff)
      let o = computed(span, text, childStr, maxWidth, average)
      if (o.done) {
        return childStr
      } else if (o.diff == -diff) {
        --end // 字符平均值比实际值小的概率非常大，所以 diff 是否为 1，end 都要减一
        diff > 1 && (end -= diff)
        return str.slice(start, end)
      }
      return split(span, text, str, start, end - diff - o.diff, maxWidth, average)
    }
    return split(span, text, str, start, end - diff, maxWidth, average)
  }
}

/**
 * 根据条件将字符串分割为子串，返回数组
 * 
 * @param {String} str - 需要被切割的字符串
 * @param {Number} maxWidth - 被切割成的子串最大宽度（px）
 * @param {Object|undefined} css - 设置字体的样式及其它相关属性
 * @return {Array}
 */
export default function wsubstr(str, maxWidth, css = undefined) {
  let temp = []   // 缓存切割后的字符串
  let { span, text } = createNode(str, css) // 生成计算字符宽高的容器
  let { average, size } = basicData(span, str, maxWidth) // 获取基础数据
  
  let start = 0, end = size  // 切割字符时的 开始/结束 索引
  
  while(start < str.length) {
    if (str.length - start < size) { // 最后一次截取
      temp.push(str.slice(start, end))
      break
    } else {
      let childStr = split(span, text, str, start, end, maxWidth, average)
      temp.push(childStr)
      start += childStr.length
      end = start + size
    }
  }
  
  document.body.removeChild(span)
  
  return temp
}