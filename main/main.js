'use strict';

// var lang = require('./lang.js');

// 定义各AI提供商的API URL
const API_URLS = {
    xAI: "https://api.x.ai/v1/chat/completions",
    OpenAI: "https://api.openai.com/v1/chat/completions",
    Anthropic: "https://api.anthropic.com/v1/messages",
    Google: "https://generativelanguage.googleapis.com/v1beta/models/",
    DeepSeek: "https://api.deepseek.com/v1/chat/completions"
};

const HTTP_ERROR_CODES = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "请求过于频繁，请慢一点。API 对您的请求实施速率限制。",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
};

// 支持的语言列表
const SupportLanguages = [
    ["auto", "auto"],
    ["zh-Hans", "zh-CN"],
    ["zh-Hant", "zh-TW"],
    ["en", "en"],
    ["yue", "粤语"],
    ["wyw", "古文"],
    ["ja", "ja"],
    ["ko", "ko"],
    ["fr", "fr"],
    ["de", "de"],
    ["es", "es"],
    ["it", "it"],
    ["ru", "ru"],
    ["pt", "pt"],
    ["nl", "nl"],
    ["pl", "pl"],
    ["ar", "ar"],
    ["af", "af"],
    ["am", "am"],
    ["az", "az"],
    ["be", "be"],
    ["bg", "bg"],
    ["bn", "bn"],
    ["bs", "bs"],
    ["ca", "ca"],
    ["ceb", "ceb"],
    ["co", "co"],
    ["cs", "cs"],
    ["cy", "cy"],
    ["da", "da"],
    ["el", "el"],
    ["eo", "eo"],
    ["et", "et"],
    ["eu", "eu"],
    ["fa", "fa"],
    ["fi", "fi"],
    ["fj", "fj"],
    ["fy", "fy"],
    ["ga", "ga"],
    ["gd", "gd"],
    ["gl", "gl"],
    ["gu", "gu"],
    ["ha", "ha"],
    ["haw", "haw"],
    ["he", "he"],
    ["hi", "hi"],
    ["hmn", "hmn"],
    ["hr", "hr"],
    ["ht", "ht"],
    ["hu", "hu"],
    ["hy", "hy"],
    ["id", "id"],
    ["ig", "ig"],
    ["is", "is"],
    ["jw", "jw"],
    ["ka", "ka"],
    ["kk", "kk"],
    ["km", "km"],
    ["kn", "kn"],
    ["ku", "ku"],
    ["ky", "ky"],
    ["la", "lo"],
    ["lb", "lb"],
    ["lo", "lo"],
    ["lt", "lt"],
    ["lv", "lv"],
    ["mg", "mg"],
    ["mi", "mi"],
    ["mk", "mk"],
    ["ml", "ml"],
    ["mn", "mn"],
    ["mr", "mr"],
    ["ms", "ms"],
    ["mt", "mt"],
    ["my", "my"],
    ["ne", "ne"],
    ["no", "no"],
    ["ny", "ny"],
    ["or", "or"],
    ["pa", "pa"],
    ["ps", "ps"],
    ["ro", "ro"],
    ["rw", "rw"],
    ["si", "si"],
    ["sk", "sk"],
    ["sl", "sl"],
    ["sm", "sm"],
    ["sn", "sn"],
    ["so", "so"],
    ["sq", "sq"],
    ["sr", "sr"],
    ["sr-Cyrl", "sr"],
    ["sr-Latn", "sr"],
    ["st", "st"],
    ["su", "su"],
    ["sv", "sv"],
    ["sw", "sw"],
    ["ta", "ta"],
    ["te", "te"],
    ["tg", "tg"],
    ["th", "th"],
    ["tk", "tk"],
    ["tl", "tl"],
    ["tr", "tr"],
    ["tt", "tt"],
    ["ug", "ug"],
    ["uk", "uk"],
    ["ur", "ur"],
    ["uz", "uz"],
    ["vi", "vi"],
    ["xh", "xh"],
    ["yi", "yi"],
    ["yo", "yo"],
    ["zu", "zu"],
];

// 获取支持的语种 - 必须按Bob插件规范导出
function supportLanguages() {
    return SupportLanguages.map((item) => item[0]);
}

// 语言代码映射
const langMap = new Map(SupportLanguages.map(([key, value]) => [key, value]));

// 将Bob的语言代码转换为标准语言代码
function standardLangCode(langCode) {
    return langMap.get(langCode) || langCode;
}

