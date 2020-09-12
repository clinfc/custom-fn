(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.regexp.constructor'), require('core-js/modules/es.regexp.to-string'), require('core-js/modules/es.string.replace'), require('core-js/modules/es.string.match'), require('core-js/modules/web.dom-collections.iterator')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.regexp.constructor', 'core-js/modules/es.regexp.to-string', 'core-js/modules/es.string.replace', 'core-js/modules/es.string.match', 'core-js/modules/web.dom-collections.iterator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.angle = {}));
}(this, (function (exports) { 'use strict';

  // 是 HTMLElement 节点
  function isElement(tar) {
    return tar instanceof HTMLElement;
  }

  function createPropertyDescriptor() {
    let data = null;
    return {
      configurable: true,
      enumerable: true,
      get: function get() {
        return data;
      },
      set: function set(val) {
        data = val;
        return data;
      }
    };
  } // 生成缓存 hook 的键名


  function getHookName(name) {
    return {
      before: "".concat(name, "BeforeHook"),
      after: "".concat(name, "AfterHook")
    };
  }

  let hooks = new WeakMap();

  function getHookCache(tar, name) {
    if (!hooks.has(tar)) {
      hooks.set(tar, {});
    }

    let {
      before,
      after
    } = getHookName(name);
    let hook = hooks.get(tar);

    if (!hook[before]) {
      hook[before] = [];
    }

    if (!hook[after]) {
      hook[after] = [];
    }

    return {
      before: hook[before],
      after: hook[after]
    };
  } // 劫持原型链，重写/定义 HTMLElement 的某个属性


  function hijackProperty(tar, name) {
    // 如果已经被重写过
    if (Reflect.getOwnPropertyDescriptor(tar, name)) {
      return false;
    }

    let {
      before,
      after
    } = getHookCache(tar, name);
    let {
      configurable,
      enumerable,
      get: _get,
      set: _set
    } = Reflect.getOwnPropertyDescriptor(tar.__proto__, name) || createPropertyDescriptor();
    Reflect.defineProperty(tar, name, {
      configurable,
      enumerable,
      get: function get() {
        return _get.call(tar);
      },
      set: function set(val) {
        // 前置回调
        val = before.reduce(function (pre, fn) {
          return fn.call(tar, pre) || pre;
        }, val);

        _set.call(tar, val); // 后置回调


        after.reduce(function (pre, fn) {
          return fn.call(tar, pre) || pre;
        }, val);
      }
    });
    return {
      before,
      after
    };
  } // 从数组中删除某个元素


  function splice(arr, tar) {
    let i = arr.indexOf(tar);

    if (i != -1) {
      arr.splice(i, 1);
    }
  }
  /**
   * 劫持原型链属性并添加 hook function
   * @param {HTMLElement} tar
   * @param {String} name - 属性名
   * @param {Function} fn - hook function
   * @param {String} type - before/after  
   */


  function addHook(tar, name, fn) {
    let type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'after';
    let {
      before,
      after
    } = hijackProperty(tar, name) || getHookCache(tar, name);

    switch (type) {
      case 'before':
        splice(before, fn);
        before.push(fn);
        break;

      default:
        splice(after, fn);
        after.push(fn);
        break;
    }
  }

  /**
   * 监控输入，将全角标点转换为半角标点
   * @param {HTMLElement|selector} tar - 需要被绑定的 HTMLElement 对象或 HTMLElement 对象选择器
   */

  function angle(tar) {
    if (typeof tar === 'string') {
      tar = document.querySelector(tar);
    }

    if (!isElement(tar)) {
      throw new Error('无效的 HTMLElement 节点');
    }

    let name;

    switch (tar.nodeName.toLowerCase()) {
      case 'input':
        name = 'value';
        break;

      default:
        name = 'textContent';
        break;
    }

    tar.addEventListener('beforeinput', function (e) {
      e.preventDefault();
      e.inputType == 'insertText' && (tar[name] = "".concat(tar[name]).concat(e.data));
    }); // 这一层的作用是劫持原型链的 getter/setter，即使通过 js 赋值也能进行监听

    addHook(tar, name, function (value) {
      let code,
          char = /[\uff00-\uffff\u3000]/g.exec(value);

      while (char) {
        code = char[0].charCodeAt();

        if (code == 12288) {
          code = 32;
        }

        if (code >= 65281 && code <= 65374) {
          code = code - 65248;
        }

        value = value.replace(new RegExp(char[0], 'gi'), String.fromCharCode(code));
        char = /[\uff00-\uffff\u3000]/g.exec(value);
      }

      return value;
    }, 'before');
  }

  exports.default = angle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angle.js.map
