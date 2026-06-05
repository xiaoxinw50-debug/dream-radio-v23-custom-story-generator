# 梦境电台 Dream Radio

“梦境电台”是一个面向电子商务课程展示的 AI 个性化助眠内容电商平台 Demo。项目围绕年轻女性、大学生和高压职场人睡前放松场景，展示从内容生成、试听播放、会员订阅、数字内容包、礼盒推荐到数据看板的完整商业闭环。

## 核心功能

- AI 末世小说定制：支持大女主、CP/无 CP、空间异能、安全屋、囤货经营、狗血程度、必须出现元素和规避元素等设定。
- 十二星座内容生成：根据星座和梦境场景生成“十二星座决定你的末日庇护所”等短视频口播与分镜脚本。
- 睡前内容生成：覆盖雨夜书店、猫咪旅馆、深夜便利店、白噪音声景等低刺激音频场景。
- 播放与沉浸模式：展示播放器、章节、定时淡出、背景音和睡前陪伴体验。
- 电商闭环：内容包、会员、礼盒、购物车、结算、支付成功页和用户画像推荐。
- 商业看板：展示订单、会员转化、内容包销量和礼盒收入等课程汇报所需指标。

## 技术栈

- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Deployment: Render 单服务部署，Express 在生产环境托管前端静态文件

## 本地运行

后端 API：

```bash
cd backend
npm install
npm run dev
```

前端页面：

```bash
cd frontend
npm install
npm run dev
```

默认访问地址：

```text
前端：http://localhost:5173
后端：http://localhost:8787
健康检查：http://localhost:8787/api/health
```

## 生产构建

根目录提供统一脚本，适合 Render 部署：

```bash
npm run build
npm start
```

生产环境下，Express 会直接服务 `frontend/dist`，API 与网页共用同一个域名。

## Render 部署

仓库包含 `render.yaml`，可在 Render 中使用 Blueprint 方式部署。

```yaml
buildCommand: npm run build
startCommand: npm start
```

部署完成后，打开 Render 分配的网址即可访问完整网站；`/api/health` 可用于检查后端是否正常运行。

## 项目定位

本 Demo 不把助眠内容包装成医疗治疗工具，而是定位为“睡前放松与情绪舒缓内容电商平台”。它展示的重点不是单个音频播放功能，而是 AI 内容生成如何与会员订阅、数字内容包、实体礼盒和用户数据运营结合，形成可讲解、可演示、可商业化的电子商务项目原型。