// 获取语言的显示名称
function getLanguageDisplayName(langCode) {
    const displayNames = {
        'auto': '自动检测',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en': '英语',
        'ja': '日语',
        'ko': '韩语',
        'fr': '法语',
        'de': '德语',
        'es': '西班牙语',
        'it': '意大利语',
        'ru': '俄语',
        'pt': '葡萄牙语',
        'nl': '荷兰语',
        'pl': '波兰语',
        'ar': '阿拉伯语',
    };
    return displayNames[langCode] || langCode;
}

// 生成翻译提示词
function generatePrompt(query) {
    const { text } = query;
    const sourceLangDisplay = getLanguageDisplayName(standardLangCode(query.detectFrom));
    const targetLangDisplay = getLanguageDisplayName(standardLangCode(query.detectTo));
    
    // 如果用户设置了自定义提示词，优先使用
    if ($option.prompt) {
        return parseStringTemplate($option.prompt, {
            sourceLang: sourceLangDisplay,
            targetLang: targetLangDisplay,
            sourceText: query.text,
        });
    }
    
    if (isEnglishWord(text.trim())) {
        // 单词解释模式
        return parseStringTemplate(`
请详细解释英文单词"{sourceText}"，包含以下内容：
1. 词性和基本释义
2. 音标和发音指南
3. 常见用法和例句
4. 相关词组和搭配
5. 近义词和反义词
6. 中文对应表达
请用{targetLang}回答。
        `, {
            sourceLang: sourceLangDisplay,
            targetLang: targetLangDisplay,
            sourceText: query.text,
        });
    } else {
        // 普通翻译模式
        return parseStringTemplate(`
请将以下{sourceLang}文本翻译成{targetLang}，保持原文的风格、语气和格式：

{sourceText}

翻译要自然流畅，符合目标语言的表达习惯。保留专业术语和专有名词。
        `, {
            sourceLang: sourceLangDisplay,
            targetLang: targetLangDisplay,
            sourceText: query.text,
        });
    }
}

// 生成系统提示词
function generateSystemPrompt(query) {
    const { text } = query;
    
    return isEnglishWord(text.trim())
        ? "你是一位语言专家，精通多种语言的词汇、语法和用法。你的任务是提供准确、全面的单词解释，帮助用户理解单词的含义和用法。"
        : "你是一位专业翻译，能够准确地在不同语言之间转换文本，保持原文的含义、风格和语气。直接提供翻译结果，不要添加解释或其他内容。";
}

/**
 * 替换字符串模板中的占位符
 */
const parseStringTemplate = (template, data) => {
    return template.replace(/\{[^}]*\}/g, function (m) {
        const key = m.replace(/\{|\}/g, "");
        return data.hasOwnProperty(key) ? data[key] : "";
    });
};

// 处理错误
function handleGeneralError(query, completion, error) {
    if ("response" in error) {
        // 处理HTTP响应错误
        const { statusCode } = error.response;
        const reason = statusCode >= 400 && statusCode < 500 ? "param" : "api";
        completion({
            error: {
                type: reason,
                message: `接口响应错误 - ${HTTP_ERROR_CODES[statusCode] || `未知错误 (${statusCode})`}`,
                addition: `${JSON.stringify(error)}`,
            },
        });
    } else {
        // 处理一般错误
        completion({
            error: {
                ...error,
                type: error.type || "unknown",
                message: error.message || "未知错误",
            },
        });
    }
}

// 判断是否为英文单词
function isEnglishWord(text) {
    return text.split(" ").length === 1 && /^[a-zA-Z]+$/.test(text);
}

// 生成缓存键
function generateSetKey(query) {
    return `${query.from}-${query.to}-${query.text.trim()}`;
}

// 缓存相关
const records = new Map();
const maxRecords = 100;

function useRecords(query) {
    const addRecord = (value) => {
        records.set(generateSetKey(query), value);
        if (records.size > maxRecords) {
            deleteLastRecord();
        }
    };
    
    const getRecord = () => {
        return records.get(generateSetKey(query)) || "";
    };
    
    const deleteLastRecord = () => {
        const lastKey = records.keys().next().value;
        if (lastKey) {
            records.delete(lastKey);
        }
    };
    
    const clearRecords = () => {
        records.clear();
    };
    
    const hasRecord = () => {
        return records.has(generateSetKey(query));
    };
    
    return {
        addRecord,
        getRecord,
        clearRecords,
        hasRecord,
    };
}

