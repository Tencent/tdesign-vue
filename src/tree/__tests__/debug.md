# tree 组件调试备注

## 单元测试

tree 针对性测试命令:

```bash
# 执行单测
npx jest --config script/test/jest.unit.conf.js ./src/tree/__tests__/
# 更新单测快照
npx jest --config script/test/jest.unit.conf.js --updateSnapshot ./src/tree/__tests__/
```

## 调试界面

单独组件调试地址示例

`http://localhost:16000/vue/demos/tree/base`
