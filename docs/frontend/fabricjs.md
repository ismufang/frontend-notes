## FabricJS

> Fabric.js 是一个强大而简单的 Javascript HTML5 画布库。
> Fabric 在画布元素之上提供交互式对象模型。
> Fabric 还具有 SVG-to-canvas（和 canvas-to-SVG）解析器。

## 画布

```html
<canvas id="myCanvas"></canvas>
```

```js
import { fabric } from 'fabric'

// 创建画布
const canvas = new fabric.Canvas(document.getElementById('myCanvas'), {
  width: 800,
  height: 500,
  backgroundColor: '#f4f4f4',
})
```

## 对象

Fabric 在画布元素之上提供交互式对象模型；比如 Line、Point、Polygon、Polyline、Rect 等

**创建对象**

```js
// create a rectangle object
const rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20,
})

// "add" rectangle onto canvas
canvas.add(rect)

// remove rectangle
canvas.remove(rect)
```

## 事件

```js
canvas.on('object:moved', _handleObjectMoved)
canvas.on('object:moving', _handleObjectMoving)
canvas.on('mouse:down', _handleMouseDown)
canvas.on('mouse:move', _handleMouseMove)
canvas.on('mouse:up', _handleMouseUp)
canvas.on('mouse:wheel', _handleMouseWheel)

canvas.off('object:moved', _handleObjectMoved)
canvas.off('object:moving', _handleObjectMoving)
canvas.off('mouse:down', _handleMouseDown)
canvas.off('mouse:move', _handleMouseMove)
canvas.off('mouse:up', _handleMouseUp)
canvas.off('mouse:wheel', _handleMouseWheel)
```

## 组合

多个对象可以组合到一个组里统一管理

```js
const circle = new fabric.Circle({
  radius: 100,
  fill: '#eef',
  scaleY: 0.5,
  originX: 'center',
  originY: 'center',
})
const text = new fabric.Text('hello', {
  fontSize: 30,
  originX: 'center',
  originY: 'center',
})
const group = new fabric.Group([circle, text], {
  left: 150,
  top: 100,
  angle: -10,
})
canvas.add(group)
```
