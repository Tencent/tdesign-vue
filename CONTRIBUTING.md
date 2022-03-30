# 参与贡献

非常感谢你对 TDesign 的关注，如果你想为组件库或其他产品贡献一份力量，请先了解下以下内容。

## 开启 issue

如果你想要贡献一个新特性，请在实际写代码前先开一个 issue 与社区里的小伙伴一起讨论必要性及实现方案。

## Github flow 贡献流程

- 请将本项目 clone 至本地
- 创建 feature/fix 分支
- 开发过程中可以使用 `git fetch` 或 `git rebase` 来同步上游分支代码
- 提交代码到 forked 仓库，commit message 撰写请参照 [Angular Commits 规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)
- 发起 pr
- 会有 PMC 同学来 CR 本次提交的代码，请及时关注 CR 评论通知信息
- CR 通过后会合并进入 develop 分支，等待周迭代或紧急 patch 版本发布 npm

## 开发

```bash
# 子仓库需要ssh拉取，如果出现类似Host Key verification failed的错误，请先配置ssh，参考文档（https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5）
git clone --recurse-submodules https://github.com/Tencent/tdesign-vue.git
cd tdesign-vue

# 开发预览
npm i
npm run dev

# 打开浏览器访问 http://127.0.0.1:16000
```

更多指引请参考：

- [开发指南](./DEVELOP_GUIDE.md)
- [测试指南](./TEST_GUIDE.md)
