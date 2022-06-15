/*
  [
    {
      onlyNodeId, // 根据配置生成的唯一节点ID
      nextOnlyNodeId, // 根据配置生成的唯一节点ID 下一节点   多个[字符串数组]
      nodeId, // 当前节点的id
      nodeItem, // 流程配置的基本信息
      taskId, // 当前任务id  nodeId可能出多个单位并行的情况, 前端指向taskId   ? task没创建怎么办
      deptId, // 当前任务涉及单位ID
      deptName, // 当前任务涉及单位名称
      deptItem, // 当前任务涉及单位信息
      taskState, // 当前任务状态 0: 无状态 1: 待审核 2: 通过 -1: 驳回 -9: 异常
      taskMessage, // 当前任务提示消息线条悬浮显示
      taskItem, // 该node当前需显示的任务项 例如退户的话就不是显示最新而是显示历史表的那条
      taskItemList, // 该node所有的任务项
    }
  ]
*/

// 模拟后端返回的数据 20条 3节点
var backData = [
  {
    onlyNodeId: '8_1__d8667ffef8804cbe926920f5b7aedc56',
    nextOnlyNodeId: ['8_2__7ffbc04a502e41278e9b56e0760e849e', '8_2__f4f2c90e56d041b5966cd7963b6efa7a', '8_2__720d511217884f6d88ce201f28e04c99', '8_2__1e815019f28d4883b09d33190c1aa613'],
    nodeId: '8_1',
    nodeItem: {
      nodeId: '8_1',
      nodeName: '节点1',
      nodeType: '1',
      nodeDesc: '节点1描述'
    },
    taskId: '83ed0433a7ec4e0c883278d2947aa01a',
    deptId: 'd8667ffef8804cbe926920f5b7aedc56',
    deptName: '单位1',
    deptItem: {
      deptId: 'd8667ffef8804cbe926920f5b7aedc56',
      deptName: '单位1',
      deptType: '1',
      deptDesc: '单位1描述',
    },
    taskState: '2',
    taskMessage: '节点1提示消息',
    taskItem: {
      taskId: '83ed0433a7ec4e0c883278d2947aa01a',
      taskName: '任务1',
      taskType: '1',
      taskDesc: '任务1描述',
      taskState: '2',
      taskMessage: '任务1提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_2__7ffbc04a502e41278e9b56e0760e849e',
    nextOnlyNodeId: ['8_3__63abb64dd3574bb89c4b636a6a8d5f43'],
    nodeId: '8_2',
    nodeItem: {
      nodeId: '8_2',
      nodeName: '节点2',
      nodeType: '2',
      nodeDesc: '节点2描述'
    },
    taskId: '1ecc953f4f714f9b96afe3d03f36e18b',
    deptId: '7ffbc04a502e41278e9b56e0760e849e',
    deptName: '单位2',
    deptItem: {
      deptId: '7ffbc04a502e41278e9b56e0760e849e',
      deptName: '单位2',
      deptType: '2',
      deptDesc: '单位2描述',
    },
    taskState: '1',
    taskMessage: '节点2提示消息',
    taskItem: {
      taskId: '1ecc953f4f714f9b96afe3d03f36e18b',
      taskName: '任务2',
      taskType: '2',
      taskDesc: '任务2描述',
      taskState: '1',
      taskMessage: '任务2提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_2__f4f2c90e56d041b5966cd7963b6efa7a',
    nextOnlyNodeId: ['8_3__63abb64dd3574bb89c4b636a6a8d5f43'],
    nodeId: '8_2',
    nodeItem: {
      nodeId: '8_2',
      nodeName: '节点3',
      nodeType: '3',
      nodeDesc: '节点3描述'
    },
    taskId: '0234f19395a44fbab7b0c0af24e510bc',
    deptId: 'f4f2c90e56d041b5966cd7963b6efa7a',
    deptName: '单位3',
    deptItem: {
      deptId: 'f4f2c90e56d041b5966cd7963b6efa7a',
      deptName: '单位3',
      deptType: '3',
      deptDesc: '单位3描述',
    },
    taskState: '2',
    taskMessage: '节点3提示消息',
    taskItem: {
      taskId: '0234f19395a44fbab7b0c0af24e510bc',
      taskName: '任务3',
      taskType: '3',
      taskDesc: '任务3描述',
      taskState: '2',
      taskMessage: '任务3提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_2__1e815019f28d4883b09d33190c1aa613',
    nextOnlyNodeId: ['8_3__63abb64dd3574bb89c4b636a6a8d5f43'],
    nodeId: '8_2',
    nodeItem: {
      nodeId: '8_2',
      nodeName: '节点4',
      nodeType: '4',
      nodeDesc: '节点4描述'
    },
    taskId: '40b0ba78d55d45d5b508adcbe5849714',
    deptId: '1e815019f28d4883b09d33190c1aa613',
    deptName: '单位4',
    deptItem: {
      deptId: '1e815019f28d4883b09d33190c1aa613',
      deptName: '单位4',
      deptType: '4',
      deptDesc: '单位4描述',
    },
    taskState: '-1',
    taskMessage: '节点4提示消息',
    taskItem: {
      taskId: '40b0ba78d55d45d5b508adcbe5849714',
      taskName: '任务4',
      taskType: '4',
      taskDesc: '任务4描述',
      taskState: '-1',
      taskMessage: '任务4提示消息',
      taskTime: '2018-01-01',
      returnUnitId: '63abb64dd3574bb89c4b636a6a8d5f43',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_2__720d511217884f6d88ce201f28e04c99',
    nextOnlyNodeId: ['8_3__63abb64dd3574bb89c4b636a6a8d5f43'],
    nodeId: '8_2',
    nodeItem: {
      nodeId: '8_2',
      nodeName: '节点4',
      nodeType: '4',
      nodeDesc: '节点4描述'
    },
    taskId: '0a1be3b10a1549caa056f5ab0a1afbc6',
    deptId: '720d511217884f6d88ce201f28e04c99',
    deptName: '单位4',
    deptItem: {
      deptId: '720d511217884f6d88ce201f28e04c99',
      deptName: '单位4',
      deptType: '4',
      deptDesc: '单位4描述',
    },
    taskState: '0',
    taskMessage: '节点4提示消息',
    taskItem: {
      taskId: '0a1be3b10a1549caa056f5ab0a1afbc6',
      taskName: '任务4',
      taskType: '4',
      taskDesc: '任务4描述',
      taskState: '0',
      taskMessage: '任务4提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_3__63abb64dd3574bb89c4b636a6a8d5f43',
    nextOnlyNodeId: ['8_4__09787c6c779a457bb044b1158ddcc738'],
    nodeId: '8_3',
    nodeItem: {
      nodeId: '8_3',
      nodeName: '节点5',
      nodeType: '5',
      nodeDesc: '节点1描述'
    },
    taskId: '1240d8bbb68d4699b1214423cab39ce0',
    deptId: '63abb64dd3574bb89c4b636a6a8d5f43',
    deptName: '单位5',
    deptItem: {
      deptId: '63abb64dd3574bb89c4b636a6a8d5f43',
      deptName: '单位5',
      deptType: '5',
      deptDesc: '单位5描述',
    },
    taskState: '0',
    taskMessage: '节点5提示消息',
    taskItem: {
      taskId: '1240d8bbb68d4699b1214423cab39ce0',
      taskName: '任务5',
      taskType: '1',
      taskDesc: '任务5描述',
      taskState: '0',
      taskMessage: '任务5提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  },
  {
    onlyNodeId: '8_4__09787c6c779a457bb044b1158ddcc738',
    nextOnlyNodeId: [],
    nodeId: '8_4',
    nodeItem: {
      nodeId: '8_4',
      nodeName: '节点6',
      nodeType: '6',
      nodeDesc: '节点1描述'
    },
    taskId: 'b1b466c29829462db46024a760b38b06',
    deptId: '09787c6c779a457bb044b1158ddcc738',
    deptName: '单位5',
    deptItem: {
      deptId: '09787c6c779a457bb044b1158ddcc738',
      deptName: '单位5',
      deptType: '5',
      deptDesc: '单位5描述',
    },
    taskState: '0',
    taskMessage: '节点5提示消息',
    taskItem: {
      taskId: 'b1b466c29829462db46024a760b38b06',
      taskName: '任务5',
      taskType: '1',
      taskDesc: '任务5描述',
      taskState: '0',
      taskMessage: '任务5提示消息',
      taskTime: '2018-01-01',
    },
    taskItemList: []
  }
]