// 获取API KEY
function getApiKey(provider) {
    provider = provider || $option.provider || "xAI";
    
    // 根据不同的提供商返回对应的API Key
    switch (provider) {
        case 'xAI':
            return $option.xAIApiKey || "";
        case 'OpenAI':
            return $option.openAIApiKey || "";
        case 'Anthropic':
            return $option.anthropicApiKey || "";
        case 'Google':
            return $option.googleApiKey || "";
        case 'DeepSeek':
            return $option.deepSeekApiKey || "";
        case 'Custom':
            return $option.customApiKey || "";
        default:
            return $option.apiKey || ""; // 兼容旧版本
    }
}

// 获取基础URL
function getApiBaseUrl(provider) {
    provider = provider || $option.provider || "xAI";
    
    // 自定义提供商优先使用customApiBase字段
    if (provider === 'Custom') {
        return $option.customApiBase || "";
    }
    
    // 全局API基础URL设置，如果设置了则覆盖默认值
    if ($option.apiBase && $option.apiBase.trim() !== "") {
        return $option.apiBase.trim();
    }
    
    // 使用默认的API URL
    return API_URLS[provider];
}

// 获取选中的AI模型
function getSelectedModel(provider) {
    switch (provider) {
        case 'xAI':
            return $option.xAIModel || "grok-3-fast-beta";
        case 'OpenAI':
            return $option.openAIModel || "gpt-4o";
        case 'Anthropic':
            return $option.anthropicModel || "claude-3-7-sonnet-latest";
        case 'Google':
            return $option.googleModel || "gemini-2.0-flash";
        case 'DeepSeek':
            return $option.deepSeekModel || "deepseek-chat";
        case 'Custom':
            return $option.customModelName || "custom-model";
        default:
            return "grok-3-fast-beta"; // 默认
    }
}

// 检查API KEY格式
function checkApiKeyFormat(provider, apiKey) {
    if (!apiKey) return false;
    
    // 自定义提供商只需要API Key不为空即可
    if (provider === 'Custom') {
        return apiKey.length > 0;
    }
    
    switch (provider) {
        case 'xAI':
            return apiKey.startsWith('xai-');
        case 'OpenAI':
            return apiKey.startsWith('sk-');
        case 'Anthropic':
            return apiKey.startsWith('sk-ant-') || apiKey.startsWith('anthropic-');
        case 'Google':
            return apiKey.length > 10; // Google API key没有特定前缀
        case 'DeepSeek':
            return apiKey.startsWith('sk-');
        default:
            return apiKey.length > 0; // 兼容旧版本
    }
}

// 获取API请求header
function getHeaders(provider, apiKey) {
    const commonHeaders = {
        "Content-Type": "application/json",
        "X-Title": "Bob翻译插件"
    };
    
    // 自定义提供商默认使用Bearer Token认证（最常见）
    if (provider === 'Custom') {
        return {
            ...commonHeaders,
            "Authorization": `Bearer ${apiKey}`
        };
    }
    
    switch (provider) {
        case 'xAI':
        case 'OpenAI':
        case 'DeepSeek':
            return {
                ...commonHeaders,
                "Authorization": `Bearer ${apiKey}`
            };
        
        case 'Anthropic':
            return {
                ...commonHeaders,
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            };
            
        case 'Google':
            return {
                ...commonHeaders,
                "x-goog-api-key": apiKey
            };
            
        default:
            return commonHeaders;
    }
}

// 预检查配置是否正确
const preCheck = (query, completion) => {
    const provider = $option.provider || "xAI";
    const apiKey = getApiKey(provider);
    
    // 检查API Key
    if (!apiKey) {
        completion({
            error: {
                type: "param",
                message: `配置错误 - 请确保您在插件配置中填入了正确的${provider} API Key`,
                addition: `${provider} API Key不能为空`,
            },
        });
        return false;
    }
    
    // 检查API Key格式
    if (!checkApiKeyFormat(provider, apiKey)) {
        completion({
            error: {
                type: "param",
                message: `API Key格式错误 - ${provider}的API Key格式不正确`,
                addition: "请检查您的API Key是否正确",
            },
        });
        return false;
    }
    
    // 自定义提供商需要检查API基础URL
    if (provider === 'Custom') {
        const apiBase = getApiBaseUrl(provider);
        if (!apiBase) {
            completion({
                error: {
                    type: "param",
                    message: `配置错误 - 使用自定义提供商时必须填写API基础URL`,
                    addition: "请在插件配置中填写自定义API基础URL",
                },
            });
            return false;
        }
        
        // 检查模型名称
        const modelName = getSelectedModel(provider);
        if (!modelName) {
            completion({
                error: {
                    type: "param",
                    message: `配置错误 - 使用自定义提供商时必须填写模型名称`,
                    addition: "请在插件配置中填写自定义模型名称",
                },
            });
            return false;
        }
    }
    
    // 仅检查目标语言是否支持，与原始仓库保持一致
    if (!langMap.get(query.detectTo)) {
        completion({
            error: {
                type: "unsupportedLanguage",
                message: "不支持该语种",
                addition: `不支持的目标语种: ${query.detectTo}`,
            },
        });
        return false;
    }
    
    return true;
};

