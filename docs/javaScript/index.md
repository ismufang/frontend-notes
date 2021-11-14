## 1. 数据类型

### 1.1. 原始值类型（简单数据类型）

- 字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol

### 1.2. 引用类型（复杂数据类型）

- 对象(Object)、数组(Array)、函数(Function)

### 1.3. 隐式类型转换

```
==
```

### 1.4. 类型判断

- 简单类型`typeof`
- 复杂类型`Object.prototype.toString.call(()=>{}) ==> '[object Function]'`
- 判断数组`Array.isArray()`
- instanceOf

## 2. 变量

- 变量声明 var let const
- var 存在变量提升
- let 不提升
- const 定义常量
- 有 let const 定义的块`{}`，是块级作用域
- let const 声明的全局变量，不在是顶层对象的属性

```js
let b = 1
window.b // undefined
```

### 2.1. 声明变量六中方法

```
var let const function import class
```

### 2.2. globalThis

顶层对象的指针，解决不同环境顶层对象不统一问题

## 3. 作用域

- 作用域是可访问变量的集合。在 JavaScript 中, 作用域为可访问变量，对象，函数的集合
- 全局作用域: 变量未受到函数的约束，在全局可以使用，如 windows 对象，document 对象
- 函数作用域（局部作用域）: 在函数中定义的变量只能在当前函数中有效
- 块级作用域（ES6）: 在某个`{}`声明的，只在当前`{}`有效

### 3.1. 词法作用域

- 函数在定义它们的作用域里运行，而不是在执行它们的作用域里运行，也叫做静态作用域

### 3.2. 动态作用域

- 动态作用域在执行时确定，其生存周期到代码片段执行为止，比如 this 指向问题

### 3.3. 全局变量

- 变量在函数外定义，即为全局变量。
- 全局变量有 全局作用域: 网页中所有脚本和函数均可使用。

### 3.4. 变量生命周期

- 变量生命周期在它声明时初始化。
- 局部变量在函数执行完毕后销毁。
- 全局变量在页面关闭后销毁。

## 4. 闭包

闭包为一个函数，在本作用域外访问作用域内的属性或方法，即形成闭包

**适用场景**

- 外部作用域访问内部变量
  - 作用域内部可以访问外部变量，但是外部无法访问内部变量和方法，闭包可以实现
- 封装变量，缓存变量

### 4.1. 两种表现

1. 函数作为返回值被返回

```js
function create() {
  let a = 100 // step2. 在上级作用域找到a,故打印100
  return function () {
    console.log(a) // step1. 当前作用域中未找到 a,a为自由变量
  }
}
let fn = create()
let a = 200
fn() //100
```

2. 函数作为参数被传递

```js
function print(fn) {
  const a = 200
  fn()
}
const a = 100 //step2. 在上级作用域找到a,故打印100
function fn() {
  console.log(a) //step1. 当前作用域中未找到 a,a为自由变量
}
print(fn) //100
```

### 4.2. 自由变量

- 在当前作用域中没有定义，但是被使用了的变量
  - 向上级作用域，一层一层寻找，直至找到为止
- **闭包所有自由变量的查找，是在定义函数的地方，向上级作用域查找，不是在函数执行的地方！！！**

## 5. This

在 JavaScript 中 this 是动态指定的，它会随着执行环境的改变而改变

### 5.1. this 指向

- 在方法中，this 指向所属对象
- 单独调用，this 指向全局
- 在函数中，this 指向全局，严格模式下指向 undedined
- 在全局模式下，严格非严格模式 this 都指向顶层对象

```js
this === window // true
;('use strict')
this === window // true
```

- 在事件中，this 表示接受事件的元素
- 在构造函数中，this 指向实例
- call，apply，bind 可以改变 this 指向

### 5.2. 箭头函数

- 箭头函数 this 不会动态改变，指向所定义时的作用域
- 箭头函数本身没有 this，继承自外层 this，所以不能做构造函数
  - 如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，
  - 否则 this 的值则被设置为全局对象
- bind, call, apply 无法修改 this

## 6. 原型与原型链

![prototype](@/javascript/prototype.png)

```js
function Person() {}
Person.prototype.name = 'Person'
const person = new Person()
person.name = 'xiaoming'

console.log(person.constructor === Person) // true
console.log(Person.prototype.constructor === Person) // true
console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true

console.log(typeof Person.prototype) // object
console.log(typeof Object.prototype) // object
console.log(typeof Function.prototype) // function
console.log(Function.prototype instanceof Object) // true
console.log(Function.prototype.prototype) // undefined
console.log(Function.__proto__ === Function.prototype) // true

// 所有函数__proto__指向Function.prototype
console.log(Person.__proto__ === Function.prototype) // true
console.log(Function.__proto__ === Function.prototype) // true
console.log(Object.__proto__ === Function.prototype) // true
console.log(Array.__proto__ === Function.prototype) // true
console.log(String.__proto__ === Function.prototype) // true
console.log(Boolean.__proto__ === Function.prototype) // true
console.log(Number.__proto__ === Function.prototype) // true
console.log(person.name) // xaioming
delete person.name
console.log(person.name) // Person
```

- `__proto__`：事实上就是原型链指针
- `prototype`：指向原型对象
- `constructor`：每一个原型对象都包含一个指向构造函数的指针，就是 constructor

