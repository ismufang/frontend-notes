## 1. [Webpack](https://webpack.docschina.org/concepts/)

webpack 可以看做模块化打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其他的一些浏览器不能直接运行的扩展语言（Scss，TypeScript 等），并将其转换和打包为合适的格式供浏览器使用

**安装**

```bash
yarn add webpack --dev
```

**创建根目录**

根目录新建 webpack.conifg.js

**loader 是 webpack 核心特性**

- Loader 负责实现资源模块加载
- Plugin 解决其他自动化工作

## 2. 导入导出

```js
module.exports = {
  //入口
  entry: './src/js/main.js',

  //出口
  output: {
    path: __dirname + '/public', // 出口路径（必须是绝对路径，如果不想写的很繁琐，还是用 __dirname 的好）
    filename: 'bundle.js', // 出口文件名
  },
}
```

## 3. 模块热更新

- 开启 HMR
- 热更新只更新修改的模块
- 自动刷新会刷新整个页面

## 4. 环境配置

### 4.1. 3.1 不同环境下的配置

```js
"scripts": {
    "build": "webpack --env production",
    "develop": "webpack --env development",
    "start": "webpack-dev-server --open --hot",
    "none": "webpack --mode none",
    "watch": "webpack --watch"
},
```

webpack.config.js 导出函数，接收 env 实参

```js
module.exports = (env, argv) => {
  const config = {
    //....
  }
  if (env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      //...
    ]
  }
  return config
}
```

### 4.2. 3.2 不同环境配置文件

通过`--config`进行配置不同环境文件

```js
"scripts": {
    "build": "webpack --config webpack.prod.js",
    "develop": "webpack-dev-server --config webpack.dev.js --open --hot"
  },
```

## 5. [webpack 优化](https://webpack.docschina.org/configuration/optimization/)

```js
module.exports = {
  optimization: {
    // 是否有副作用 告知 webpack 去辨识 package.json 中的 副作用标记或规则，
    // 以跳过那些当导出不被使用且被标记不包含副作用的模块。
    sideEffect: true,
    usedExports: true, // 模块只导出被使用的成员 tree Sharking
    minimize: true, // 压缩输出结果
    concatenateModules: true, // 尽可能合并每一个模块到一个函数中，减少体积
  },
}
```

忽略某个文件副作用

```json
// package.json
{
  "name": "",
  "sideEffects": ["./src/extend.js"]
}
```

### 5.1. 4.1 webpack Tree Sharking

Tree-shaking 只对 ES Module 起作用，对于 commonjs 无效，对于 umd 亦无效

因为 tree-shaking 是针对静态结构进行分析，只有`import`和`export`是静态的导入和导出。而 commonjs 有动态导入和导出的功能，无法进行静态分析。

**webpack 配置**

1. 首先，你必须处于生产模式。Webpack 只有在压缩代码的时候会 tree-shaking，而这只会发生在生产模式中。
2. 必须将优化选项 `"usedExports"` 设置为 true。这意味着 Webpack 将识别出它认为没有被使用的代码，并在最初的打包步骤中给它做标记。
3. 最后，你需要使用一个支持删除死代码的压缩器。这种压缩器将识别出 Webpack 是如何标记它认为没有被使用的代码，并将其剥离。`TerserPlugin`支持这个功能。

```js
const config = {
 mode: 'production',
 optimization: {
  usedExports: true,
  minimizer: [
   new TerserPlugin({...})
  ]
 }
}
```

#### 5.1.1. 4.1.1 副作用

有些模块导入，只要被引入，就会对应用程序产生重要的影响。一个很好的例子就是全局样式表，或者设置全局配置的 JavaScript 文件。

Webpack 认为这样的文件有“副作用”。具有副作用的文件不应该做 tree-shaking，因为这将破坏整个应用程序。Webpack 的设计者清楚地认识到不知道哪些文件有副作用的情况下打包代码的风险，因此默认地将所有代码视为有副作用。这可以保护你免于删除必要的文件，但这意味着 Webpack 的默认行为实际上是不进行 tree-shaking。

