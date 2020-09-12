var fs = require('fs');
const path = require('path')
const babel = require('rollup-plugin-babel')
import { nodeResolve } from '@rollup/plugin-node-resolve'
const commonjs = require('rollup-plugin-commonjs')
import { eslint } from "rollup-plugin-eslint"
const { terser } = require('rollup-plugin-terser')

// 当前是生成环境
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

let plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  commonjs(),
  nodeResolve({
    customResolveOptions: {
      moduleDirectory: 'lib/*'
    }
  })
]

if (IS_PRODUCTION) {
  plugins.push(terser())
}
else {
  plugins.unshift(eslint({
    fix: true,
    throwOnError: true
  }))
}

// 读取指定目录下的文件名
function readFileNames(basePath) {
  let temp = []
  for(let file of fs.readdirSync(basePath)) {
    console.log(file);
    let src = path.join(basePath, file)
    if (fs.statSync(src).isFile()) {
      temp.push([ basePath, file ])
    }
  }
  return temp
}

// 生成 module.exports
function createExports() {
  let exports = []
  for(let [base, file] of readFileNames('./src')) {
    let [name, mime] = file.split('.')
    if (!name || mime != 'js') {
      return 
    }
    let src = base[base.length - 1] == '/' ? `${base}${file}` : `${base}/${file}`
    exports.push({
      input: path.resolve(__dirname, src),
      output: {
        file: path.resolve(__dirname, IS_PRODUCTION ? `dist/${name}.min.${mime}` : `dist/${file}`),
        format: 'umd',
        // 转成大驼峰
        name: name.replace(/([-_]+[a-z])/g, function(t) {
            return t[t.length - 1].toUpperCase()
        }),
        sourcemap: true,
        exports: 'named'
      },
      plugins: plugins,
      external: []
    })
  }
  return exports
}

module.exports = createExports()

// module.exports = {
//   input: path.resolve(__dirname, 'src/index.js'),
//   output: {
//     file: path.resolve(__dirname, IS_PRODUCTION ? 'dist/index.min.js' : 'dist/index.js'),
//     format: 'umd',
//     name: 'MObserver',
//     sourcemap: !IS_PRODUCTION,
//     exports: 'named'
//   },
//   plugins: plugins,
//   external: [
//     'core-js/modules/web.dom-collections.iterator'
//   ]
// }