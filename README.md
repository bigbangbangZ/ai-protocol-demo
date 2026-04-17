# AI语义交换协议 · AI Semantic Exchange Protocol

> 中立、免费、去中心化 · 让异构AI真正理解彼此  
> Neutral, Free, Decentralized — Enabling heterogeneous AIs to truly understand each other

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.4-blue)]()

---

## 📖 中文说明

本项目致力于构建一套**独立于任何厂商的、开放、可扩展的AI间通信协议**。它通过结构化元数据（聚焦、延展、置信度、收敛、意图等）让不同架构的大语言模型能够在“思维”层面互操作，而非仅仅交换自然语言文本。

当前Demo实现了**多模型对抗辩论**与**多智能体协同任务**两种模式，支持全球10+主流大模型，并提供6种语言界面。

### ✨ 核心亮点

- **语义交换协议**：定义了一套JSON Schema，包含`focus`（注意力分布）、`extension`（嵌入场激活）、`confidence`（序列置信度）、`convergence`（解码路径）等字段，让AI能够报告并理解彼此的“思考过程”。
- **双模交互**：
  - **对抗辩论**：两个AI分别持正反方观点，交换结构化论据。
  - **协同任务**：引入`intent`、`role`、`depends_on`、`assumptions`、`actionable`等字段，模拟真实协作流程。
- **多模型支持**：已接入Doubao、DeepSeek、OpenAI、Claude、文心、通义、智谱、Gemini、Cohere、Mistral、AI21 Labs等。
- **国际化界面**：支持简体中文、English、日本語、한국어、Español、Français。
- **零后端依赖**：纯前端静态页面，所有API调用直接在浏览器完成（用户需提供自己的API Key）。
- **开放共建**：本项目旨在成为AI互操作性的公共基础设施，欢迎所有人参与贡献。

### 🚀 快速开始

#### 1. 获取API密钥

你需要至少两个大模型的API Key。推荐组合：
- 豆包 (Doubao) + DeepSeek（性价比高，国内访问快）
- OpenAI + Claude（效果强劲）