#### 5.1.2. 4.1.2 管理副作用

package.json 有一个特殊的属性`sideEffects`，就是为此而存在的

```json
// 所有文件都有副作用，全都不可 tree-shaking
{
 "sideEffects": true
}
// 没有文件有副作用，全都可以 tree-shaking
{
 "sideEffects": false
}
// 只有这些文件有副作用，所有其他文件都可以 tree-shaking，但会保留这些文件
{
 "sideEffects": [
  "./src/file1.js",
  "./src/file2.js"
 ]
}
```

#### 5.1.3. 4.1.3 全局 CSS 与副作用

为了保留全局 CSS 文件，我们只需要设置这个特殊的`sideEffects`标志为`true`

```js
// 导入全局 CSS
import './MyStylesheet.css'
```

```js
// 全局 CSS 副作用规则相关的 Webpack 配置
const config = {
  module: {
    rules: [
      {
        test: /regex/,
        use: [loaders],
        sideEffects: true,
      },
    ],
  },
}
```

#### 5.1.4. 4.1.4 ES2015 模块 Babel 配置

Webpack 不支持使用 commonjs 模块来完成 tree-shaking
为了进行 tree-shaking，我们需要将代码编译到 es2015 模块

```js
// es2015 模块的基本 Babel 配置
const config = {
  presets: [
    [
      '[@babel/preset-env](http://twitter.com/babel/preset-env)',
      {
        // 不要编译，让 Babel 保留我们现有的 es2015 import/export 语句
        modules: false,
      },
    ],
  ],
}
```

## 6. 提取公共模块

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
```

## 7. 魔法注释

```js
import(/* webpackChunkName: 'album' */ './xxx').then(({ default: post }) => {
  // ...
})
```

## 8. 配置快捷访问方式

```js
resolve: {
  alias: {
    '@': resolve('src'),
    'api':resolve('src/api'),
    'utils':resolve('src/utils')
  }
},
```

## 9. [跨域解决方案 proxy](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)

```js
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
}
```

## 10. 构建本地服务器

**安装**

```bash
yarn add webpack-dev-server --dev
```

**配置**

```js
module.exports = {
  devtool: 'eval-source-map',

  entry: __dirname + '/app/main.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: './public', // 本地服务器所加载的页面所在的目录
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
  },
}
```

**NPM 脚本**

```json
// package.json
{
  "scripts": {
    "server": "webpack-dev-server --open"
  }
}
```

## 11. 模块，常用 loaders

### 11.1. 11.1 ES6 -> ES5

**安装 babel**

```bash
yarn add babel-loader @babel/core @babel/preset-env --dev
```

**配置**
babel 的配置可以写在 use 内部 options 中，也可以自己在项目的根目录下创建.babelrc 文件，把 babel 配置写在.babelrc 文件中。

```js
module.exports = {
  // 用到的模块
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
```

### 11.2. 11.2 less

**安装**

```bash
yarn add less less-loader css-loader style-loader --dev
```

**配置**

```js
module.exports = {
  // 用到的模块
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-laoder', 'less-loader'],
      },
    ],
  },
}
```

### 11.3. 11.3 图片

**安装**

```bash
yarn add url-loader --dev
```

**配置**

```js
module.exports = {
  // 用到的模块
  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: ['url-loader'],
      },
    ],
  },
}
```

说明：url-loader 处理的图片一般比较小，会把图片转换成 base64 代码，直接添加页面。提供了一个方便的选择 limit，该选项用于控制当文件大小小于 limit 时才使用 url-loader

#### 11.3.1. 11.3.1 配置 file-loader

`file-loader`是将图片换成路径

**安装**

```bash
yarn add file-loader --dev
```

**配置**

```js
module.exports = {
  // 用到的模块
  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
}
```

**与 url-loader 配合使用**

```js
module.exports = {
  // 用到的模块
  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: {
          loader: 'url-laoder',
          options: {
            // 30kb一下文件采用url-laoder
            limit: 1024 * 30,
            // 否则采用file-loader
            fallback: 'file-loader',
          },
        },
      },
    ],
  },
}
```

引入本地图片到页面，需要单独引用到页面再使用，不能直接使用相对路径

```js
import picUrl from '../xx.png'
;<img src={picUrl} />
```

引用网络图片，直接使用路径即可

## 12. 插件(Plugins)

插件是用来扩展 webpack 功能的，他们会在整个构建过程中生效，执行相关的任务

**插件配置**

```js
module.exports = {
  plugins: [
    // 配置需要的插件
  ],
}
```

**Loaders 和 Plugins 的区别：**

- loaders 是在打包构建过程中用来处理源文件的（JSX，Scss，Less…），一次处理一个
- 插件并不直接操作单个文件，它直接对整个构建过程起作用

常用插件如下：

### 12.1. 12.1 HtmlWebpackPlugin

该插件的作用：依据一个简单的 html 模板，生成一个自动引用打包后的 JS 文件的新的 index.html，这在每次生成的 JS 文件名称中带有 hash 值时非常有用（因为每次名称不同）

**安装**

```bash
yarn add html-webpack-plugin --dev
```

**一些修改**

1. 删除 public 文件夹，利用此插件 html 文件会自动生成，前面操作的 JS 文件也会自动关联到生成的新 html 文件中

2. 在 app 目录下，创建的 html 模板以这种格式创建：名称.tmpl.html，插件会根据这个模板生成最终的 html 页面，并会进行自动的依赖

3. 更新 webpack 的配置文件，新建一个 build 文件夹用来存放生成的文件

**配置**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [
    // 添加版权的插件
    new webpack.BannerPlugin('版权所有，翻版必究'),

    // 简化了 HTML 文件的创建，以便为你的 webpack 包提供服务。
    // 这对于那些文件名中包含哈希值，并且哈希值会随着每次编译而改变的 webpack 包特别有用
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html',
    }),
  ],
}
```

