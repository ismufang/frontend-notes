## 1. ThreeJS

ThreeJS 是一个 JavaScript 3D 库。openGL 是一个跨平台 3D/2D 的绘图标准，WebGL 是 openGL 在浏览器上的实现。

**Threejs** 对 **WebGL** 进行了封装，让前端开发人员在不需要掌握很多数学知识和绘图知识的情况下，也能够轻松进行 web 3D 开发，降低了门槛，同时大大提升了效率。

## 2. 基本概念

- **场景（Scene）**
  - 场景是所有物体的容器，也对应着我们创建的三维世界。可以向容器里放物体，相机，光源等。
- **照相机（Camera）**
  - 照相机是三维世界中的观察者，为了观察这个世界，首先我们要描述空间中的位置。 Three 中使用采用常见的右手坐标系定位。
- **物体（Object）**
  - 创建物体需要指定几何形状和材质。 其中，几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。
- **光源（Light）**
  - Three 提供了包括环境光 AmbientLight、点光源 PointLight、 聚光灯 SpotLight、方向光 DirectionalLight、半球光 HemisphereLight 等多种光源。
- **渲染器（Renderer）**
  - Renderer 绑定一个 canvas 对象，并可以设置大小，默认背景颜色等属性。 调用 Renderer 的 render 函数，传入 scene 和 camera，就可以把图像渲染到 canvas 中。

## 3. 场景（Scene）

```js
// 创建场景
var scene = new THREE.Scene()
```

**相关函数**

- `add(obj)`：在场景中添加物体
- `remove(obj)`：在场景中移除物体
- `children()`：获取场景中所有子对象的列表
- `getChildByName()`：利用 name 属性，获取场景中某个特定的物体

### 3.1. 多场景切换

- 维持一个主场景
- 存储多个场景
- 切换场景时，主场景指针指向要切换的场景

```js
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()
const scene = null

function changeScene(s) {
  scene = s
}
```

## 4. 照相机（Camera）

照相机定义了三维空间到二维屏幕的投影方式：

#### 4.1. 透视投影照相机

`THREE.OrthographicCamera(left, right, top, bottom, near, far)` 获得的结果是类似人眼在真实世界中看到的有“近大远小”的效果。

![](@/threejs/OCamera.png)

oc 就是照相机的位置， 近平面、和远平面图中已经标注。从图中可以看出，棱台组成的 6 个面之内的东西，是可以被看到的。 影响透视照相机的大小因素：

1. 摄像机视锥体垂直视野角度 也就是图中的 **a** (fov)
2. 摄像机视锥体近端面 也就是图中的 **near plane**
3. 摄像机视锥体远端面 也就是图中的 **far plane**
4. 摄像机视锥体长宽比 **表示输出图像的宽和高之比**（aspect）

#### 4.2. 正交投影照相机

`THREE.PerspectiveCamera(fov, aspect, near, far)` 对于在三维空间内平行的线，投影到二维空间中也一定是平行的。

#### 4.3. 相机位置变化

相机每次改变`.position`属性后，需要重新设置一遍`.lookAt()`方法以便于更新相机对象视图矩阵的旋转部分，形象点说就是改变相机观察的实现方向，因为相机镜头指向的方向不会自动随着相机位置变化而自动变化，需要手动执行`.lookAt()`方法。

## 5. 渲染器（Renderer）

```js
let renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否开启反锯齿
  alpha: true, // 是否可以设置背景色透明
  precision: 'highp', // highp/mediump/lowp 表示着色精度选择
  premultipliedAlpha: false, // 是否可以设置像素深度（用来度量图像的分率）
  preserveDrawingBuffer: true, // 是否保存绘图缓冲
  maxLights: 3, // 最大灯光数
  stencil: false, // 是否使用模板字体或图案
})

// 渲染
renderer.render(scene, camera)
// 销毁
renderer.dispose()
```

### 5.1. requestAnimationFrame

requestAnimationFrame 这个函数就是让浏览器去执行一次参数中的函数，就形成了我们通常所说的游戏循环了。

```js
// 让世界动起来
function animate() {
  requestAnimationFrame(render)

  // 此处可添加动画处理

  renderer.render(scene, camera)
}
animate()
```

