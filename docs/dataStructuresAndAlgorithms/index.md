## 1. 数构与算法

数据结构是计算机中存储、组织数据的方式。

算法是指用来操作数据、解决程序问题的一组方法。对于同一个问题，使用不同的算法，也许最终得到的结果是一样的，但在过程中消耗的资源和时间却会有很大的区别。

## 2. 时间/空间复杂度

- 时间复杂度
  是指执行当前算法所消耗的时间
- 空间复杂度
  是指执行当前算法需要占用多少内存空间

**大 O 符号表示法**

```
O(1) < O(logn) < O(n) < O(n*logN) < O(n^2) < O(n^3) < O(2^n)
```

## 3. 数据结构

### 3.1. 栈 Stack

**特点**
后进先出

**应用场景**

- 十进制传二进制
- 20 有效括号（简单）
- 函数调用栈

**专业术语**

- 栈顶 top：允许进行插入和进行删除操作的一段成为栈顶
- 栈底 bottom：表的另一端称为栈底 （第一个元素进入的位置）
- 压栈(入栈、进栈) push：在栈顶位置插入元素的操作叫做压栈，或入栈、进栈
- 出栈(弹栈、退栈) pop：删除栈顶元素的操作叫做出栈，也叫作弹栈，或者退栈
- 空栈 empty：不含元素的空表
- 栈溢出 stack overflow：当栈满的时候，如果再有元素压栈，则发生上溢，当栈空的时候，再出栈则发生下溢

#### 3.1.1. 十进制转二进制

```js
function transformNum(num) {
  // return num.toString(2) * 1
  const stack = []
  while (num !== 1) {
    const a = num % 2
    stack.push(a)
    num = Math.floor(num / 2)
  }

  stack.push(num)
  return stack.reverse().join('')
}
```

#### 3.1.2. [20 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

给定一个只包括 '('，')'，'{'，'}'，'['，']'  的字符串 s ，判断字符串是否有效。
有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

输入：s = "()[]{}"
输出：true

