/**
 * docs: https://vuepress.vuejs.org/zh/config/
 */
const path = require('path')

module.exports = {
  base: '/',
  title: '前端笔记',
  description: 'Learn a little every day',
  port: 7777,
  dest: 'dist',
  markdown: {
    // 是否在每个代码块的左侧显示行号
    lineNumbers: false,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'public', 'assets'),
      },
    },
  },
  themeConfig: {
    sidebarDepth: 6,
    lastUpdated: 'Last Updated',
    // repo: 'https://github.com/ismufang/frontend-notes',
    // repoLabel: '查看源码',
    smoothScroll: true,
    nav: [
      { text: '概览', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'React', link: '/react/' },
      { text: 'Vue', link: '/vue/' },
      { text: '数构与算法', link: '/dataStructuresAndAlgorithms/' },
      {
        text: 'GitHub',
        link: 'https://github.com/ismufang/frontend-notes',
        target: '_blank',
      },
    ],
    sidebar: [
      {
        title: '指南',
        path: 'guide/',
      },
      {
        title: 'JavaScript进阶',
        collapsable: false,
        children: [
          ['javaScript/scope', '作用域、闭包、this'],
          ['javaScript/prototype', '原型、原型链'],
          ['javaScript/deepCopy', '实现一个深拷贝'],
        ],
      },
      {
        title: '前端领域',
        collapsable: false,
        children: [['frontend/performanceOptimization', '前端性能优化']],
      },
      {
        title: '计算机网络',
        sidebarDepth: 3,
        collapsable: false,
        children: [
          ['computerNetwork/', '计算机网络简介'],
          ['computerNetwork/httpCache', 'HTTP缓存机制'],
        ],
      },
      {
        title: 'React',
        collapsable: false,
        children: [
          ['react/hooks', 'React Hooks'],
          ['react/stateLibrary', 'React状态管理库'],
        ],
      },
      {
        title: 'Vue',
        collapsable: true,
        children: [['vue/', '介绍']],
      },
      {
        title: '数据结构与算法',
        collapsable: true,
        children: [
          ['dataStructuresAndAlgorithms/', '介绍'],
          {
            title: '数据结构',
            collapsable: true,
            children: [
              ['dataStructuresAndAlgorithms/stack', '栈'],
              ['dataStructuresAndAlgorithms/queue', '队列'],
              ['dataStructuresAndAlgorithms/linkedList', '链表'],
              ['dataStructuresAndAlgorithms/tree', '树'],
              ['dataStructuresAndAlgorithms/set', '集合'],
              ['dataStructuresAndAlgorithms/map', '字典'],
            ],
          },
          {
            title: '算法',
            collapsable: true,
            children: [
              ['dataStructuresAndAlgorithms/sort/bubbleSort', '冒泡排序'],
              ['dataStructuresAndAlgorithms/sort/selectionSort', '选择排序'],
              ['dataStructuresAndAlgorithms/sort/insertionSort', '插入排序'],
              ['dataStructuresAndAlgorithms/sort/quickSort', '快速排序'],
              ['dataStructuresAndAlgorithms/sort/mergeSort', '归并排序'],
            ],
          },
          {
            title: '算法设计思想',
            collapsable: true,
            children: [
              [
                'dataStructuresAndAlgorithms/designIdeas/divideAndRule',
                '分而治之',
              ],
              [
                'dataStructuresAndAlgorithms/designIdeas/dynamicProgramming',
                '动态规划',
              ],
              [
                'dataStructuresAndAlgorithms/designIdeas/greedyAlgorithm',
                '贪心算法',
              ],
              [
                'dataStructuresAndAlgorithms/designIdeas/backtrackingAlgorithm',
                '回溯算法',
              ],
            ],
          },
        ],
      },
    ],
  },
}