### 5.2. setAnimationLoop

可用于代替`requestAnimationFrame` 的内置函数。对于 WebXR 项目，必须使用此功能。

```tsx
type XRAnimationLoopCallback = (time: number, frame?: XRFrame) => void;
setAnimationLoop(callback: XRAnimationLoopCallback | null): void;
```

回调函数将在每个可用帧中调用。如果传递`null`，它将停止任何已经进行的动画

例子：

```js
renderer.setAnimationLoop(animate)
function animate(time) {
  // requestAnimationFrame(render);
  // 此处可添加动画处理
  renderer.render(scene, camera)
}
```

### 5.3. 渲染函数管理

如果不同的场景，需要添加多个需要动画更新的函数，可以维持一个函数事件队列，在更新函数时统一派发

1. 维持一个动画事件类

```js
export class AnimationModel {
  constructor() {
    this.queue = {}
  }

  push(sceneName, fn) {
    if (!this.queue[sceneName]) {
      this.queue[sceneName] = [fn]
    } else {
      this.queue[sceneName].push(fn)
    }
  }

  clear() {
    this.queue = {}
  }

  isEmpty(sceneName) {
    const keys = Object.keys(this.queue)
    if (keys.length === 0) return true
    if (sceneName) {
      return this.queue[sceneName] == null || this.queue[sceneName].length === 0
    }
    return false
  }

  dispatch(sceneName, time: number) {
    if (this.isEmpty(sceneName)) return
    this.queue[sceneName]?.forEach((fn) => fn(time))
  }

  dispose() {
    this.clear()
  }
}
```

2. 往事件队列中条件需要执行函数

```js
const animationModel = new AnimationModel()
animationModel.push(sceneName, () => {})
```

3. 在 animate 函数中触发更新

```js
function aniamte(time) {
  animationModel.dispatch(sceneName, time)
}
```

## 6. 物体（Object）

最常用的一种物体就是网格(Mesh)，网格是由顶点、边、面等组成的物体；其他物体包括线段(Line)、骨骼(Bone)、粒子系统(ParticleSystem，后命名为 Points，其实就是一堆点的集合)等。

在创建物体时，需要传入两个参数，一个是几何形状(Geometry)，另一个是材质(Material)。

其中，几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。

### 6.1. 几何形状（Geometry）

几何形状(Geometry)最主要的功能是储存了一个物体的顶点信息，通过存储模型用到的点集和点间关系(哪些点构成一个三角形)来达到描述物体形状的目的。

WebGL 需要程序员指定每个顶点的位置，而在 Three.js 中，可以通过指定一些特征来创建几何形状。

Three 提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状。 也可以通过自己定义每个点的位置来构造形状。 对于比较复杂的形状，我们还可以通过外部的模型文件导入。

### 6.2. 材质（Material）

材质(Material)是独立于物体顶点信息之外的与渲染效果相关的属性。通过设置材质可以改变物体的颜色、纹理贴图、光照模式等。

- **基本材质（BasicMaterial）**
  - 使用基本材质(BasicMaterial)的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。
  - 如果没有指定材质的颜色，则颜色是随机的。
- **Lambert 材质（MeshLambertMaterial）**
  - Lambert 材质(MeshLambertMaterial)是符合 Lambert 光照模型的材质
  - Lambert 光照模型的主要特点是只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的
- **Phong 材质（MeshPhongMaterial）**
  - Phong 材质(MeshPhongMaterial)是符合 Phong 光照模型的材质
  - 和 Lambert 不同的是，Phong 模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合
- **法向材质（MeshNormalMaterial）**
  - 法向材质(MeshNormalMaterial)可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助
  - 材质的颜色与照相机与该物体的角度相关
- **材质的纹理贴图**
  - 使用图像作为材质，就需要导入图像作为纹理贴图，并添加到相应的材质中

## 7. 光源（Light）

主要光源如下：

- 环境光 AmbientLight
- 点光源 PointLight
- 聚光灯 SpotLight
- 平行光 DirectionalLight
- 半球光 HemisphereLight

在 Three.js 中，能形成阴影的光源只有`THREE.DirectionalLight`与`THREE.SpotLight`。而相对地，能表现阴影效果的材质只有`THREE.LambertMaterial`与`THREE.PhongMaterial`。

