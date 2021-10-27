## 1. [Gulp](https://www.gulpjs.com.cn/docs/)

gulp 是一个自动化构建工具，主要用来设定程序自动处理静态资源的工作。简单的说，gulp 就是用来打包项目的。

## 2. 安装

```bash
npm install gulp --save-dev
```

## 3. 创建 gulpfile.js 文件

根目录下创建一个名为 gulpfile.js 的文件，作为 gulp 入口文件，在运行 gulp 命令时会自动加载。

```js
function defaultTask(cb) {
  // place code for your default task here
  cb()
}

exports.default = defaultTask
```

## 4. NPM 脚本

`develop` `build`为`gulpfile.js`导出的公开任务

```json
// package.json
{
  "script": {
    "start": "gulp develop",
    "build": "gulp build"
  }
}
```

## 5. 任务管理

### 5.1. 4.1 创建任务

> gulp 不再支持同步任务（Synchronous tasks）了。因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。

> 当你看到 "Did you forget to signal async completion?" 警告时，说明你并未使用前面提到的返回方式。你需要使用 callback 或返回 stream、promise、event emitter、child process、observable 来解决此问题。

**使用 callback**
如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。在如下示例中，callback 将作为唯一一个名为 cb() 的参数传递给你的任务（task）。

```js
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb()
}

exports.default = callbackTask
```

### 5.2. 4.2 导出任务

任务（tasks）可以是 public（公开） 或 private（私有） 类型的。

- 公开任务（Public tasks） 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用。
- 私有任务（Private tasks） 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分。

```js
const { series } = require('gulp')

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb()
}

// `build` 函数被导出（export）了，
// 因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(cb) {
  // body omitted
  cb()
}

function develop(cb) {
  // body omitted
  cb()
}

exports.build = build
exports.develop = develop
```

### 5.3. 4.3 组合任务

#### 5.3.1. 4.3.1 串行 series()

`series()`按顺序执行

```js
const { series } = require('gulp')

function transpile(cb) {
  // body omitted
  cb()
}

function bundle(cb) {
  // body omitted
  cb()
}

exports.build = series(transpile, bundle)
```

#### 5.3.2. 4.3.2 并行 parallel()

`parallel()`并行执行

```js
const { parallel } = require('gulp')

function javascript(cb) {
  // body omitted
  cb()
}

function css(cb) {
  // body omitted
  cb()
}

exports.build = parallel(javascript, css)
```

#### 5.3.3. 4.3.3 总结

- `series()`和`parallel()`可以被嵌套到任意深度。
- 当`series()`或`parallel()`被调用时，任务（tasks）被立即组合在一起。这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。
- 当使用`series()`组合多个任务（task）时，任何一个任务（task）的错误将导致整个任务组合结束，并且不会进一步执行其他任务。当使用`parallel()`组合多个任务（task）时，一个任务的错误将结束整个任务组合的结束，但是其他并行的任务（task）可能会执行完，也可能没有执行完。

## 6. 处理文件

### 6.1. 5.1 读取文件 src(globs[, options])

src 方法主要是用来读取目标源文件，所以参数就是一个目标源文件的路径
它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

### 6.2. 5.2 .pipe()

流（stream）所提供的主要的 API 是 .pipe() 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。

### 6.3. 5.3 输出文件 dest(path[, options])

dest 方法主要用来将数据输出到文件中，所以参数就是目标文件路径。通常作为终止流

大多数情况下，利用 .pipe() 方法将插件放置在 src() 和 dest() 之间，并转换流（stream）中的文件。

```js
const { src, dest } = require('gulp')
const babel = require('gulp-babel')

exports.default = function () {
  return src('src/*.js').pipe(babel()).pipe(dest('output/'))
}
```

## 7. 监听文件变化 watch

函数原型

```
watch(globs, [options], [task])
```

用法

```js
const { watch } = require('gulp')

watch(['input/*.js', '!input/something.js'], function (cb) {
  // body omitted
  cb()
})
```

## 8. Gulp 插件

- gulp-concat : 合并文件(js/css)
- gulp-uglify : 压缩 js 文件
- gulp-rename : 文件重命名
- gulp-less : 编译 less
- gulp-sass : 编译 sass
- gulp-clean-css : 压缩 css
- gulp-livereload : 实时自动编译刷新
- gulp-htmlmin : 压缩 html 文件
- gulp-connect : 热加载，配置一个服务器
- gulp-load-plugins : 打包插件（里面包含了其他所有插件）

**单个插件使用**

```js
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const bs = browserSync.create()

function style() {
  return src('src/assets/styles/*.scss', {
    base: 'src',
  })
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(dest('temp'))
    .pipe(
      bs.reload({
        stream: true,
      })
    )
}
```

**使用 gulp-load-plugins**

```js
const loadPugins = require('gulp-load-plugins')
const plugins = loadPugins()

function style() {
  return src('src/assets/styles/*.scss', {
    base: 'src',
  })
    .pipe(
      plugins.sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(dest('temp'))
    .pipe(
      bs.reload({
        stream: true,
      })
    )
}
```

## 9. 简单的 gulpfile.js 配置

```js
const { src, dest, parallel, series, watch } = require('gulp')
const del = require('del')

const browserSync = require('browser-sync')
const bs = browserSync.create()

const loadPugins = require('gulp-load-plugins')
const plugins = loadPugins()
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig') // 模板引擎
// const imagemin = require('gulp-imagemin') // 图片处理

const data = {
  foo: ['yellow', 'red', 'gray', 'green'],
  pkg: require('./package.json'),
  title: 'hahaha',
  date: new Date(),
}

// 文件清理
const clean = () => {
  return del(['dist', 'temp']) // 返回一个promise
}

const style = () => {
  return src('src/assets/styles/*.scss', {
    base: 'src',
  })
    .pipe(
      plugins.sass({
        outputStyle: 'expanded',
      })
    ) // 样式}展开换行
    .pipe(dest('temp'))
    .pipe(
      bs.reload({
        stream: true,
      })
    )
}

const script = () => {
  return src('src/assets/scripts/*.js', {
    base: 'src',
  })
    .pipe(
      plugins.babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(dest('temp'))
    .pipe(
      bs.reload({
        stream: true,
      })
    )
}

const page = () => {
  return src('src/**.html', {
    base: 'src',
  })
    .pipe(
      plugins.swig({
        data,
        defaults: {
          cache: false,
        },
      })
    )
    .pipe(dest('temp'))
    .pipe(
      bs.reload({
        stream: true,
      })
    )
}

const image = () => {
  return src('src/assets/images/**', {
    base: 'src',
  })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', {
    base: 'src',
  })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', {
    base: 'public',
  }).pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch(['src/assets/images/**', 'src/assets/fonts/**', 'public/**'], bs.reload)

  bs.init({
    port: 3033,
    notify: false,
    // open: false, // 自动打开浏览器
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  })
}

// dist 文件路径处理 代码压缩
const useref = () => {
  return (
    src('temp/*.html', {
      base: 'temp',
    })
      .pipe(
        plugins.useref({
          searchPath: ['temp', '.'],
        })
      )
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest('dist'))
  )
}

// 开发阶段
const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
) // parallel并行 series串行

const develop = series(compile, serve)

module.exports = {
  clean,
  build,
  develop,
  serve,
  // style,
  // script,
  // page
  // compile,
  // image,
  // font,
  // extra,
  // useref,
}
```