### 6.1. 原型 prototype

- 实例的构造函数属性（constructor）指向构造函数
- **只有个函数有`prototype`属性**，prototype 下面有个`construetor`，指向这个函数
- **每个对象都有`__proto__`内部属性**，指向它所对应的构造函数的原型对象，原型链基于`__proto__`
- **所有函数`__proto__`指向 Function.prototype**
- 函数有点特别，它不仅是函数，也对象。所以它也有 **proto** 属性
- Function.**proto**指向 Function.prototype, Function.prototype 是一个函数对象
- **Function 相当于自己创建了自己**, 相当于 Function = new Function(); Function 的原型对象的构造函数也是 Object, 相当于 Function.prototype = new Object()
- 每一个 JavaScript 对象在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

### 6.2. constructor

- 每个原型都有一个 constructor 属性指向关联的构造函数，实例原型指向构造函数

### 6.3. 原型链

```js
console.log(Person.prototype.__proto__ ==== Object.prototype) // true
console.log(Object.prototype.constructor ==== Object) // true
console.log(Object.prototype.__proto__ ==== null) // true
```

## 7. 实现深拷贝

JavaScript 数据类型分为原始值类型和引用类型，值类型可以直接拷贝，引用类型需要层层递归，直到原始值再进行拷贝，JavaScript 没有提供原生深拷贝方法需要手写一个深拷贝

**思路：**

1. 引用类型分情况处理，
   - 数组或对象：层层递归直到遇到原始值返回结果
   - 函数拷贝
   - 正则拷贝
2. 其他值直接返回

**类型检测**

```js
function checkType(any) {
  return Object.prototype.toString.call(any).slice(8, -1)
}
```

**拷贝函数**

这里使用`new Function`进行拷贝，只拷贝函数本身，没有拷贝其属性

```js
function copyFuntion(fn) {
  return new Function('return ' + fn.toString())()
  // 属性拷贝
  // for(let key in fn) {
  //     newFn[key] = fn[key]
  // }
}
```

**全部代码**

```js
function deepCopy(target) {
  if (checkType(target) === 'Function') {
    return copyFuntion(target)
  }

  if (checkType(target) === 'RegExp') {
    return new RegExp(target)
  }

  if (checkType(target) === 'Array') {
    const arr = []
    for (let i = 0; i < target.length; i++) {
      arr[i] = deepCopy(target[i])
    }
    return arr
  }

  if (checkType(target) === 'Object') {
    const obj = {}
    for (const k in target) {
      obj[k] = deepCopy(target[k])
    }
    return obj
  }

  // 其他值直接返回
  return target
}
```

## 8. 实现事件发布订阅

**思路**

使用 `Map` 存储事件名及事件队列

**功能**

- `on` 监听事件
- `once` 只监听一次的事件
- `emit` 触发事件
- `off` 清理事件
- `clear` 清理所有事件

[Npm package: event-whale](https://www.npmjs.com/package/event-whale)

```js
/**
 * @name EventWhale
 * @return {EventWhale}
 */
class EventWhale {
  constructor() {
    this.whale = new Map()
  }
  on(eventName, handler) {
    const handlers = this.whale.get(eventName)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.whale.set(eventName, [handler])
    }
  }
  once(eventName, handler) {
    handler.once = true
    this.on(eventName, handler)
  }
  emit(eventName, evt) {
    const handlers = this.whale.get(eventName)
    if (handlers) {
      handlers.forEach((handler) => {
        handler(evt)
      })
      const newHandlers = handlers.filter((handler) => !handler.once)
      this.whale.set(eventName, newHandlers)
    }
  }
  off(eventName, handler) {
    const handlers = this.whale.get(eventName)
    if (handlers) {
      if (handler) {
        const index = handlers.indexOf(handler)
        index !== -1 && handlers.splice(index, 1)
      } else {
        this.whale.delete(eventName)
      }
    }
  }
  clear() {
    this.whale.clear()
  }
}
```

## 9. 实现 new 构造函数

思路：

1. 声明函数接收构造函数和参数
2. 创建对象
3. 继承原型
4. 继承构造函数，绑定 this，传递参数
5. 返回对象

**创建可继承原型的对象**

- 原生方法`Object.create(proto，[propertiesObject])`
- 实现一个可继承原型的函数

```js
function createObject(prototype = null) {
  const obj = new Object()
  obj.__proto__ = prototype
  return obj
}
```

**实现 new 函数**

```js
function mynew(ctor, ...args) {
  // 继承原型
  // const obj = Object.create(ctor.prototype)
  const obj = createObject(ctor.prototype)
  // 继承构造函数
  ctor.apply(obj, args)
  return obj
}
```

**使用函数**

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

const p = mynew(Person, 'f', 18)
p.sayName() // 'f'
```

**完整代码**

```js
function createObject(prototype = null) {
  const obj = new Object()
  obj.__proto__ = prototype
  return obj
}

function mynew(ctor, ...args) {
  // const obj = Object.create(ctor.prototype)
  const obj = createObject(ctor.prototype)
  ctor.apply(obj, args)
  return obj
}

function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

const p = mynew(Person, 'f', 18)
p.sayName()
console.log(p)
```