// 获取完整的API URL
function getFullApiUrl(provider, model) {
    const baseUrl = getApiBaseUrl(provider);
    
    // Google API需要特殊处理，其他提供商直接使用基础URL
    if (provider === 'Google') {
        return `${baseUrl}${model}:generateContent`;
    }
    
    return baseUrl;
}

// 检查API错误响应
function checkErrorResponse(provider, resp) {
    if (resp.data) {
        // 自定义提供商通用错误检测
        if (provider === 'Custom' && resp.data.error) {
            let errorMsg = typeof resp.data.error === 'string' ? resp.data.error : JSON.stringify(resp.data.error);
            return {
                type: "api",
                message: `API错误 - ${errorMsg}`,
                addition: "请检查自定义API配置和模型名称是否正确"
            };
        }
        
        if (provider === 'xAI' && resp.data.error && resp.data.error.includes("Invalid token")) {
            return {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的xAI API Key",
                addition: "请在插件配置中填写正确的 API Key (格式: xai-xxxxxxxxxxxxxxxxxxxxxxxx)"
            };
        }
        
        if (provider === 'OpenAI' && resp.data.error && resp.data.error.message && resp.data.error.message.includes("API key")) {
            return {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的OpenAI API Key",
                addition: "请在插件配置中填写正确的 API Key (格式: sk-xxxxxxxxxxxxxxxxxxxxxxxx)"
            };
        }
        
        if (provider === 'Anthropic' && resp.data.error && resp.data.error.type === "authentication_error") {
            return {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的Anthropic API Key",
                addition: "请在插件配置中填写正确的 API Key"
            };
        }
        
        if (provider === 'Google' && resp.data.error && resp.data.error.message && resp.data.error.message.includes("API key")) {
            return {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的Google API Key",
                addition: "请在插件配置中填写正确的 API Key"
            };
        }
        
        if (provider === 'DeepSeek' && resp.data.error && resp.data.error.message && resp.data.error.message.includes("API key")) {
            return {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的DeepSeek API Key",
                addition: "请在插件配置中填写正确的 API Key (格式: sk-xxxxxxxxxxxxxxxxxxxxxxxx)"
            };
        }
    }
    
    // 通用错误
    return {
        type: resp.response.statusCode >= 400 && resp.response.statusCode < 500 ? "param" : "api",
        message: `接口响应错误 - ${HTTP_ERROR_CODES[resp.response.statusCode] || `未知错误 (${resp.response.statusCode})`}`,
        addition: resp.data ? JSON.stringify(resp.data) : "未知错误"
    };
}

// 从API响应中提取内容
function extractContentFromResponse(data, provider) {
    try {
        // 自定义提供商的响应解析逻辑
        if (provider === 'Custom') {
            // 尝试OpenAI格式
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            }
            // 尝试Anthropic格式
            if (data.content && data.content[0] && data.content[0].text) {
                return data.content[0].text;
            }
            // 尝试Google格式
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                return data.candidates[0].content.parts[0].text;
            }
            // 尝试直接文本字段
            if (data.text) {
                return data.text;
            }
            if (data.result) {
                return typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
            }
            if (data.translation) {
                return data.translation;
            }
            if (data.translated_text) {
                return data.translated_text;
            }
            
            // 实在找不到，返回整个响应的字符串形式
            return JSON.stringify(data);
        }
        
        // 标准提供商的响应解析
        switch (provider) {
            case 'xAI':
            case 'OpenAI':
            case 'DeepSeek':
                return data.choices[0].message.content;
                
            case 'Anthropic':
                return data.content[0].text;
                
            case 'Google':
                return data.candidates[0].content.parts[0].text;
                
            default:
                throw new Error(`不支持的AI提供商: ${provider}`);
        }
    } catch (error) {
        throw new Error(`解析${provider}响应失败: ${error.message}`);
    }
}

