## 冒泡排序

两层循环，外循环移动位置，内循环把外循环选择的值依次比较（正比较）找到最大值。

- 比较所有相邻元素，如果第一个比第二个大，则交换它们
- 一轮下来，可以保证最后一个数是最大的
- 执行 n-1 轮，就可以完成排序

时间复杂度：O(n^2)

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}
```

## 选择排序

两层循环，外循环移动位置，内循环把外循环选择的值依次比较找到最小值。

- 找到数组中的最小值，选中它并将其放置在第一位
- 接着找到第二小的值，选中它并将其放置在第二位
- 以此类推，执行 n-1 轮

时间复杂度：O(n^2)

```js
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let indexMin = i
    // 找出最小值下标
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < arr[indexMin]) {
        indexMin = j
      }
    }
    // 把最小值放在当前查询范围第一位
    if (indexMin !== i) {
      const temp = arr[i]
      arr[i] = arr[indexMin]
      arr[indexMin] = temp
    }
  }
  return arr
}
```

## 插入排序

两层循环，外循环移动位置，内循环把外循环选择的值与前面的值依次比较找到最小值

- 从第二个数开始往前比
- 比它大就往后排
- 以此类推进行最后一个数

时间复杂度：O(n^2)

```js
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j - 1] > arr[j]) {
        const temp = arr[j]
        arr[j] = arr[j - 1]
        arr[j - 1] = temp
      }
    }
  }
  return arr
}
```

## 归并排序

- 分：把数组劈成两半，再递归地对子数组进行“分”操作，直到分成一个个单独的数
- 合：把两个数合并为有序数组，再对有序数组进行合并，直到全部子数组合并为一个完整数组
  - 新建一个空数组 res，用于存放最终排序后的数组
  - 比较两个有序数组的头部，较小者出队并推入 res 中
  - 如果两个数组还有值，重复第二步

分的时间复杂度是 O(logN)
合的时间复杂度是 O(n)

时间复杂度：O(n\*logN)

![mergeSort](@/dataStructuresAndAlgorithms/mergeSort.jpeg)

```js
function mergeSort(arr) {
  const rec = (arr) => {
    if (arr.length === 1) return arr
    const mid = Math.floor(arr.length / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid, arr.length)
    const orderLeft = rec(left)
    const orderRight = rec(right)
    const res = []

    while (orderLeft.length && orderRight.length) {
      res.push(
        orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift()
      )
    }

    if (orderLeft.length) {
      res.push(orderLeft.shift())
    }

    if (orderRight.length) {
      res.push(orderRight.shift())
    }

    return res
  }
  return rec(arr)
}

// 拆分
function mergeSort(arr) {
  if (arr.length < 2) return arr
  const mid = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid)
  const right = arr.slice(mid)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  let res = []
  while (left?.length && right?.length) {
    if (left[0] < right[0]) {
      res.push(left.shift())
    } else {
      res.push(right.shift())
    }
  }

  while (left.length) res.push(left.shift())
  while (right.length) res.push(right.shift())
  return res
}
```

## 快速排序

- 分区：从数组中任意选择一个“基准”，所有比基准小的元素放在基准前面，比基准大的元素放在基准的后面
- 递归：递归地对基准前后的子数组进行分区

递归时间复杂度 O(logN)
分区操作时间复杂度为 O(n)

时间复杂度：O(n\*logN)

![quickSort](@/dataStructuresAndAlgorithms/quickSort.png)

```js
function quickSort(arr) {
  const rec = (arr) => {
    if (arr.length <= 1) return arr
    const left = []
    const right = []
    const mid = arr[0] // 以数组第一位为基准
    for (let i = 1; i < arr.length; i += 1) {
      if (arr[i] < mid) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return [...rec(left), mid, ...rec(right)]
  }
  return rec(arr)
}
```

## 顺序搜索

时间复杂度：O(n)

```js
function sequentialSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i
    }
  }
  return -1
}
```

## 二分搜索

- 从数组的中间元素开始，如果中间元素正好是目标值，则搜索结束
- 如果目标值大于或小于中间元素，则在大于或小于中间元素的那一半数组中搜索

时间复杂度：O(logN)

```js
function binarySearch(arr, target) {
  let low = 0
  let high = arr.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const element = arr[mid]
    if (element < target) {
      low = mid + 1
    } else if (element > target) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -1
}
```
