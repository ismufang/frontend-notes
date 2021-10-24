## 实现深拷贝

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