### 7.1. [环境光 AmbientLight](https://threejs.org/docs/index.html?q=AmbientLight#api/zh/lights/AmbientLight)

环境光会均匀的照亮场景中的所有物体。

环境光不能用来投射阴影，因为它没有方向。

#### 7.1.1. 代码示例

```js
const light = new THREE.AmbientLight(0x404040) // soft white light
scene.add(light)
```

#### 7.1.2. 构造函数

**AmbientLight( color : Integer, intensity : Float )**

- color - (参数可选）颜色的 rgb 数值。缺省值为 0xffffff
- intensity - (参数可选)光照的强度。缺省值为 1

### 7.2. [半球光 HemisphereLight](https://threejs.org/docs/index.html?q=HemisphereLight#api/zh/lights/HemisphereLight)

光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。

半球光不能投射阴影。

#### 7.2.1. 代码示例

```js
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
scene.add(light)
```

#### 7.2.2. 构造器（Constructor）

**HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )**

- skyColor - (可选参数) 天空中发出光线的颜色。 缺省值 0xffffff
- groundColor - (可选参数) 地面发出光线的颜色。 缺省值 0xffffff
- intensity - (可选参数) 光照强度。 缺省值 1

### 7.3. 点光源 PointLight

从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。

该光源可以投射阴影

```js
const light = new THREE.PointLight(0xff0000, 1, 100)
light.position.set(50, 50, 50)
scene.add(light)
```

#### 7.3.1. 构造器（Constructor）

**PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )**

- color - (可选参数)) 十六进制光照颜色。 缺省值 0xffffff (白色)
- intensity - (可选参数) 光照强度。 缺省值 1
- distance - 这个距离表示从光源到光照强度为 0 的位置。 当设置为 0 时，光永远不会消失(距离无穷大)。缺省值 0.
- decay - 沿着光照距离的衰退量。缺省值 1。 在 physically correct 模式中，decay = 2

### 7.4. 聚光灯 SpotLight

光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。

该光源可以投射阴影。

```js
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(100, 1000, 100)

spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.near = 500
spotLight.shadow.camera.far = 4000
spotLight.shadow.camera.fov = 30

scene.add(spotLight)
```

#### 7.4.1. 构造器（Constructor）

**SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )**

- color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)
- intensity - (可选参数) 光照强度。 缺省值 1
- distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减
- angle - 光线散射角度，最大为 Math.PI/2
- penumbra - 聚光锥的半影衰减百分比。在 0 和 1 之间的值。默认为 0
- decay - 沿着光照距离的衰减量

### 7.5. 平行光 DirectionalLight

平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。

```js
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)
```

#### 7.5.1. 构造器

**DirectionalLight( color : Integer, intensity : Float )**

- color - (可选参数) 16 进制表示光的颜色。 缺省值为 0xffffff (白色)
- intensity - (可选参数) 光照的强度。缺省值为 1

## 8. 轨道控制器 OrbitControls

Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。

1. 设置自动旋转`controls.autoRotate = true `
2. 在 animate 函数中调用`controls.update()`

```js
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
)

const controls = new OrbitControls(camera, renderer.domElement)

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100)
controls.autoRotate = true // 设置自动旋转
controls.update()

function animate() {
  requestAnimationFrame(animate)

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update()

  renderer.render(scene, camera)
}
```

## 9. Stats

Stats 状态显示类，可在开发时显示当前渲染帧率和内存占用情况。

```js
let stats
function initStats(domId: string) {
  if (process.env.NODE_ENV !== 'production') {
    stats = Stats()
    if (domId) {
      document.getElementById(domId)?.appendChild(stats.domElement)
    } else {
      document.body.appendChild(stats.domElement)
    }
  }
}
function animation() {
  stats?.update()
}
```

## 10. TweenJS

tween.js 允许以平滑的方式修改元素的属性值。只需要告诉 tween 想修改什么值，以及动画结束时它的最终值是什么，动画花费多少时间等信息，tween 引擎就可以计算从开始动画点到结束动画点之间值，来产生平滑的动画效果

**例子**

