export function toTreeData(data) {
  // 没有父节点的数据
  const parents = data.filter(value => value.parentId === -1)

  // 有父节点的数据
  const children = data.filter(value => value.parentId !== -1)

  // 定义转换方法的具体实现
  const translator = (parents, children) => {
    // 遍历父节点数据
    parents.forEach((parent) => {
      // 遍历子节点数据
      children.forEach((current, index) => {
        // 此时找到父节点对应的一个子节点
        if (current.parentId === parent.id) {
          // 对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          const temp = JSON.parse(JSON.stringify(children))
          // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1)
          // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp)
          current.parentName = parent.name // 修改父吗，名称
          // 把找到子节点放入父节点的children属性中
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      }
      )
    }
    )
  }

  // 调用转换方法
  translator(parents, children)
  // 返回最终的结果
  return parents
}
