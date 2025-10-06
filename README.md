# what

Cloudflare-first full-stack Next.js starter designed for OpenNext and Workers deployments. 技术栈包括：

- Next.js App Router + React Server Components
- TypeScript、ESLint、Vitest 组合
- Tailwind 友好的 PostCSS 流程
- OpenNext Cloudflare Worker bundling
- Cloudflare D1、R2、KV 绑定（`wrangler.jsonc` 已预配置）
- Drizzle ORM 与 Drizzle Kit 迁移工具链
- Storybook 组件工作台

# 如何开始

1. **Fork 项目**：在 GitHub 点击 Fork，把仓库复制到自己的账号下。
2. **Cloudflare Dash 导入**：在 Cloudflare Workers 控制台创建 Worker，选择从 GitHub 导入刚 Fork 的仓库，完成首次构建。
3. **创建并替换绑定**：使用 Wrangler 为 D1、R2、KV 创建资源，并将 `wrangler.jsonc` 中的占位符替换为实际 ID。
   ```bash
   npx wrangler d1 create cf-next-starter-d1
   npx wrangler r2 bucket create cf-next-starter-r2
   npx wrangler kv namespace create cf-next-starter-kv
   # 更新 wrangler.jsonc：写入上面命令返回的 binding id / bucket name
   ```
4. **迁移数据库**：生成 / 推送 Drizzle schema，并在 Cloudflare 上应用迁移。
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit push
   npx wrangler d1 migrations apply cf-next-starter-d1 --remote
   ```
5. **本地开发**：安装依赖并运行 Cloudflare 本地开发服务。
   ```bash
   npm install
   npm run dev
   ```
6. **部署前检查**：修改过绑定后执行 `npm run cf-typegen`，保持 `cloudflare-env.d.ts` 与 Cloudflare 环境同步。

# 特性介绍

- 🚀 **OpenNext + Wrangler 一体化部署**：`npm run deploy` / `npm run preview` 自动构建 Worker 并执行最新迁移。
- 🗄️ **D1 / R2 / KV 示例 API**：内置路由演示三种 Cloudflare 数据服务的读写，并在首页展示状态卡片。
- 🧰 **完善的开发工具链**：Storybook、Vitest、ESLint、Playwright（可选）等工具预置即用。
- 🛡️ **类型安全的 Cloudflare 绑定**：`cloudflare-env.d.ts` 定义所有 Worker 绑定，提升 IDE 联想与编译检查。
- 📦 **现代 Next.js 项目结构**：App Router、Server Components、API Route 均已搭建，方便继续扩展全栈功能。
