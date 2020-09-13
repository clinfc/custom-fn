(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.regexp.to-string'), require('core-js/modules/es.string.replace'), require('core-js/modules/es.string.split'), require('core-js/modules/web.dom-collections.iterator'), require('core-js/modules/es.string.match')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.regexp.to-string', 'core-js/modules/es.string.replace', 'core-js/modules/es.string.split', 'core-js/modules/web.dom-collections.iterator', 'core-js/modules/es.string.match'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.datetime = {}));
}(this, (function (exports) { 'use strict';

  function type(tar) {
    return Object.prototype.toString.call(tar).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  } // 兼容出来 String.prototype.padStart

  function padStart(tar, length) {
    let padString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    tar = "".concat(tar);

    if (''.padStart) {
      return tar.padStart(length, padString);
    }

    return tar.length > length ? tar : "".concat(Array(length).join(padString)).concat(tar).slice(-length);
  }

  function millisecondsToDate(milliseconds, isTimestamp) {
    if (isTimestamp && "".concat(milliseconds).split('.')[0].length < 11) {
      milliseconds = Math.round(milliseconds * 1000);
    }

    return new Date(milliseconds);
  }
  /**
   * @param {Date|Timestamp|Milliseconds} target - 需要被格式化的时间对象/时间戳/毫秒
   * @param {String|Array|Object|Boolean} response - template（时间格式化模板） 或 [template, ...] 或 { name: template, ... } 或 true/false。当为 true/false 时，返回 template 占位符为键名的对象。
   *  template 占位符
   *    $Y：两位年。例如：18、19、20
   * 	  $y：四位年。例如：2020
   *    $M：1 ~ 12 月 的英文缩写
   *    $m：1 ~ 12 月
   *    $w：星期一 到 星期日 的英文缩写
   *    $d：1 ~ 31 天
   *    $H：24 小时
   *    $h：12 小时
   *    $i：60 分钟
   *    $s：60 秒
   *    $u：0 ~ 999 毫秒
   * @param {Boolean} isTimestamp - 需要被格式化的对象是否为时间戳。设置 true 时，如果 target 字符长度小于等于 10，target 将被乘以 1000
   */


  function format(target, response) {
    let isTimestamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let date;

    switch (type(target)) {
      case 'date':
        date = target;
        break;

      case 'string':
        target = parseInt(target);
        isNaN(target) && format.targetError();
        date = millisecondsToDate(target, isTimestamp);
        break;

      case 'number':
        date = millisecondsToDate(target, isTimestamp);
        break;

      default:
        format.targetError();
    }

    let [w, M, d, y, His] = date.toString().split(' ');
    let [H, i, s] = His.split(':');
    let Y = y.slice(2);
    let m = padStart(date.getMonth() + 1, 2, 0);
    let u = padStart(date.getMilliseconds(), 3, 0);
    let h = padStart(H > 12 ? H - 12 : H, 2, 0);
    i = padStart(i, 2, 0);
    s = padStart(s, 2, 0);
    let baseData = {
      $y: y,
      $Y: Y,
      $m: m,
      $M: M,
      $d: d,
      $h: h,
      $H: H,
      $i: i,
      $s: s,
      $u: u,
      $w: w
    };

    switch (type(response)) {
      // 模板字符串
      case 'string':
        return format.replaceTemplate(baseData, response);
      // 由模板字符串组成的数组

      case 'array':
        return response.map(template => format.replaceTemplate(baseData, template));
      // 由模板字符串组成的对象

      case 'object':
        {
          let temp = {};

          for (let [k, v] of Object.entries(response)) {
            temp[k] = format.replaceTemplate(baseData, v);
          }

          return temp;
        }
      // 直接返回切割后的数据

      case 'boolean':
        return baseData;
      // 无效的类型

      default:
        format.templateError();
    }
  } // 模板替换

  format.replaceTemplate = function (baseData, template) {
    if (type(template) != 'string') {
      format.templateError();
    }

    return template.replace(/\$y/g, baseData.$y).replace(/\$Y/g, baseData.$Y).replace(/\$m/g, baseData.$m).replace(/\$d/g, baseData.$d).replace(/\$h/g, baseData.$h).replace(/\$H/g, baseData.$H).replace(/\$i/g, baseData.$i).replace(/\$s/g, baseData.$s).replace(/\$u/g, baseData.$u).replace(/\$w/g, baseData.$w).replace(/\$M/g, baseData.$M);
  }; // 时间格式化模板错误处理


  format.templateError = function () {
    throw new TypeError('无效的时间格式化模板');
  }; // 被格式化的时间的错误处理


  format.targetError = function () {
    throw new TypeError('无效的target');
  };

  exports.format = format;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=datetime.js.map