// 准备API请求参数
function useParams(query, provider) {
    const selectedModel = getSelectedModel(provider);
    
    const params = {
        model: selectedModel,
        messages: [
            {
                role: "system",
                content: generateSystemPrompt(query),
            },
            {
                role: "user",
                content: generatePrompt(query),
            },
        ],
        temperature: parseFloat($option.temperature || "0.3"),
        max_tokens: parseInt($option.maxTokens || "2000"),
    };

    // 针对不同提供商调整参数格式
    if (provider === 'Google') {
        // Google API需要特殊的请求格式
        return {
            params: {
                contents: [
                    {
                        parts: [
                            {
                                text: generatePrompt(query)
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: parseFloat($option.temperature || "0.3"),
                    maxOutputTokens: parseInt($option.maxTokens || "2000"),
                    topP: 0.95
                }
            }
        };
    } else if (provider === 'Anthropic') {
        params.system = generateSystemPrompt(query);
        params.messages = [
            {
                role: "user",
                content: generatePrompt(query)
            }
        ];
        params.max_tokens = parseInt($option.maxTokens || "2000");
    }
    
    return { params };
}

// Bob插件标准翻译函数
function translate(query, completion) {
    const provider = $option.provider || "xAI";
    const apiKey = getApiKey(provider);
    const { addRecord, getRecord, hasRecord } = useRecords(query);
    
    // 如果有缓存，直接返回
    if (hasRecord()) {
        const record = getRecord();
        if (record) {
            completion({
                result: {
                    from: query.detectFrom,
                    to: query.detectTo,
                    toParagraphs: [record],
                },
            });
            return;
        }
    }
    
    // 预检查配置
    if (!preCheck(query, completion)) {
        return;
    }
    
    try {
        const { params } = useParams(query, provider);
        const headers = getHeaders(provider, apiKey);
        const selectedModel = getSelectedModel(provider);
        const apiUrl = getFullApiUrl(provider, selectedModel);

        // 发起HTTP请求
        $http.request({
            method: "POST",
            url: apiUrl,
            timeout: 60, // 请求超时时间
            header: headers,
            body: params,
            // 处理响应的回调函数
            handler: function(resp) {
                // 检查请求本身是否出错 (e.g., network error)
                if (resp.error) {
                    handleGeneralError(query, completion, {
                        type: resp.error.type || "api", // Use error type if available
                        message: resp.error.message || "请求API时发生网络或未知错误",
                        addition: `Error details: ${JSON.stringify(resp.error)}`
                    });
                    return;
                }

                // 检查HTTP状态码是否表示错误
                if (resp.response.statusCode >= 400) {
                    const error = checkErrorResponse(provider, resp); // Get specific error details
                    completion({ error: error });
                    return;
                }

                // 处理成功的响应 (status code 2xx)
                if (resp.data) {
                    try {
                        const content = extractContentFromResponse(resp.data, provider);
                        if (content) {
                            addRecord(content); // Cache the result
                            completion({
                                result: {
                                    from: query.detectFrom,
                                    to: query.detectTo,
                                    toParagraphs: [content], // Bob expects paragraphs
                                },
                            });
                        } else {
                            // API returned data, but content extraction failed or was empty
                            completion({
                                error: {
                                    type: "api",
                                    message: "API成功响应，但未能提取有效内容",
                                    addition: `Raw data: ${JSON.stringify(resp.data)}`
                                }
                            });
                        }
                    } catch (parseError) {
                        // Error during content extraction
                        handleGeneralError(query, completion, {
                            type: "api",
                            message: "解析API响应时发生错误",
                            addition: parseError.message || "未知解析错误"
                        });
                    }
                } else {
                    // Successful status code but no data in response body
                    completion({
                        error: {
                            type: "api",
                            message: "API成功响应，但返回的数据为空",
                            addition: `Status code: ${resp.response.statusCode}`
                        }
                    });
                }
            } // end of handler function
        }); // end of $http.request call

    } catch (requestSetupError) {
        // Error occurred before the HTTP request was even sent (e.g., in useParams, getHeaders)
        handleGeneralError(query, completion, {
            type: "param", // Likely a setup issue
            message: requestSetupError instanceof Error ? requestSetupError.message : "发起请求前发生未知错误",
            addition: "请检查插件配置或函数调用",
        });
    }
}

// 必须按Bob插件规范导出这两个函数
exports.supportLanguages = supportLanguages;
exports.translate = translate;
