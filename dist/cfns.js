(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.regexp.to-string'), require('core-js/modules/es.string.match')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.regexp.to-string', 'core-js/modules/es.string.match'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cfns = {}));
}(this, (function (exports) { 'use strict';

  // 是 HTMLElement 节点
  function isElement(tar) {
    return tar instanceof HTMLElement;
  }
  function isNode(tar) {
    return tar instanceof Node;
  } // 获取指定目标的数据类型

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

  exports.isElement = isElement;
  exports.isNode = isNode;
  exports.padStart = padStart;
  exports.type = type;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cfns.js.map
