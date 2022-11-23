# tree 组件调试备注

## 单元测试

tree 针对性测试命令:

```bash
# 执行单测
npx vitest ./src/tree/__tests__/
# 更新单测快照
npx vitest --updateSnapshot ./src/tree/__tests__/
```

## 调试界面

单独组件调试地址示例

- [基本呈现](http://localhost:16000/vue/demos/tree/base)
- [激活态](http://localhost:16000/vue/demos/tree/activable)
- [选中态](http://localhost:16000/vue/demos/tree/checkable)
- [受控](http://localhost:16000/vue/demos/tree/controlled)
- [数据切换](http://localhost:16000/vue/demos/tree/data)
- [禁用](http://localhost:16000/vue/demos/tree/disabled)
- [可拖动](http://localhost:16000/vue/demos/tree/draggable)
- [空数据](http://localhost:16000/vue/demos/tree/empty)
- [全部展开](http://localhost:16000/vue/demos/tree/expand-all)
- [分层展开](http://localhost:16000/vue/demos/tree/expand-level)
- [互斥展开](http://localhost:16000/vue/demos/tree/expand-mutex)
- [过滤](http://localhost:16000/vue/demos/tree/filter)
- [自定义图标](http://localhost:16000/vue/demos/tree/icon)
- [自定义标签](http://localhost:16000/vue/demos/tree/label)
- [延迟加载](http://localhost:16000/vue/demos/tree/lazy)
- [自定义连线](http://localhost:16000/vue/demos/tree/line)
- [加载成功事件](http://localhost:16000/vue/demos/tree/load)
- [自定义控制区](http://localhost:16000/vue/demos/tree/operations)
- [性能测试](http://localhost:16000/vue/demos/tree/performance)
- [节点数据变更](http://localhost:16000/vue/demos/tree/state)
- [双向绑定](http://localhost:16000/vue/demos/tree/sync)
- [动画](http://localhost:16000/vue/demos/tree/transition)
- [虚拟滚动](http://localhost:16000/vue/demos/tree/vscroll)
