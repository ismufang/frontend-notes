## Vue

About Vue2.x and Vue3

## 自定义 Hooks

### useCounter

计数器管理 hook

**Params**

```ts
type ParamsType = {
  initialValue: number
  min?: number
  max?: number
}
```

**Result**

```ts
type CounterType = [
  Ref<number>,
  {
    inc: (delta?: number) => void
    dec: (delta?: number) => void
    set: (value: number | ((currval: number) => number)) => void
    reset: () => void
  }
]
```

**源代码**

```ts
import { ref, Ref } from 'vue'

type CounterType = [
  Ref<number>,
  {
    inc: (delta?: number) => void
    dec: (delta?: number) => void
    set: (value: number | ((currval: number) => number)) => void
    reset: () => void
  }
]

function isNumber(num: any) {
  return typeof num === 'number'
}

/**
 * @name useCounter
 * @param {number} [initialValue=0]
 * @param {number} [min]
 * @param {number} [max]
 * @returns {CounterType}
 */
export function useCounter(
  initialValue: number = 0,
  min?: number,
  max?: number
): CounterType {
  const count = ref(initialValue)
  const _setCount = (val: number) => {
    count.value = val
  }

  function checkRange() {
    if (max != null && min != null && min > max) {
      throw new Error('min should not be greater than max')
    }
  }

  function _init() {
    checkRange()
  }

  function _compareVal(val: number) {
    if (!isNumber(val)) return null
    if ((max != null && val > max) || (min != null && val < min)) return null
    return val
  }

  function inc(delta?: number) {
    const val = delta ? count.value + delta : count.value + 1
    set(val)
  }

  function dec(delta?: number) {
    const val = delta ? count.value - delta : count.value - 1
    set(val)
  }

  function set(type: number | ((currval: number) => number)) {
    let val: any = type
    if (typeof type === 'function') {
      val = type(count.value)
    }
    val = _compareVal(val as number)
    val && _setCount(val as number)
  }

  function reset() {
    _setCount(initialValue)
  }

  _init()

  return [
    count,
    {
      inc,
      dec,
      set,
      reset,
    },
  ]
}
```

### useState

快捷设置状态 hook

**Result**

```ts
type StateType<T> = [Ref<T>, (newState: T) => void]
```

**源代码**

```ts
import { Ref, ref } from 'vue'

type StateType<T> = [Ref<T>, (newState: T) => void]

/**
 * @name useState
 * @param {T} initialValue
 * @returns {StateType<T>}
 */
export function useState<T>(initialValue: T): StateType<T> {
  const state = ref(initialValue) as Ref<T>
  const setState = (newState: T) => {
    state.value = newState
  }
  return [state, setState]
}
```

### useBoolean

Boolean 状态管理 hook

**Result**

```ts
type BooleanType = [
  Ref<boolean>,
  {
    toggle: () => void
    setFalse: () => void
    setTrue: () => void
  }
]
```

**源代码**

```ts
import { Ref, ref } from 'vue'

type BooleanType = [
  Ref<boolean>,
  {
    toggle: () => void
    setFalse: () => void
    setTrue: () => void
  }
]

/**
 * @name useBoolean
 * @param {boolean} [defaultValue=false]
 * @returns {BooleanType}
 */
export function useBoolean(defaultValue: boolean = false): BooleanType {
  const state = ref(defaultValue)
  function toggle() {
    state.value = !state.value
  }

  function setFalse() {
    state.value = false
  }

  function setTrue() {
    state.value = true
  }

  return [state, { toggle, setFalse, setTrue }]
}
```
