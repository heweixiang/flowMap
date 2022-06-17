// 将后端返回的对象处理为流程对象
function formatData(backArray) {
  const flowObj = {};
  backArray.forEach(nodeItem => {
    // 组合每个节点
    flowObj[nodeItem.onlyNodeId] = {
      id: nodeItem.onlyNodeId,
      name: nodeItem.taskItem.taskName,
      data: {},
      class: nodeItem.taskItem.taskName,
      html: `<div>${nodeItem.taskItem.taskName}</div>`,
      typenode: false
    }
    // 合并输入输出的连接处理
    flowObj[nodeItem.onlyNodeId] = Object.assign(flowObj[nodeItem.onlyNodeId], dealWithInputsOutputs(nodeItem, backArray));
    // 计算出x,y坐标           pos_x: 1028, pos_y: 87,
    flowObj[nodeItem.onlyNodeId] = Object.assign(flowObj[nodeItem.onlyNodeId], dealWithPosition(nodeItem, backArray));
  })
  return flowObj;
}

// 处理节点的输入输出连接,返回inputs和outputs
function dealWithInputsOutputs(nodeItem, backArray) {
  const inputs = {};
  const outputs = {};
  // 遍历获取输入当前节点的节点
  const inputsIds = backArray.filter(item => item.nextOnlyNodeId.includes(nodeItem.onlyNodeId)).map(item => item.onlyNodeId);
  // 获取当前输出的节点
  const outputsIds = nodeItem.nextOnlyNodeId;
  // 遍历生成输入节点(接收节点,不做控制,有连接就提供)
  if (inputsIds.length > 0) {
    inputs[`input_1`] = { connections: [] };
    inputsIds.forEach(inputId => {
      inputs[`input_1`].connections.push({ node: inputId, input: `output_1` });
    })
  }
  // 遍历生成输出节点(发送节点,后续需要进行状态控制)
  if (outputsIds.length > 0) {
    outputs[`output_1`] = { connections: [] };
    outputsIds.forEach(outputId => {
      outputs[`output_1`].connections.push({ node: outputId, output: `input_1` });
    })
  }
  return {
    inputs,
    outputs
  }
}

// 处理节点定位问题
function dealWithPosition(nodeItem, backArray) {
  const position = { pos_x: 0, pos_y: 0 };
  const rootNode = backArray.find(item => item.nextOnlyNodeId.every(id => backArray.every(item => !item.nextOnlyNodeId.includes(id))));
  /*************************************** 计算y轴 ********************************/
  // 获取当前所有nodeId的数量并统计各个nodeId的数量
  const nodeIdCount = {};
  backArray.map(item => item.nodeId).forEach(nodeId => {
    if (nodeIdCount[nodeId]) {
      nodeIdCount[nodeId] += 1;
    } else {
      nodeIdCount[nodeId] = 1;
    }
  })
  // 取最大的nodeId的数量
  const maxNodeIdCount = Math.max(...Object.values(nodeIdCount))
  // 当前数量
  const currentNodeIdCount = nodeIdCount[nodeItem.nodeId];
  // max-curr如果为0这为0否则除以二
  const y = (maxNodeIdCount - currentNodeIdCount) === 0 ? 0 : (maxNodeIdCount - currentNodeIdCount) / 2;
  // 查找当前node中该nodeId排第几
  const sortNode = backArray.filter(x => x.nodeId === nodeItem.nodeId).findIndex(x => x.onlyNodeId === nodeItem.onlyNodeId);

  position.pos_y = y * 75 + 75 * sortNode;
  /*************************************** 计算x轴 ********************************/
  const BuildTree = buildTree(backArray).find(T => T.onlyNodeId === backArray.find(x => backArray.filter(y => !y.nextOnlyNodeId.includes(x.onlyNodeId))).onlyNodeId)

  const Deep = getDeep(BuildTree, nodeItem.onlyNodeId)

  position.pos_x = Deep * 450;
  return position;
}



// 利用onlyNodeId和nextOnlyNodeId构建树
function buildTree(backArray = []) {
  for (let i = 0; i < backArray.length; i++) {
    for (let j = 0; j < backArray.length; j++) {
      backArray[i].children = backArray[i].nextOnlyNodeId.map(item => backArray.find(x => x.onlyNodeId === item));
    }
  }
  return backArray
}

// 深度搜索getDeep
function getDeep(BuildTree, onlyNodeId, deep = 0) {
  if (BuildTree.onlyNodeId === onlyNodeId) {
    return deep
  } else {
    return Math.min(...BuildTree.children.map(x => getDeep(x, onlyNodeId, deep + 1)))
  }
}