输入：s = "(]"
输出：false

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  if (s.length % 2 === 1) return false
  const stack = []
  for (let i = 0; i < s.length; i++) {
    const a = s[i]
    if (a === '(' || a === '[' || a === '{') {
      stack.push(a)
    } else {
      const t = stack[stack.length - 1]
      if (
        (t === '(' && a === ')') ||
        (t === '[' && a === ']') ||
        (t === '{' && a === '}')
      ) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  return stack.length === 0
}
```

### 3.2. 队列 Queue

**特点**
先进先出

**应用场景**

- 食堂打饭排队
- js 异步中任务队列
- 933 最近的请求次数（简单）

#### 3.2.1. [933 最近请求次数](https://leetcode-cn.com/problems/number-of-recent-calls/)

写一个  RecentCounter  类来计算特定时间范围内最近的请求。

请你实现 RecentCounter 类：

- RecentCounter() 初始化计数器，请求数为 0 。
- int ping(int t) 在时间 t 添加一个新请求，其中 t 表示以毫秒为单位的某个时间，并返回过去 3000 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 [t-3000, t] 内发生的请求数。

保证 每次对 ping 的调用都使用比之前更大的 t 值。

```js
/**
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function (t) {
  this.q.push(t)
  while (this.q[0] < t - 3000) {
    this.q.shift()
  }
  return this.q.length
}
```

### 3.3. 链表 LinkedList

**特点**

- 多个元素组成的列表
- 元素存储不连续，用 next 指针连在一起

**JavaScript 实现**

```js
const a = { val: 'a' }
const b = { val: 'b' }
const c = { val: 'c' }
const d = { val: 'd' }

a.next = b
b.next = c
c.next = d

// 插入
const e = { val: 'e' }
c.next = e
e.next = d

// 删除e（改变next指针）
c.next = d

function ListNode(val, next) {
  this.val = val
  this.next = next ? next : null
}

// 遍历链表
function traverseList(listNode) {
  let p = listNode
  while (p) {
    console.log(p.val)
    p = p.next
  }
}

// 反转链表
// 双指针遍历
function reverseList(listNode) {
  let p1 = null
  let p2 = listNode
  while (p2) {
    const temp = p2.next
    p2.next = p1
    p1 = p2
    p2 = temp
  }
  return p1
}

// 删除链表节点
function deleteListNode(listNode) {
  listNode.val = listNode.next.val
  listNode.next = listNode.next.next
}
```

#### 3.3.1. 链表 vs 数组

- 数组：增删非首尾元素需要移动元素
- 链表：增删非首尾元素，不需要移动元素，只需要更改 next 指针指向

#### 3.3.2. JavaScript 原型链

js 原型链也是链表，通过**proto**连接

```js
obj -> Object.prototype -> null

func -> Function.prototype -> Object.prototype -> null

arr -> Array.prototype -> Object.prototype -> null
```

#### 3.3.3. [237 删除链表中的节点](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/)

```js
function deleteListNode(listNode) {
  listNode.val = listNode.next.val
  listNode.next = listNode.next.next
}
```

#### 3.3.4. [206 反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

```js
// 迭代版
// 双指针，一前一后遍历链表
// 重复操作将n+1指针指向n
// 时间复杂度：O(n)
// 空间复杂度：O(1)
function reverseList(head) {
  let prev = null
  let curr = head
  while (p2) {
    const next = p2.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

// 递归版
// 时间复杂度：O(n)
// 空间复杂度：O(n) 函数调用栈深度
function reverseList(head) {
  if (head === null || head.next === null) return head
  const newHead = reverseList(head.next)
  // 让n+1的next指向n (n+1 => head.next; n => head)
  head.next.next = head
  // 解除n的next
  // n的next由n-1指定
  head.next = null
  return newHead
}
```

#### 3.3.5. [141 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

给定一个链表，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。如果链表中存在环，则返回`true`。 否则，返回`false`。

```js
/**
 * 方案一 集合（无序且唯一）
 * 使用set集合存储head
 * 如果出现已经存在的head
 * 说明链表出现环路
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  let p = head
  const set = new Set()
  while (p) {
    if (set.has(p)) {
      return true
    }
    set.add(p)
    p = p.next
  }
  return false
}

/**
 * 方案二 快慢指针
 * 举例：比如龟兔赛跑，正常情况下乌龟无法跑赢兔子，但是如果出现环路
 * 兔子首先进入环路，当乌龟进入环路时，兔子会再次与乌龟相遇
 * 反向思考，如果乌龟能够与兔子相遇说明出现环路
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  if (!head || !head.next) return false
  let slow = head
  let fast = head.next
  // fast不为空，slow就不为空
  // 快指针再次与慢指针相遇，则说明出现环路
  while (fast && fast.next) {
    if (slow === fast) {
      return true
    }
    slow = slow.next
    fast = fast.next?.next
  }

  return false
}
```

#### 3.3.6. [2 两数相加（待做）](https://leetcode-cn.com/problems/add-two-numbers/)

#### 3.3.7. 实现 instanceOf

如果 A 沿着原型链找到 B.prototype，那么 A instanceOf B 为 true

```js
function instanceOf(A, B) {
  let p = A
  while (p) {
    if (p === B.prototype) return true
    p = p.__proto__
  }

  return false
}
```

#### 3.3.8. 使用链表指针获取 JSON 的节点值

```js
const json = {
  a: { b: { c: 1 } },
  d: { e: 2 },
}

const path = ['d', 'e']
let p = json
path.forEach((k) => {
  p = p[k]
})
```

### 3.4. 集合 Set

**特点**
无序且唯一

**JavaScript 实现**
es6 中有集合，名为 Set

**应用场景**
去重、判断元素是否在集合中、求交集

#### 3.4.1. Set 对象

**基本操作**

- has
- add
  添加对象是存在不同堆里，是不重复的，所以添加两个相同的对象是可以的
- delete

**迭代方法**

- keys()
- values()
- entries()

#### 3.4.2. Set 去重

```js
const arr = [1, 2, 3, 4]
const arr2 = [...new Set(arr)]
```

#### 3.4.3. [349 两个数组的交集](https://leetcode-cn.com/problems/intersection-of-two-arrays/)

去重求交集

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  return [...new Set(nums1)].filter((item) => nums2.includes(item))
}
```

### 3.5. 字典 Map

**特点**
字典是一种存储唯一值的数据结构，它是以**键值对**的形式存储

**JS 实现**
es6 中有字典，名为 Map

**应用场景**
键值对的增删改查：set, get, delete, clear

#### 3.5.1. [349 两个数组的交集(字典方式)](https://leetcode-cn.com/problems/intersection-of-two-arrays/)

#### 3.5.2. [20 有效的括号(字典方式)](https://leetcode-cn.com/problems/valid-parentheses/)

```js
// 使用map重构
var isValid = function (s) {
  if (s.length % 2 === 1) return false
  const stack = []
  const map = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
  ])
  for (let i = 0; i < s.length; i++) {
    const a = s[i]
    if (map.has(a)) {
      stack.push(a)
    } else {
      const t = stack[stack.length - 1]
      if (a === map.get(t)) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  return stack.length === 0
}
```

#### 3.5.3. [1 两数之和](https://leetcode-cn.com/problems/two-sum/)

输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1]

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// 比如：用字典建立一个婚姻介绍所，存储相亲者的数字和下标
var twoSum = function (nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const a = nums[i]
    const a2 = target - a
    if (map.has(a2)) {
      return [map.get(a2), i]
    } else {
      map.set(a, i)
    }
  }
}
```

#### 3.5.4. [3 无重复字符的最长子串（双指针滑动窗口）](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

```js
/**
 * 用双指针维护一个滑动窗口，用来剪切子串
 * 不断移动右指针，遇到重复字符，就把左指针移到重复字符的下一位
 * 过程中，记录所有窗口的长度，并返回最大值
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let l = 0
  let res = 0
  const map = new Map()
  for (let r = 0; r < s.length; r++) {
    if (map.has(s[r]) && map.get(s[r]) >= l) {
      l = map.get(s[r]) + 1
    }
    res = Math.max(res, r - l + 1)
    map.set(s[r], r)
  }
  return res
}
```

#### 3.5.5. [76 最小覆盖子串(待做)](https://leetcode-cn.com/problems/minimum-window-substring/)

### 3.6. 树 Tree

**特点**
一种分层数据的抽象模型

**JS 实现**
js 中没有树，可以使用 Object 和 Array 构建树

```js
{
    label: 'a',
    value: 'aa',
    children: [
        {
            label: 'a1',
            value: 'aa1'
        }
    ]
}
```

**应用场景**
DOM, 级联选择，

**常规操作**
深度/广度优先遍历、先中后序遍历

**理解深度/广度优先遍历**

- 比如看书
- 深度遍历就想看书标题在看小节看完后在看下一个标题下一个小节
- 广度遍历先看目录，在看章节，在看每个章节的小节

**模拟一颗树**

```js
const tree = {
  val: 'a',
  children: [
    {
      val: 'b',
      children: [
        {
          val: 'd',
          children: [],
        },
        {
          val: 'e',
          children: [],
        },
      ],
    },
    {
      val: 'c',
      children: [
        {
          val: 'f',
          children: [],
        },
        {
          val: 'g',
          children: [],
        },
      ],
    },
  ],
}
```

#### 3.6.1. 深度优先遍历 Depth-First-Search

尽可能深搜索树的分支

- 先访问根节点
- 对根节点的 children 挨个进行深度优先遍历

```js
function dfs(root) {
  console.log(root.val)
  root.children.forEach(dfs)
}
dfs(tree)
```

#### 3.6.2. 广度优先遍历 Breath First Search

先访问里根节点最近的节点

- 新建一个队列，把根节点入队
- 把队头出队并访问
- 把队头的 children 挨个入队
- 重复第二，三步，直到队列为空

```js
function bfs(root) {
  const q = [root]
  while (q.length > 0) {
    const n = q.shift()
    console.log(n.val)
    n.children.forEach((child) => {
      q.push(child)
    })
  }
}
```

#### 3.6.3. 二叉树

- 树中每个节点最多只能有两个子节点
- 在 js 中使用 Object 模拟

```js
{
    val: 1,
    left: {
        val: 2,
        left: {
            val: 4,
            left: null,
            right: null,
        },
        right: {
            val: 5,
            left: null,
            right: null,
        }
    },
    right: {
        val: 3,
        left: {
            val: 6,
            left: null,
            right: null,
        },
        right: {
            val: 7,
            left: null,
            right: null,
        }
    }
}
```

##### 3.6.3.1. 二叉树遍历

![binaryTree](@/dataStructuresAndAlgorithms/binaryTree.png)

dfs 根据根节点访问顺序，可以分为：

- 前序遍历（根左右） `[5,4,1,2,6,7,8]`
- 中序遍历（左根右）`[1,4,2,5,7,6,8]`
- 后序遍历（左右根）`[1,2,4,7,8,6,5]`

bfs:

- 层序遍历

**先序遍历**

- 访问根节点
- 对根节点的左子树进行先序遍历
- 对根节点的右子树进行先序遍历

```js
// 递归
const preorder = (root) => {
  if (!root) return
  console.log(root.val)
  preorder(root.left)
  preorder(root.right)
}

// 迭代版本
const preorder = (root) => {
  if (!root) return
  const stack = [root]
  while (stack.length) {
    console.log(stack)
    const n = stack.pop()
    console.log(n.val)
    if (n.right) stack.push(n.right)
    if (n.left) stack.push(n.left)
  }
}
```

**中序遍历**

- 对根节点的左子树进行中序遍历
- 访问根节点
- 对根节点的右子树进行中序遍历

```js
// 递归版
const inorder = (root) => {
  if (!root) return
  inorder(root.left)
  console.log(root.val)
  inorder(root.right)
}

// 迭代版
const inorder = (root) => {
  if (!root) return
  const stack = [root]
  let p = root
  while (stack.length || p) {
    while (p) {
      stack.push(p)
      p = p.left
    }
    const n = stack.pop()
    console.log(n.val)
    p = n.right
  }
}
```

**后序遍历**

- 对根节点的左子树进行后序遍历
- 对根节点的右子树进行后序遍历
- 访问根节点

```js
// 递归版
const postorder = (root) => {
  if (!root) return
  postorder(root.left)
  postorder(root.right)
  console.log(root.val)
}

// 迭代版
const postorder = (root) => {
  if (!root) return
  const stack = [root]
  const outputStack = []
  while (stack.length) {
    const n = stack.pop()
    outputStack.push(n)
    if (n.left) stack.push(n.left)
    if (n.right) stack.push(n.right)
  }
  while (outputStack.length) {
    const n = outputStack.pop()
    console.log(n.val)
  }
}
```

#### 3.6.4. 遍历 JSON 的所有节点值

```js
const json = {
    a: { b: { c: 1 } },
    d: [1, 2],
}
const dfsJson = (n, path) => {
    Object.keys(n).forEach(k => {
        dfsJson(n[k], path.concat(k))
    })
}

dfsJson(json. [])
```

#### 3.6.5. 渲染 Antd 中的树组件

```js
function () {
    const dfs = (n) => {
        return (
            <TreeNode title={n.title} key={n.key}>
                {n.children.map(dfs)}
            </TreeNode>
        )
    }
}
```

#### 3.6.6. [104 二叉树最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * 方式一
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  let res = 0
  const dfs = (n, l) => {
    if (!n) return
    if (!n.left && !n.right) {
      return (res = Math.max(res, l))
    }
    dfs(n.left, l + 1)
    dfs(n.right, l + 1)
  }
  dfs(root, 1)
  return res
}

/**
 * 方式二
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) return 0
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}
```

#### 3.6.7. [111 二叉树最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * 广度优先遍历
 * 时空复杂度：O(n)
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (!root) return 0
  const q = [[root, 1]]
  while (q.length) {
    const [n, level] = q.shift()
    if (!n.left && !n.right) return level
    n.left && q.push([n.left, level + 1])
    n.right && q.push([n.right, level + 1])
  }
}
```

#### 3.6.8. [102 二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * 维持一个队列
 * 存储节点和level值
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return []
  const res = []
  const q = [[root, 0]]
  while (q.length) {
    const [n, level] = q.shift()
    if (!res[level]) {
      res.push([n.val])
    } else {
      res[level].push(n.val)
    }
    if (n.left) q.push([n.left, level + 1])
    if (n.right) q.push([n.right, level + 1])
  }
  return res
}

/**
 * 优化
 * 始终保持当前层级为队头
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return []
  const res = []
  const q = [root]
  while (q.length) {
    let len = q.length
    res.push([])
    // 把当前层级前的节点数据推出队列
    while (len--) {
      const n = q.shift()
      res[res.length - 1].push(n.val)
      if (n.left) q.push(n.left)
      if (n.right) q.push(n.right)
    }
  }
  return res
}
```

#### 3.6.9. [144 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

```js
/**
 * 递归版
 * 时空复杂度：O(n)
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  let res = []
  const rec = (root) => {
    if (!root) return
    res.push(root.val)
    rec(root.left)
    rec(root.right)
  }
  rec(root)
  return res
}

/**
 * 迭代版
 * 维护一个栈
 * 时空复杂度O(n)
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  const res = []
  const stack = []
  if (root) stack.push(root)
  while (stack.length) {
    const n = stack.pop()
    res.push(n.val)
    // 栈后进先出，先把right推入栈
    if (n.right) stack.push(n.right)
    if (n.left) stack.push(n.left)
  }
  return res
}
```

#### 3.6.10. [94 二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

```js
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const res = []
  const rec = (n) => {
    if (!n) return
    rec(n.left)
    res.push(n.val)
    rec(n.right)
  }

  rec(root)
  return res
}
```

#### 3.6.11. [145 二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

```js
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  const res = []
  const rec = (n) => {
    if (!n) return
    rec(n.left)
    rec(n.right)
    res.push(n.val)
  }
  rec(root)
  return res
}
```

#### 3.6.12. [112 路径总和](https://leetcode-cn.com/problems/path-sum/)

给你二叉树的根节点  root 和一个表示目标和的整数  targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和  targetSum 。

**叶子节点**是指没有子节点的节点。

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
输出：true
```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false
  let res = false
  // 深度优先遍历
  const dfs = (n, s) => {
    if (!n.left && !n.right && s === targetSum) {
      res = true
    }
    if (n.left) dfs(n.left, s + n.left.val)
    if (n.right) dfs(n.right, s + n.right.val)
  }
  dfs(root, root.val)
  return res
}
```

## 4. 排序与搜索

### 4.1. 冒泡排序

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

### 4.2. 选择排序

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

### 4.3. 插入排序

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

### 4.4. 归并排序

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

### 4.5. 快速排序

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

### 4.6. 顺序搜索

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

### 4.7. 二分搜索

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

## 5. 算法解题思维

- 栈
  - 20 有效括号（简单）
- 队列
  - 933 最近请求次数（简单）
- 集合
  - 141 环形链路（简单）
- 字典
  - 3 无重复字符的最长子串（简单）
  - 1 两数之和（简单）
- 双指针
  - 滑动窗口
  - 21 合并两个有序链表（简单）
  - 3 无重复字符的最长子串（简单）
  - 344 反转字符串（简单）
  - 234 回文链表（简单）
  - 15 三数之和（中等）
- 快慢指针
  - 141 环形链路（简单）
- 单调栈
  - 739 每日温度（中等）
- 双端队列
  - 239 滑动窗口最大值（困难）
- 原地算法
  - 改变原数据，不新增内存空间
- 二分搜索
  - 374 猜数字大小（简单）
  - 704 二分查找（简单）
- 动态规划
  - 118 杨辉三角（简单）
  - 70 爬楼梯（简单）
  - 53 最大子序和（简单）
  - 121 买卖股票的最佳时机（简单）

一般指针思维直接作用于原数据中，可以降低空间复杂度适用于原地算法要求

### 5.1. 双指针

#### 5.1.1. [15 三数之和](https://leetcode-cn.com/problems/3sum/)

给你一个包含 n 个整数的数组  nums，判断  nums  中是否存在三个元素 a，b，c ，使得  a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```
示例：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

```js
/**
 * 暴力循环
 * 三次循环
 * 时间复杂度：O(n^3)
 * 空间复杂度：O(n)
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  if (nums.length < 2) return []
  nums = nums.sort((a, b) => a - b)
  const res = new Map()
  for (let x = 0; x < nums.length - 2; x++) {
    for (let y = x + 1; y < nums.length - 1; y++) {
      for (let z = y + 1; z < nums.length; z++) {
        if (nums[x] + nums[y] + nums[z] === 0) {
          const arr = [nums[x], nums[y], nums[z]]
          if (!res.has(arr.toString())) {
            res.set(arr.toString(), arr)
          }
        }
      }
    }
  }
  return res
}
```

```js
/**
 * 双指针
 * i, left, right 为指针；i为外循环指针，left, right为左右指针（不重复指针）
 * 定义子问题：nums[i] + nums[left] + nums[right] = 0
 * 将三数之和转化为两数之和
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(n)
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const res = []
  if (nums.length < 2) return []
  nums = nums.sort((a, b) => a - b)
  // 使用map去重
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      continue
    }
    // 使用双指针缩小值得范围
    let left = i + 1
    let right = nums.length - 1
    while (left < right) {
      let s = nums[i] + nums[left] + nums[right]
      if (s < 0) {
        left++
      } else if (s > 0) {
        right--
      } else {
        const arr = [nums[i], nums[left], nums[right]]
        if (!map.has(arr.toString())) {
          map.set(arr.toString(), arr)
        }
        left++
        right--
      }
    }
  }
  return [...map.values()]
}
```

### 5.2. 分而治之

分而治之是算法设计中的一种方法。它将一个问题**分**成多个和原问题相似的小问题，**递归解决**小问题，再将结果**合**并以解决原来的问题

**适用场景**

- 归并排序

  - 分：把数组从中间一分为二
  - 解：递归地对两个子数组进行归并排序
  - 合：合并有序数组

- 快速排序
  - 分：选基准，按基准把数组分成两个子数组
  - 解：递归地对两个子数组进行快速排序
  - 合：对两个子数组进行合并
- 二分搜索
- 翻转二叉树

#### 5.2.1. [226 翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

```js
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (!root) return null
  return {
    val: root.val,
    left: invertTree(root.right),
    right: invertTree(root.left),
  }
}
```

### 5.3. 动态规划

动态规划（Dynamic programming, DP）是算法设计中的一种方法。它将一个问题分解为**相互重叠**的子问题，通过反复求解子问题，来解决原来的问题

- 定义子问题
- 反复执行

**应用场景**

- 斐波那契数列
  斐波那契数列指的是这样一个数列：
  `0, 1, 1, 2, 3, 5, 8,13, 21, 34, 55, 89...`
  这个数列从第 3 项开始，每一项都等于前两项之和。

如果设 n 为该数列的第 n 项，那么这句话可以写成如下形式：f(n) = f(n-1) + f(n-2)

**动态规划 vs 分而治之**

比较定义子问题

- 动态规划 子问题相互重叠
- 分而治之 子问题相互独立

#### 5.3.1. [53 最大子序和](https://leetcode-cn.com/problems/maximum-subarray/)

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**示例：**

```
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

```js
/**
 * 动态规划
 * 定义子问题：max(i) = Max(max(i-1) + nums(i), nums(i))
 * 当当前值大于max(i-1) + nums(i)时，则抛弃之前的值取当前值
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let t = 0
  let max = nums[0]

  for (let i = 0; i < nums.length; i++) {
    t = Math.max(nums[i] + t, nums[i])
    max = Math.max(max, t)
  }
  return max
}
```

#### 5.3.2. [121 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

给定一个数组 prices ，它的第  i 个元素  prices[i] 表示一支给定股票第 i 天的价格。

你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

**示例：**

```
输入：[7,1,5,3,6,4]
输出：5
解释：在第 2 天（股票价格 = 1）的时候买入，
在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
```

```js
/**
 * 暴力循环，耗时
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let max = 0
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      max = Math.max(max, prices[j] - prices[i])
    }
  }
  return max
}
```

```js
/**
 * 动态规划
 * 定义子问题：
 * max(n) = Max(max(n-1), prices(n) - min(n-1))
 * min(n) = Min(min(n-1), prices(n))
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  if (prices.length <= 1) return 0
  let min = prices[0]
  let max = 0
  for (let i = 1; i < prices.length; i++) {
    max = Math.max(max, prices[i] - min)
    min = Math.min(min, prices[i])
  }
  return max
}
```

### 5.4. 贪心算法

期盼通过每一阶段的局部最优选择，从而达到全局的最优，结果并不一定是最优。

**应用场景**

- 零钱兑换

### 5.5. 回溯算法

回溯算法是一种渐进式寻找问题解决方式的策略。回溯算法会先从一个可能的动作开始解决问题，如果不行，就回溯并选择另一个动作，直到将问题解决。

**应用场景**

- 有很多路
- 有死路，有出路
- 需要递归
