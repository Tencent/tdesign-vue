# 版本发布流程

## 发布频率

组件库正常每周滚动发布版本，一般在周三/周四，尽量不在周五或晚上发布，防止周末非工作时间响应不及时

如果遇到用户要求紧急修复 bug，可以视情况发布 PATCH 或先行版本，判断标准：

- 影响范围大，大多数用户都可能会遇到问题：请遵照正常发布流程严格测试产物质量及整理 changelog 后发布 PATCH 版本，以使用户可以自动更新到
- 新上线的功能，仅有少量用户使用：可以不整理 changelog，直接发布先行版本供用户使用，如 `x.y.z-alpha`

## 版本号说明

目前还没有发布 1.0.0 正式版本，因此可以随时发布 PATCH、MINOR 及 MAJOR 版本，1.0.0 发布后 MINOR 及 MAJOR 版本的发布需要 PMC 团队决策后发布。

版本号设置遵循 [SemVer 语义化版本控制规范 2.0.0](https://semver.org/lang/zh-CN/)，一切以保证用户版本稳定性为前提，原则如下：

- 当进行不兼容的 API 更改时，升级 MAJOR 版本
- 当以向后兼容的方式添加功能时，升级 MINOR 版本
- 当进行向后兼容的缺陷修复时，升级 PATCH 版本

目前我们还没有发布 1.0.0 版本，因此以 MINOR 作为 breaking change 时的迭代版本号

### 原因

用户项目的 package.json 文件中一般使用 `^` 或 `~` 来限制包版本：

- `^`: 只会执行不更改最左边非零数字的更新，如果写入的是 ^0.13.0，可以更新到 0.13.1、0.13.2 等，但不能更新到 0.14.0 或更高版本。 如果写入的是 ^1.13.0，则当运行 npm update 时，可以更新到 1.13.1、1.14.0 等，但不能更新到 2.0.0 或更高版本
- `~`: 如果写入的是 〜0.13.0，则当运行 npm update 时，会更新到补丁版本：即 0.13.1 可以，但 0.14.0 不可以。

参考 [使用 npm 的语义版本控制](http://nodejs.cn/learn/semantic-versioning-using-npm)、[npm/node-semver](https://github.com/npm/node-semver#caret-ranges-123-025-004)

## 发布人职责

负责本次发布的同学应该

- review 这一迭代周期内的所有 MR 是否被正常合并，每个 MR 的描述是否准确，如果有关联的 issue，需要在 MR 评论中补充 issue 链接
- 是否所有 issue 都得到了处理，如果已有 mr，请在 issue 中评论 mr 链接（目前工蜂还不能像 GitHub 一样在 issue 中自动显示关联 mr）
- 根据 MR 和 issue 整理 changelog （可以使用 [publish-cli](https://github.com/Tencent/tdesign-starter-cli/tree/main/packages/publish-cli) 帮助生成）
- 如果发布了 Breaking Change 版本，应该把上一个 MAJOR 版本的版本号更新至官网历史版本处，以支持历史版本官网供用户查看。

## 发布流程

- 从 `develop` 新建 `docs/x.y.z-changelog` 分支，整理 changelog 并 push 分支到远端
- changelog 分支链接发到群里召唤小伙伴们一起 review
- review 无误，`squash merge` 到 develop，保持只有一条更改 changelog 内容的 commit
- 本地删除 node_modules 目录后重新安装依赖后，执行 `npm run build` 通过
- 推送 develop 分支到远端，触发部署体验环境，验证体验环境无误
- 本地 `git tag x.y.z` 后 `git push origin x.y.z`，触发 [TAG_PUSH](https://github.com/Tencent/tdesign-vue/blob/develop/.github/workflows/tag-push.yml) GitAction 进行发包动作
- 包发布成功后，merge develop 到 main 分支，推送远端后触发官网部署流水线
- 官网部署完毕后，企微机器人通知群里用户更新
- copy changelog 到 GitHub repo release（后面考虑改成自动触发更新 release）
- 内网 mk TDesign 发版 Topic 下，copy changelog 内容发布新的版本更新动态