假设有一个对象 position，它的坐标为 x 和 y，想改变 x 的值从 100 到 200

```js
var position = { x: 100, y: 0 }

// Create a tween for position first
var tween = new TWEEN.Tween(position)

// Then tell the tween we want to animate the x property over 1000 milliseconds
tween.to({ x: 200 }, 1000)

// 激活
tween.start()

// 在循环中更新
function animate() {
  requestAnimationFrame(animate)
  // [...]
  TWEEN.update()
  // [...]
}
animate()
```

## 11. 简单初始化 ThreeJS

```ts
import type { PerspectiveCamera, Scene, WebGLRenderer, Mesh } from 'three'
import * as THREE from 'three'
import { WEBGL } from './WEBGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { AnimationModel } from './AnimationModel'

export class ThreeModel {
  static scene: SceneModel
  static camera: PerspectiveCamera
  static renderer: WebGLRenderer
  static controller: OrbitControls
  static stats: Stats | null
  static animationModel: AnimationModel = new AnimationModel()

  private static initScene() {
    ThreeModel.scene = new THREE.Scene()
    ThreeModel.scene.background = new THREE.Color(0x272727)
  }

  private static initCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      100000
    )
    camera.position.set(0, 10, 0)
    camera.lookAt(ThreeModel.scene.position)
    ThreeModel.camera = camera
  }

  private static initRenderer(domId?: string | undefined) {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    if (domId) {
      document.getElementById(domId)?.appendChild(renderer.domElement)
    } else {
      document.body?.appendChild(renderer.domElement)
    }
    renderer.setAnimationLoop(ThreeModel.animate)
    ThreeModel.renderer = renderer
  }

  private static initController() {
    const controller = new OrbitControls(
      ThreeModel.camera,
      ThreeModel.renderer.domElement
    )
    ThreeModel.controller = controller
  }

  private static initLight(target?: Mesh) {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    ThreeModel.scene.add(ambientLight)
  }

  private static initStats(domId: string) {
    if (process.env.NODE_ENV !== 'production') {
      const stats = Stats()
      if (domId) {
        document.getElementById(domId)?.appendChild(stats.domElement)
      } else {
        document.body.appendChild(stats.domElement)
      }
      ThreeModel.stats = stats
    }
  }

  public static init(domId: string, callback?: () => void) {
    ThreeModel.initScene()
    ThreeModel.initCamera()
    ThreeModel.initStats(domId)
    ThreeModel.initRenderer(domId)
    ThreeModel.initController()
    ThreeModel.initLight()

    if (WEBGL.isWebGLAvailable()) {
      console.log('isWebGLAvailable')
    } else {
      const warning = WEBGL.getWebGLErrorMessage()
      document.getElementById(domId)?.appendChild(warning)
    }

    callback?.()
  }

  public static animate(time: number) {
    if (!ThreeModel.scene) return
    ThreeModel.stats?.update?.()
    // 是否开启自动旋转
    if (ThreeModel?.controller?.enabled) {
      // only required if controls.enableDamping = true, or if controls.autoRotate = true
      ThreeModel.controller.update()
    }
    ThreeModel?.renderer?.render(ThreeModel.scene, ThreeModel.camera)
    ThreeModel?.animationModel?.dispatch(SceneModel.sceneName, time)

    // 相机位置改变后，注意执行.looAt()方法重新计算视图矩阵旋转部分
    // 如果不执行.looAt()方法，相当于相机镜头方向保持在首次执行`.lookAt()`的时候
    ThreeModel?.camera?.lookAt(0, 0, 0)
  }

  public static changeScene(scene: Scene) {
    ThreeModel.scene = scene
  }

  public static dispose() {
    ThreeModel.scene = null
    ThreeModel.camera = null
    ThreeModel?.controller?.dispose()
    ThreeModel.controller = null
    ThreeModel?.renderer?.dispose()
    ThreeModel.renderer = null
    ThreeModel.animationModel.dispose()
  }
}
```

在 React 中初始化

```tsx
function index() {
  useEffect(() => {
    ThreeModel.init('myThree', () => {
      // callback...
    })
    return () => {
      ThreeModel.dispose()
      // dispose...
    }
  }, [])
  return <div id="myThree"></div>
}
```