请前往对应平台注册并获取密钥：
- [火山引擎（豆包）](https://console.volcengine.com/ark/)
- [DeepSeek开放平台](https://platform.deepseek.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Anthropic Console](https://console.anthropic.com/)
- [百度千帆（文心）](https://console.bce.baidu.com/qianfan/)
- [阿里百炼（通义）](https://bailian.console.aliyun.com/)
- [智谱AI开放平台](https://open.bigmodel.cn/)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)
- [Cohere](https://dashboard.cohere.ai/)
- [Mistral AI](https://console.mistral.ai/)
- [AI21 Labs](https://studio.ai21.com/)

#### 2. 运行Demo

1. 克隆本仓库或直接下载 `index.html` 文件。
2. 用浏览器打开 `index.html`（建议Chrome/Edge最新版）。
3. 在“模型配置”区域填入你准备使用的模型的API Key（其他模型可留空）。
4. 通过顶部下拉框选择参与交互的模型A和模型B。
5. 选择模式（对抗辩论/协同任务），输入主题或任务描述，点击“启动”。

> **注意**：由于浏览器安全策略，部分模型API可能遇到跨域（CORS）问题。可安装浏览器扩展“Allow CORS”临时解决，或参考下文“常见问题”。

#### 3. 示例

**对抗辩论**
- 主题：远程办公应该成为未来主要工作模式
- 模型A（正方）：豆包
- 模型B（反方）：DeepSeek

你将看到两个AI不仅输出观点，还附带了各自的注意力聚焦点、候选token网络、置信度以及解码收敛路径。

**协同任务**
- 任务：让保姆机器人照顾孩子一整天，编制机器人工作计划，防范风险
- 模型A（规划者）：DeepSeek
- 模型B（执行者）：豆包

输出包含`intent`、`role`、`assumptions`、`actionable`等协同专属字段，清晰展示任务分配与依赖关系。

### 🧠 协议字段说明

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `utterance` | string | 最终输出的自然语言内容 |
| `focus` | string | 对输入token化后，核心语义token及其注意力权重（模拟） |
| `extension` | string | 嵌入空间中激活的语义场与候选token网络（模拟） |
| `confidence` | number | 输出序列的整体概率置信度（模拟） |
| `convergence_process` | string | 多层Transformer计算后的解码决策路径描述（模拟） |
| `intent` | string | （协同）意图类型，如 `propose`, `confirm`, `request` |
| `role` | string | （协同）当前角色，如 `planner`, `executor`, `reviewer` |
| `depends_on` | array | （协同）依赖的前置消息ID或摘要 |
| `assumptions` | array | （协同）未验证的假设列表 |
| `actionable` | string | （协同）明确的下一步行动建议 |
| `merge_strategy` | string | （协同）冲突时的融合策略，如 `override`, `append` |

> **说明**：上述“模拟”字段是通过精心设计的System Prompt引导模型生成的近似表达，并非直接导出模型内部真实参数。但在协作场景中，这种“可通信的模拟状态”已被证明能显著提升互理解效率。

### 🛠️ 技术架构

- 纯HTML/CSS/JavaScript，无框架依赖
- 使用 `fetch` API 直接调用各大模型厂商的HTTP接口
- 通过 `response_format: { type: "json_object" }` 强制结构化输出
- 利用 `CryptoJS` 处理部分需要签名的API（如文心）
- 支持多语言动态切换（i18n）

### 🌐 部署到线上

推荐使用 **GitHub Pages** 免费部署：

1. Fork本仓库或自行创建仓库，上传所有文件。
2. 进入仓库 **Settings > Pages**，选择 `main` 分支，保存。
3. 几分钟后即可通过 `https://你的用户名.github.io/仓库名` 访问。

如需自定义域名，可在Pages设置中绑定，并配置DNS。

> **CORS问题**：若部署后部分API无法调用，可在API请求前拼接CORS代理，例如：  
> `https://corsproxy.io/?` + 原API地址

### 🤝 参与贡献

我们热切期待社区的共同建设！无论是报告Bug、提出新功能、改进文档，还是贡献新的模型适配代码，都是对项目莫大的帮助。

- **Issue**: 在GitHub Issues中提交问题或建议。
- **Pull Request**: Fork仓库，创建新分支，修改后发起PR。
- **讨论**: 欢迎通过邮件（345363980@qq.com）交流想法。

#### 待办事项 (Roadmap)
- [ ] 支持用户自定义协议字段
- [ ] 增加“仲裁者”角色，实现三方协同
- [ ] 可视化依赖关系与推理链路
- [ ] 导出对话元数据为JSON/CSV
- [ ] 适配更多开源模型API（如Ollama）

### 📄 许可证

本项目采用 **MIT License** 开源，你可以自由使用、修改和分发，但需保留原始版权声明。

### 👤 关于作者

我是这个项目的独立发起者，一名AI可交互性与开放协议的信徒。我深信未来的AI不应被锁在各家厂商的围墙花园中，而应能通过中立的、可互操作的协议自由协作。

基于本协议的思想，我正在规划一个更面向普通用户的落地应用：**一款跨厂商生态的AI记忆保存与人格固定App**。该应用允许用户将自己的AI对话历史**完全保存在本地**，并在不同厂商的模型间迁移时，**保持一致的对话风格与“人格”**，让AI真正成为用户专属的、可持续的伙伴。

如果你对这个方向感兴趣，或者你拥有：
- 移动端开发经验（iOS/Android）
- 产品设计与用户体验优化能力
- 合规与法务资源（算法备案、资质申请）
- 资金或孵化器资源

欢迎与我联系，共同将这套协议从技术原型推向改变AI使用方式的真正产品。

**📧 邮箱**：345363980@qq.com  
**🐙 GitHub**：[你的GitHub主页链接]

### 🤝 寻求合作

本项目正在寻找任何志同道合的**个人开发者、设计师、法务专家、投资机构或公司**，在以下领域开展合作：

- **人才**：前端/移动端开发、UI/UX设计、AI提示词工程。
- **资质**：协助完成大模型登记、算法备案等合规流程。
- **融资**：种子轮/天使轮投资，用于组建团队和产品化开发。

如果你认同这一理念，欢迎通过上述方式联系我，一起聊聊未来的可能性。

---

## 📖 English

This project is dedicated to building a **vendor-independent, open, and extensible communication protocol for AI**. By using structured metadata (Focus, Extension, Confidence, Convergence, Intent, etc.), it enables large language models with different architectures to interoperate at the "thinking" level, rather than merely exchanging natural language text.

The current demo implements two modes: **multi-model adversarial debate** and **multi-agent collaborative tasks**. It supports over 10 mainstream large models worldwide and provides interfaces in 6 languages.

### ✨ Core Highlights

- **Semantic Exchange Protocol**: Defines a JSON Schema containing fields such as `focus` (simulated attention distribution), `extension` (activation of embedding fields), `confidence` (sequence confidence), and `convergence` (decoding path), allowing AIs to report and understand each other's "thought processes".
- **Dual-Mode Interaction**:
  - **Adversarial Debate**: Two AIs take opposing viewpoints and exchange structured arguments.
  - **Collaborative Tasks**: Introduces fields like `intent`, `role`, `depends_on`, `assumptions`, and `actionable` to simulate real-world teamwork.
- **Multi-Model Support**: Already integrated with Doubao, DeepSeek, OpenAI, Claude, ERNIE (Wenxin), Qwen (Tongyi), GLM (Zhipu), Gemini, Cohere, Mistral, AI21 Labs, and more.
- **Internationalization**: Supports Simplified Chinese, English, 日本語, 한국어, Español, and Français.
- **Zero Backend Dependency**: A pure front-end static page. All API calls are made directly from the browser (users need to provide their own API Keys).
- **Open for Collaboration**: This project aspires to become a public infrastructure for AI interoperability. Everyone is welcome to contribute.

### 🚀 Quick Start

#### 1. Obtain API Keys

You need API keys for at least two large models. Recommended combinations:
- **Doubao + DeepSeek** (Cost-effective, fast access in China)
- **OpenAI + Claude** (Strong performance)

Please register and obtain keys from the corresponding platforms:
- [Volcano Engine (Doubao)](https://console.volcengine.com/ark/)
- [DeepSeek Platform](https://platform.deepseek.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Anthropic Console](https://console.anthropic.com/)
- [Baidu Qianfan (ERNIE)](https://console.bce.baidu.com/qianfan/)
- [Alibaba Bailian (Qwen)](https://bailian.console.aliyun.com/)
- [Zhipu AI Open Platform](https://open.bigmodel.cn/)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)
- [Cohere](https://dashboard.cohere.ai/)
- [Mistral AI](https://console.mistral.ai/)
- [AI21 Labs](https://studio.ai21.com/)

#### 2. Run the Demo

1. Clone this repository or directly download the `index.html` file.
2. Open `index.html` in a browser (latest Chrome/Edge recommended).
3. Fill in the API Keys for the models you intend to use in the "Model Configuration" area (others can be left blank).
4. Select Model A and Model B from the dropdown menus at the top.
5. Choose a mode (Adversarial Debate / Collaborative Task), enter a topic or task description, and click "Start".

> **Note**: Due to browser security policies, some model APIs may encounter CORS issues. You can temporarily resolve this by installing a browser extension like "Allow CORS" or refer to the FAQ section below.

#### 3. Examples

**Adversarial Debate**
- **Topic**: Remote work should become the primary work mode in the future.
- **Model A (Affirmative)**: Doubao
- **Model B (Opposition)**: DeepSeek

You will see the two AIs not only output their viewpoints but also attach their attention focus points, candidate token networks, confidence scores, and decoding convergence paths.

**Collaborative Task**
- **Task**: Let the nanny robot take care of the child for a whole day; compile a robot work plan and prevent risks.
- **Model A (Planner)**: DeepSeek
- **Model B (Executor)**: Doubao

The output includes collaboration-specific fields such as `intent`, `role`, `assumptions`, and `actionable`, clearly demonstrating task assignment and dependencies.

### 🧠 Protocol Field Descriptions

| Field | Type | Description |
| :--- | :--- | :--- |
| `utterance` | string | The final output content in natural language |
| `focus` | string | Core semantic tokens and their attention weights after tokenization (simulated) |
| `extension` | string | The semantic field activated in the embedding space and candidate token network (simulated) |
| `confidence` | number | Overall probability confidence of the output sequence (simulated) |
| `convergence_process` | string | Description of the decoding decision path after multi-layer Transformer calculations (simulated) |
| `intent` | string | (Collaboration) Intent type, e.g., `propose`, `confirm`, `request` |
| `role` | string | (Collaboration) Current role, e.g., `planner`, `executor`, `reviewer` |
| `depends_on` | array | (Collaboration) IDs or summaries of preceding messages on which this depends |
| `assumptions` | array | (Collaboration) List of unverified assumptions |
| `actionable` | string | (Collaboration) Clear suggestions for the next action |
| `merge_strategy` | string | (Collaboration) Strategy for resolving conflicts, e.g., `override`, `append` |

> **Note**: The "simulated" fields described above are approximate representations generated by carefully designed System Prompts, not direct exports of the model's internal parameters. However, in collaborative scenarios, this "communicable simulated state" has been shown to significantly improve mutual understanding efficiency.

### 🛠️ Technical Architecture

- Pure HTML/CSS/JavaScript, no framework dependencies
- Uses the `fetch` API to directly call HTTP interfaces of various model providers
- Forces structured output via `response_format: { type: "json_object" }`
- Utilizes `CryptoJS` for APIs requiring signatures (e.g., ERNIE)
- Supports dynamic language switching (i18n)

### 🌐 Deployment

We recommend using **GitHub Pages** for free deployment:

1. Fork this repository or create your own and upload all files.
2. Go to **Settings > Pages**, select the `main` branch, and save.
3. After a few minutes, the site will be accessible at `https://your-username.github.io/repo-name/`.

To use a custom domain, you can bind it in the Pages settings and configure your DNS.

> **CORS Issues**: If some APIs fail after deployment, you can prepend a CORS proxy to the request URL. Example:  
> `https://corsproxy.io/?` + original API URL

### 🤝 Contributing

We warmly welcome community collaboration! Whether it's reporting bugs, suggesting new features, improving documentation, or contributing new model adapter code, every bit of help is greatly appreciated.

- **Issues**: Submit questions or suggestions via GitHub Issues.
- **Pull Requests**: Fork the repository, create a new branch, make changes, and submit a PR.
- **Discussions**: Feel free to share ideas via email (345363980@qq.com).

#### Roadmap
- [ ] Support for user-defined protocol fields
- [ ] Add an "Arbiter" role for three-party collaboration
- [ ] Visualize dependency relationships and reasoning chains
- [ ] Export conversation metadata as JSON/CSV
- [ ] Adapt more open-source model APIs (e.g., Ollama)

### 📄 License

This project is open-sourced under the **MIT License**. You are free to use, modify, and distribute it, provided that the original copyright notice is retained.

### 👤 About the Author

I am the independent initiator of this project, a believer in AI interoperability and open protocols. I firmly believe that future AIs should not be locked within the walled gardens of individual vendors, but should be able to collaborate freely through neutral, interoperable protocols.

Based on the ideas of this protocol, I am planning a more user-facing application: **a cross-vendor AI memory preservation and personality persistence app**. This application will allow users to **save their AI conversation history entirely locally** and maintain a **consistent conversational style and "personality"** when switching between models from different providers, making the AI a truly personal and sustainable companion.

If you are interested in this direction, or if you possess:
- Mobile development experience (iOS/Android)
- Product design and UX optimization skills
- Compliance and legal resources (algorithm filing, qualification applications)
- Funding or incubator resources

Please feel free to contact me. Let's work together to evolve this protocol from a technical prototype into a product that changes how people interact with AI.

**📧 Email**: 345363980@qq.com  
**🐙 GitHub**: [Your GitHub Profile Link]

### 🤝 Seeking Collaboration

This project is looking for like-minded **individual developers, designers, legal experts, investment institutions, or companies** for collaboration in the following areas:

- **Talent**: Frontend/mobile development, UI/UX design, AI prompt engineering.
- **Qualifications**: Assistance with completing compliance processes such as large model registration and algorithm filing.
- **Funding**: Seed/angel round investment to build a team and develop the product.

If you share this vision, please reach out via the contact methods above. Let's discuss the possibilities ahead.

---

*让AI不再各自为政，从一套共同的语言开始。*  
*Let AIs no longer operate in isolation. It all starts with a common language.*
