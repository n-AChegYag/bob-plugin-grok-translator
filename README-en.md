# Bob Plugin Grok Translator

English | [简体中文](README.md)

[![GitHub license](https://img.shields.io/github/license/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/n-AChegYag/bob-plugin-grok-translator)](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues)

**Bob Plugin Grok Translator** is a plugin designed for [Bob](https://bobtranslate.com/) (a macOS translation and OCR software), leveraging the powerful language models from various AI providers to deliver high-quality translation services.

## ✨ Features

*   **High-Quality Translation**: Utilize advanced language models for text translation.
*   **Multi-Language Support**: Support translation between multiple languages supported by the integrated models.
*   **Bob Integration**: Seamlessly integrate with the Bob application, providing convenient text selection and screenshot translation experiences.
*   **Configurable**: Allow users to configure API keys and other parameters.
*   **Extensible**: Easy to extend to support language models from other providers.

## 🚀 Installation

1.  **Download the Plugin**:
    *   Go to the [Releases](https://github.com/n-AChegYag/bob-plugin-grok-translator/releases) page to download the latest `.bobplugin` file.
2.  **Install the Plugin**:
    *   Double-click the downloaded `.bobplugin` file, Bob will automatically complete the installation.
    *   Alternatively, open Bob's `Preferences` -> `Plugins`, and drag the `.bobplugin` file into the plugin list.
3.  **Enable the Plugin**:
    *   In Bob's `Preferences` -> `Services` -> `Text Translation`, find "Grok Translator" and check to enable it.

## ⚙️ Configuration

1.  **Get API Keys**:
    *   You need to have API access to the language models you want to use. Please refer to the respective documentation to obtain API keys.
2.  **Configure the Plugin**:
    *   In Bob's `Preferences` -> `Services` -> `Text Translation`, select "Grok Translator".
    *   In the configuration interface on the right, enter your API keys.
    *   (Optional) Adjust other configuration items as needed.

## Model Support

The current version integrates the following language models:

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

You need to provide the appropriate API keys and select the correct service provider in the plugin configuration for the models you want to use.

We welcome community contributions to support more excellent language models from different companies. Please refer to the [Contributions](#-contributions) section to learn how to add support for new models.

## 💡 Usage

*   **Text Selection Translation**: Select the text to be translated in macOS, press the Bob-defined text selection translation shortcut (default is `⌥ + D`).
*   **Screenshot Translation**: Press the Bob-defined screenshot translation shortcut (default is `⌥ + S`), and capture an area containing text.
*   **Input Translation**: Press the Bob-defined main interface shortcut (default is `⌥ + A`), and enter text in the input box for translation.

Ensure that Grok Translator is set as the default or one of the enabled translation services in Bob's service settings.

## 🤝 Contributions

All forms of contributions are welcome!

*   **Report Bugs**: If you encounter issues while using the plugin, please submit a bug report through [Issues](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues).
*   **Suggest Features**: If you have feature suggestions or improvement ideas, please propose them in [Issues](https://github.com/n-AChegYag/bob-plugin-grok-translator/issues).
*   **Submit Code**:
    1.  Fork this repository.
    2.  Create a new feature branch (`git checkout -b feature/AmazingFeature`).
    3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
    4.  Push the branch to GitHub (`git push origin feature/AmazingFeature`).
    5.  Create a Pull Request.

### ✨ Adding Support for Other Language Models

This plugin is designed with extensibility in mind, making it easy to add support for other companies' language models. If you would like to contribute a new translation service provider, follow these steps:

1.  **Create a New Service File**: In the `src/` directory, create a new JavaScript file (e.g., `new_model.js`) following the structure of `grok.js`.
2.  **Implement Translation Logic**: In the new file, implement the logic to interact with the target language model API, including the necessary functions such as `translate`, and follow the Bob plugin API specifications.
3.  **Update `info.json`**: Modify the `info.json` file to add new service configurations or adjust existing ones as needed.
4.  **Update `app.js` (if needed)**: If the new model requires different initialization or processing logic, you may need to modify the `app.js` file.
5.  **Test**: Ensure the new language model integration works properly.
6.  **Submit a Pull Request**: Follow the code contribution process outlined above to submit your changes.

We encourage community members to expand the functionality of this plugin by integrating more excellent translation engines!

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

*Disclaimer: This plugin is a third-party tool developed based on various AI providers' APIs and is not directly associated with those companies. Please comply with the service terms and usage policies of the respective AI providers.*