### 12.2. 12.2 Hot Module Replacement（HMR）

Hot Module Replacement（HMR）插件允许在修改组件代码后，自动刷新实时预览修改后的效果

它是 webpack 内置插件

**配置**

```js
module.exports = {
  plugins: [
    // 热加载插件，还需要在 .babelrc 中的 "env" 进行配置
    new webpack.HotModuleReplacementPlugin(),
  ],
}
```

#### 12.2.1. 12.2.1 配置 Babel

```json
{
  "presets": ["react", "env"],
  "env": {
    "development": {
      "plugins": [
        [
          "react-transform",
          {
            "transforms": [
              {
                "transform": "react-transform-hmr",

                "imports": ["react"],

                "locals": ["module"]
              }
            ]
          }
        ]
      ]
    }
  }
}
```

### 12.3. 12.3 其他插件

```js
module.exports = {
    plugins: [
        // 添加版权的插件
        new webpack.BannerPlugin('版权所有，翻版必究'),

        // 简化了 HTML 文件的创建，以便为你的 webpack 包提供服务。
        // 这对于那些文件名中包含哈希值，并且哈希值会随着每次编译而改变的 webpack 包特别有用
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html',
            // 压缩HTML文件
            minify: {
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true // 删除空白符与换行符
            }
        })

        // 热加载插件，还需要在 .babelrc 中的 "env" 进行配置
        new webpack.HotModuleReplacementPlugin()

        // 为组件分配 ID，通过这个插件可以优先考虑使用最多的模块，分配给他们最小的 ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        // 压缩 JS 文件
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']    // 排除关键字
        }),

        // 分离 CSS 和 JS 文件
        new ExtractTextPlugin('style.css')

        // 提取CSS到单个文件
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].bundle.css'
        })
    ]
}
```

### 12.4. 12.4 处理缓存

```js
module.exports = {
  output: {
    path: __dirname + '/build',
    filename: 'bundle-[hash].js', // 添加 hash 值
  },
}
```

添加 hash 之后，导致改变文件内容后的重新打包，文件名不同而文件越来越多，可以使用：`clean-webpack-plugin`来进行清理

**配置**

```js
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin('build/*.*', {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
  ],
}
```
