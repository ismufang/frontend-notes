## 1. 页面加载与渲染过程优化

### 1.1. 浏览器渲染过程

1. 解析 HTML 文件，构建 DOM 树
2. 解析 CSS 文件，构建 CSSOM 树
3. 两者关联生成 Render Tree
4. 计算渲染树的布局
5. 将布局渲染到页面上

### 1.2. 优化 DOM

- 删除不必要的代码和注释包括空格，尽量做到最小化文件。
- 可以利用 GZIP 压缩文件。
- 结合 HTTP 缓存文件。

### 1.3. 优化 CSSOM

DOM 与 CSSOM 是并行构建的，所以 CSS 加载不会阻塞 DOM 的解析

但是，**CSS 加载会阻塞 DOM 的渲染**

由于 Render Tree 是依赖于 DOM Tree 和 CSSOM Tree 的，
所以他必须等待到 CSSOM Tree 构建完成，也就是 CSS 资源加载完成(或者 CSS 资源加载失败)后，才能开始渲染

**优化**

- 减少关键 CSS 元素数量
- 将 CSS 引用或`<style>`放在头部，优先加载

### 1.4. 优化 JavaScript

**javaScript 阻塞 DOM 解析**

javaScript 可以操作 DOM 来修改 DOM 结构，因此在遇到外链脚本或者 script 标签时，需要等待这部分代码执行完成才会继续解析 DOM。

**优化**

- 将 script 标签放在页面底部
- 给 script 标签加 defer 属性
- 预加载 preload & prefetch

### 1.5. 减少重绘和回流

**回流必将引起重绘，重绘不一定会引起回流。**

**重绘（Repaint）**
当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility 等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

**回流（Reflow）**
当 Render Tree 中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。

**会导致回流的操作：**

```
* 页面首次渲染
* 浏览器窗口大小发生改变
* 元素尺寸或位置发生改变元素内容变化（文字数量或图片大小等等）
* 元素字体大小变化
* 添加或者删除可见的 DOM 元素
* 激活 CSS 伪类（例如:hover）
* 查询某些属性或调用某些方法
* 一些常用且会导致回流的属性和方法
clientWidth、clientHeight、clientTop、clientLeftoffsetWidth、offsetHeight、
offsetTop、offsetLeftscrollWidth、scrollHeight、scrollTop、
scrollLeftscrollIntoView()、scrollIntoViewIfNeeded()、getComputedStyle()、
getBoundingClientRect()、scrollTo()
```

**回流比重绘的代价要更高。**

当你访问以下属性或方法时，浏览器会立刻清空队列:

```
clientWidth、clientHeight、clientTop、clientLeft
offsetWidth、offsetHeight、offsetTop、offsetLeft
scrollWidth、scrollHeight、scrollTop、scrollLeft
width、height
getComputedStyle()
getBoundingClientRect()
```

**如何避免**

**CSS**

- 避免设置多层内联样式
- 避免使用 CSS 表达式（例如：calc()）

**JavaScript**

- 避免频繁操作样式
- 避免频繁操作 DOM
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。

## 2. 图片优化

- 图片懒加载
  - 图片懒加载在一些图片密集型的网站中运用比较多，通过图片懒加载可以让一些不可视的图片不去加载，避免一次性加载过多的图片导致请求阻塞（浏览器一般对同一域名下的并发请求的连接数有限制），这样就可以提高网站的加载速度，提高用户体验。
- 图片压缩
- 使用雪碧图
- 使用线上字符图标

### 2.1. 图片懒加载实现原理

将页面中的 img 标签 src 指向一张小图片或者 src 为空，然后定义 data-src（这个属性可以自定义命名）属性指向真实的图片。src 指向一张默认的图片，否则当 src 为空时也会向服务器发送一次请求。可以指向 loading 的地址。注意，图片要指定宽高。

```html
<img src="default.jpg" data-src="666.jpg" />
```

当载入页面时，先把可视区域内的 img 标签的 data-src 属性值负给 src，然后监听滚动事件，把用户即将看到的图片加载。这样便实现了懒加载。

## 3. 使用事件委托

事件委托其实就是利用 JS 事件冒泡机制把原本需要绑定在子元素的响应事件（click、keydown……）委托给父元素，让父元素担当事件监听的职务。事件代理的原理是 DOM 元素的事件冒泡。

**优点：**

1. 大量减少内存占用，减少事件注册。
2. 新增元素实现动态绑定事件

## 4. 防抖 Debounce

输入搜索时，可以用防抖 debounce 等优化方式，减少 http 请求；

## 5. 节流 Throttle

节流函数：只允许一个函数在 N 秒内执行一次。

应用场景

- 滚动条调用接口时，可以用节流 throttle 等优化方式，减少 http 请求；
- 对 websocket 实时推流数据进行节流处理，避免频繁执行回调操作

## 6. HTTP 优化

- 合理使用 HTTP 缓存
- 减少 HTTP 连接
- 使用 HTTP2
  - 解析速度快
  - 多路复用
  - 首部压缩

## 7. 使用服务端渲染

客户端渲染: 获取 HTML 文件，根据需要下载 JavaScript 文件，运行文件，生成 DOM，再渲染。
服务端渲染：服务端返回 HTML 文件，客户端只需解析 HTML。

- 优点：首屏渲染快，SEO 好。
- 缺点：配置麻烦，增加了服务器的计算压力。

## 8. 静态资源使用 CDN

内容分发网络（CDN）是一组分布在多个不同地理位置的 Web 服务器。我们都知道，当服务器离用户越远时，延迟越高。CDN 就是为了解决这一问题，在多个位置部署服务器，让用户离服务器更近，从而缩短请求时间。

## 9. 总结

性能优化主要分两类

- 加载优化
  1. DOM 优化，压缩体积
  2. CSS 优化，减低选择器深度
  3. JavaScript 优化，减少对样式和 DOM 的操作
  4. 图片优化，图片懒加载，雪碧图，字体图标
  5. 减少 HTTP 请求，使用 HTTP2
  6. 静态资源使用 CDN
  7. 使用服务端渲染
- 运行时优化
  1. 减少回流与重绘
  2. 使用事件委托
  3. 使用节流与防抖
  4. HTTP 优化，合理使用 HTTP 缓存
