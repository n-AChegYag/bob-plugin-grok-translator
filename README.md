# Bob Plugin Grok Translator

[English](README-en.md) | 简体中文

[![GitHub license](https://img.shields.io/github/license/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues)

**Bob Plugin Grok Translator** 是一款为 [Bob](https://bobtranslate.com/) (macOS 翻译和 OCR 软件) 设计的插件，利用 [Grok](https://grok.x.ai/) (xAI) 的强大语言模型提供高质量的翻译服务（方便用掉150美元额度）。

## ✨ 功能特性

*   **高质量翻译**: 利用 Grok 先进的语言模型进行文本翻译。
*   **多语言支持**: 支持 Grok 模型所支持的多种语言之间的互译。
*   **Bob 集成**: 无缝集成到 Bob 应用中，提供便捷的划词翻译和截图翻译体验。
*   **可配置**: 允许用户配置 API 密钥等参数。
*   **可扩展**: 易于扩展以支持其他公司的大语言模型。

## 🚀 安装

1.  **下载插件**:
    *   前往 [Releases](https://github.com/n-AChegYag/bob-plugin-grok-translator/releases) 页面下载最新的 `.bobplugin` 文件。
2.  **安装插件**:
    *   双击下载的 `.bobplugin` 文件，Bob 将自动完成安装。
    *   或者，打开 Bob 的 `偏好设置` -> `插件`，将 `.bobplugin` 文件拖拽到插件列表中。
3.  **启用插件**:
    *   在 Bob 的 `偏好设置` -> `服务` -> `文本翻译` 中，找到 "Grok Translator"，勾选启用。

## ⚙️ 配置

1.  **获取 API 密钥**:
    *   您需要拥有 Grok (xAI) 的 API 访问权限。请参考 [Grok 官方文档](https://grok.x.ai/) 获取 API 密钥。
2.  **配置插件**:
    *   在 Bob 的 `偏好设置` -> `服务` -> `文本翻译` 中，选中 "Grok Translator"。
    *   在右侧的配置界面中，填入您的 Grok API 密钥。
    *   (可选) 根据需要调整其他配置项。

## 模型支持

当前版本集成了以下公司提供的语言模型：

*   **[xAI](https://x.ai/)**:
    *   `grok-3-beta`
    *   `grok-3-fast-beta`
    *   `grok-3-mini-beta`
    *   `grok-3-mini-fast-beta`
*   **[OpenAI](https://openai.com/)**:
    *   `gpt-4o`
    *   `gpt-4o-mini`
    *   `gpt-4.1`
    *   `gpt-4.1-mini`
    *   `gpt-4.1-nano`
    *   `gpt-4.5-preview`
    *   `o1-preview`
    *   `o1-mini`
*   **[Google](https://ai.google/)**:
    *   `gemini-1.5-pro`
    *   `gemini-1.5-flash`
    *   `gemini-2.0-flash`
    *   `gemini-2.5-flash-preview-04-17`
    *   `gemini-2.5-pro-preview-03-25`
*   **[Anthropic](https://www.anthropic.com/)**:
    *   `claude-3-5-haiku-latest`
    *   `claude-3-7-sonnet-latest`
*   **[DeepSeek](https://www.deepseek.com/)**:
    *   `deepseek-chat`
    *   `deepseek-reasoner`

您需要在插件配置中为想要使用的模型提供相应的 API 密钥和选择正确的服务提供商。

我们欢迎社区贡献，以支持更多来自不同公司的优秀语言模型。请参考 [贡献](#-贡献) 部分了解如何添加新的模型支持。

## 💡 使用

*   **划词翻译**: 在 macOS 中选中需要翻译的文本，按下 Bob 设定的划词翻译快捷键 (默认为 `⌥ + D`)。
*   **截图翻译**: 按下 Bob 设定的截图翻译快捷键 (默认为 `⌥ + S`)，截取包含文本的区域。
*   **输入翻译**: 按下 Bob 设定的主界面快捷键 (默认为 `⌥ + A`)，在输入框中输入文本进行翻译。

确保在 Bob 的服务设置中，将 Grok Translator 设置为默认或启用的翻译服务之一。

## 🤝 贡献

欢迎各种形式的贡献！

*   **报告 Bug**: 如果您在使用中遇到问题，请通过 [Issues](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues) 提交 Bug 报告。
*   **提出建议**: 如果您有功能建议或改进想法，欢迎在 [Issues](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues) 中提出。
*   **提交代码**:
    1.  Fork 本仓库。
    2.  创建新的特性分支 (`git checkout -b feature/AmazingFeature`)。
    3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
    4.  将分支推送到 GitHub (`git push origin feature/AmazingFeature`)。
    5.  创建 Pull Request。

### ✨ 新增其他语言模型支持

本插件已支持多家公司的语言模型，如需添加新的语言模型支持，请遵循以下步骤：

1. **了解 Bob 插件架构**：首先熟悉 Bob 插件的基本架构和工作原理。
2. **查看现有模型实现**：参考已实现的语言模型代码，了解如何与各家 API 进行交互。
3. **添加新模型配置**：在配置文件中添加新模型的相关参数，包括 API 端点、身份验证方法等。
4. **实现 API 调用**：为新模型实现特定的 API 调用逻辑，确保能正确处理请求和响应。
5. **添加用户界面选项**：更新用户界面，使用户能够选择并配置新添加的语言模型。
6. **测试功能**：全面测试新添加模型的翻译功能，确保结果准确且稳定。
7. **提交 Pull Request**：按照上述代码贡献流程提交您的更改。

我们欢迎社区成员扩展此插件的功能，集成更多优秀的翻译引擎！

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源。

---

*免责声明: 本插件是基于 Grok (xAI) API 开发的第三方工具，与 xAI 公司无直接关联。请遵守 Grok 的服务条款和使用政策。*