// 扫描所有节点并修改状态
function ScanningModify(backArray = []) {
  backArray.forEach(item => {
    // 针对于当前节点,如果是无状态和待办则修改向下级节点为灰色虚线
    if (['0', '1', 0, 1].includes(item.taskState)) {
      item.nextOnlyNodeId.forEach(id => {
        changeColor(["node_in_node-" + id, "node_out_node-" + item.onlyNodeId], "#888")
        // 灰色虚线
        DottedLine(["node_in_node-" + id, "node_out_node-" + item.onlyNodeId])
      })
    } else if ([-1, '-1'].includes(item.taskState)) {
      item.nextOnlyNodeId.forEach(id => {
        // 退回状态 taskItem存储的为退回单位
        if (id.includes(item.taskItem.returnUnitId)) {
          changeColor(["node_in_node-" + id, "node_out_node-" + item.onlyNodeId], "#f00")
          addArrow(["node_in_node-" + id, "node_out_node-" + item.onlyNodeId], 'Reverse')
        }
      })
    } else {
      item.nextOnlyNodeId.forEach(id => {
        addArrow(["node_in_node-" + id, "node_out_node-" + item.onlyNodeId], 'PositiveDirection')
      })
    }
    // 给待办状态加个样式
    if (['1', 1].includes(item.taskState)) {
      // 给指定id添加class
      document.getElementById("node-" + item.onlyNodeId).classList.add('current')
      console.log('"node-" + item.onlyNodeId: ', "node-" + item.onlyNodeId);
    }
  })
}

// 传入class数组和颜色改变颜色
function changeColor(classArray, color) {
  document.querySelector(`.connection.${classArray.join(".")}`).querySelector(".main-path").style.stroke = color
}

// 修改SVG PATH为虚线
function DottedLine(classArray) {
  document.querySelector(`.connection.${classArray.join(".")}`).querySelector(".main-path").style['stroke-dasharray'] = "20 10"
}


// 根据传入的classArray添加箭头方向,有毒........得看看
function addArrow(classArray, direction) {
  const SVG = document.querySelector(`.connection.${classArray.join(".")}`)
  const Line = document.querySelector(`.connection.${classArray.join(".")}`).querySelector(".main-path")

  // newPath.setAttribute('d',' M 613.4857511520386 193.98294353485107 C 791.4900236129761 193.98294353485107 781.4900236129761 156.48294353485107 899.4942960739136  156.48294353485107')
  // 获取线段点
  const lineD = Line.getAttribute("d").split("C ")[1].split(" ").filter(x => x !== '')
  console.log('lineD: ', lineD);
  const lineDX = lineD.filter((x, i) => i % 2 === 0)
  console.log('lineDX: ', lineDX);
  const lineDY = lineD.filter((x, i) => i % 2 === 1)
  console.log('lineDY: ', lineDY);
  // 获取该线段中点线段
  const midStartX = getLineMid(0.4, lineDX[0], lineDX[1], lineDX[2])
  const midStartY = getLineMid(0.4, lineDY[0], lineDY[1], lineDY[2])
  const midEndX = getLineMid(0.6, lineDX[0], lineDX[1], lineDX[2])
  const midEndY = getLineMid(0.6, lineDY[0], lineDY[1], lineDY[2])
  // 获取两线段的中点
  const midX = getLineMid(0.5, lineDX[0], lineDX[1], lineDX[2])
  const midY = getLineMid(0.5, lineDY[0], lineDY[1], lineDY[2])
  // 获取上面点topDis
  const topDis = getCoordinates(midStartX, midStartY, midEndX, midEndY, 0.4)
  // 获取下面点bottomDis
  const bottomDis = getCoordinates(midStartX, midStartY, midEndX, midEndY, -0.4)
  let dStr = ''
  if (direction === 'PositiveDirection') {
    dStr = ` M ${midEndX} ${midEndY} L ${topDis.x} ${topDis.y} L ${bottomDis.x} ${bottomDis.y} L ${midEndX} ${midEndY}`
  } else {
    dStr = ` M ${midStartX} ${midStartY} L ${topDis.x} ${topDis.y} L ${bottomDis.x} ${bottomDis.y} L ${midStartX} ${midStartY}`
  }
  // 向Line的d属性追加dStr
  Line.setAttribute("d", Line.getAttribute("d") + dStr)
}

// 获取赛贝尔曲线中间点
function getLineMid(T, P1, P2, P3) {
  //  P = (1−t)2P1 + 2(1−t)tP2 + t2P3
  return (1 - T) * (1 - T) * P1 + 2 * (1 - T) * T * P2 + T * T * P3
}

// 在坐标系中根据两个点求垂线上一点的坐标
function getCoordinates(x1, y1, x2, y2, dis) {
  // 直线的斜率
  const k = (y2 - y1) / (x2 - x1)
  // 垂线斜率
  const k2 = -1 / k
  // 中间点
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  // 垂线上的点距离中间点为dis的坐标
  const x = midX + dis * Math.sqrt(1 + Math.pow(k2, 2))
  const y = midY + dis * k2 * Math.sqrt(1 + Math.pow(k2, 2))
  return { x, y }


}