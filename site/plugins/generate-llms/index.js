import { promises, readFileSync, existsSync } from 'fs';
import path from 'path';

import generateLlmsDocs, { createComponentDocParser } from '../../../src/_common/docs/plugins/generate-llms';

/** 列出 demo 的候选路径：_example/<demoName>.vue（含 kebab/camelCase 双写）与 _example/<demoName>/index.vue。 */
function demoCandidates(componentDir, demoName) {
  const camelName = demoName.includes('-') ? demoName.replace(/-([a-z0-9])/g, (_m, c) => c.toUpperCase()) : demoName;
  const names = camelName === demoName ? [demoName] : [demoName, camelName];
  return names.flatMap((name) => [
    path.join(componentDir, '_example', `${name}.vue`),
    path.join(componentDir, '_example', name, 'index.vue'),
  ]);
}

/**
 * 读取组件目录下的 demo 源码：_example/<demoName>.vue，回退 _example/<demoName>/index.vue。
 * 输出 Vue SFC 代码块。
 */
function readVueDemo(componentDir, demoName) {
  for (const candidate of demoCandidates(componentDir, demoName)) {
    try {
      const content = readFileSync(candidate, 'utf-8');
      if (content.trim()) return `\`\`\`vue\n${content.trim()}\n\`\`\``;
    } catch {
      // 继续尝试下一个候选路径
    }
  }
  return '';
}

/**
 * 判断是否为 demo 占位符：匹配 _example/<demoName>.vue 或 _example/<demoName>/index.vue。
 * 本仓库 demo 为扁平 .vue 文件（非目录），默认目录判断不命中，需自定义以正确替换 {{ demo }}。
 */
function is_examplelot(componentDir, demoName) {
  return demoCandidates(componentDir, demoName).some((candidate) => existsSync(candidate));
}

/**
 * 将文档中 camelCase 的 {{ demoName }} 占位符归一化为 kebab-case（如 {{ iconDemo }} -> {{ icon-demo }}），
 * 以命中通用占位符正则（仅匹配小写）；仅当对应 demo 文件确实存在时才改写，避免误伤正文内容。
 */
function normalizeDemoPlaceholders(doc, componentDir) {
  return doc.replace(/\{\{\s*([a-zA-Z][a-zA-Z0-9]*)\s*\}\}/g, (match, name) => {
    if (!/[A-Z]/.test(name) || !is_examplelot(componentDir, name)) return match;
    const kebabName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return `{{ ${kebabName} }}`;
  });
}

/**
 * vite 插件：站点构建时，基于组件清单映射生成组件的 LLM Markdown 文档。
 * 核心逻辑为纯 JS 方法 generateLlmsDocs（来自 common 的 docs/plugins/generate-llms），
 * 此处仅负责 vite 构建钩子分发，并按 web-vue 仓库约定注入组件文档与 demo 源码读取器。
 */
export default function generateLlmsPlugin() {
  let config;
  return {
    name: 'generate-llms',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async closeBundle(error) {
      if (error) return;
      if (!config.env.PROD && config.env.MODE !== 'preview') return;

      // 基于 config.root 推导路径，避免依赖 __dirname 多层回溯
      const siteRoot = config.root;
      const componentsRoot = path.resolve(siteRoot, '../src');
      // common 子仓文档根目录（组件文档为 docs/web/api/<slug>.md，含 frontmatter 与 {{ demo }} 占位符）
      const docsRoot = path.resolve(siteRoot, '../src/_common/docs');
      // 产物输出目录：从 config.build.outDir 推导，避免硬编码 dist
      const outputDir = path.resolve(siteRoot, config.build.outDir || 'dist');

      // 组件文档读取器：common 子仓 docs/web/api/<slug>.md（frontmatter + 代码演示 + API），
      // 并追加组件目录 <slug>.md 的 API 部分（站点构建时由 :: BASE_DOC :: 注入，此处手动拼接）
      const readComponentDoc = async (componentDir, slug) => {
        const docPath = path.join(docsRoot, 'web/api', `${slug}.md`);
        try {
          const raw = await promises.readFile(docPath, 'utf-8');
          const apiDoc = await promises.readFile(path.join(componentDir, `${slug}.md`), 'utf-8').catch(() => '');
          const apiBody = apiDoc.replace(/^[^\S\n]*::\s*BASE_DOC\s*::[^\S\n]*\n?/m, '').trim();
          const doc = apiBody ? `${raw}\n\n${apiBody}\n` : raw;
          return normalizeDemoPlaceholders(doc, componentDir);
        } catch {
          return null;
        }
      };

      // 通用文档解析管道：读取 frontmatter -> 替换 demo -> 清理正文
      const parseComponentDoc = createComponentDocParser({
        readComponentDoc,
        readDemoCode: readVueDemo,
        isDemoSlot: is_examplelot,
        transformers: [],
      });

      await generateLlmsDocs({
        componentsRoot,
        outputDir,
        platform: 'web',
        parseComponentDoc,
        siteTitle: 'TDesign web Vue',
        siteDescription: 'TDesign 适配桌面端的组件库，适合在 Vue2.x 技术栈项目中使用。',
        siteBaseUrl: config.base,
      });
    },
  };
}
