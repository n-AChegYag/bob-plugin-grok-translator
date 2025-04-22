'use strict';

// 去掉不必要的lang.js引用
// var lang = require('./lang.js');

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
    429: "请求过于频繁，请慢一点。xAI 对您在 API 上的请求实施速率限制。",
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

// Grok API基本URL
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

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

// 预检查配置是否正确
const preCheck = (query, completion) => {
    const { apiKey } = $option;
    
    // 检查API Key
    if (!apiKey) {
        completion({
            error: {
                type: "param",
                message: "配置错误 - 请确保您在插件配置中填入了正确的xAI API Key",
                addition: "API Key格式应为: xai-xxxxxxxxxxxxxxxxxxxxxxxx",
            },
        });
        return false;
    }
    
    // 检查API Key格式
    if (!apiKey.startsWith('xai-')) {
        completion({
            error: {
                type: "param",
                message: "API Key格式错误 - xAI的API Key应以xai-开头",
                addition: "请检查您的API Key是否正确",
            },
        });
        return false;
    }
    
    // 检查目标语言是否支持
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

// 准备API请求参数
function useParams(query) {
    const { model } = $option;
    
    const params = {
        model: model || "grok-3-fast-beta",
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
    };
    
    return {
        params,
    };
}

// Bob插件标准翻译函数
function translate(query, completion) {
    const { apiKey } = $option;
    const { addRecord, getRecord, hasRecord } = useRecords(query);
    const { params } = useParams(query);
    
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
        $http.request({
            method: "POST",
            url: GROK_API_URL,
            timeout: 60,
            header: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "X-Title": "Bob翻译插件"
            },
            body: params,
            handler: function(resp) {
                if (resp.error) {
                    handleGeneralError(query, completion, {
                        type: "api",
                        message: resp.error,
                        addition: "请求API时发生错误"
                    });
                    return;
                }
                
                if (resp.response.statusCode >= 400) {
                    // 处理HTTP错误
                    const error = {
                        type: resp.response.statusCode >= 400 && resp.response.statusCode < 500 ? "param" : "api",
                        message: `接口响应错误 - ${HTTP_ERROR_CODES[resp.response.statusCode] || `未知错误 (${resp.response.statusCode})`}`,
                        addition: resp.data ? JSON.stringify(resp.data) : "未知错误"
                    };
                    
                    // 检查是否为API Key错误
                    if (resp.data && (resp.data.error && (resp.data.error.includes("Invalid token") || resp.data.error.includes("Invalid API Key")))) {
                        error.type = "secretKey";
                        error.message = "配置错误 - 请确保您在插件配置中填入了正确的xAI API Key";
                        error.addition = "请在插件配置中填写正确的 API Key (格式: xai-xxxxxxxxxxxxxxxxxxxxxxxx)";
                    }
                    
                    completion({
                        error: error
                    });
                    return;
                }
                
                // 处理成功响应
                if (resp.data) {
                    try {
                        const content = resp.data.choices[0].message.content;
                        if (content) {
                            // 缓存内容
                            addRecord(content);
                            // 返回翻译结果
                            completion({
                                result: {
                                    from: query.detectFrom,
                                    to: query.detectTo,
                                    toParagraphs: [content],
                                },
                            });
                        } else {
                            completion({
                                error: {
                                    type: "api",
                                    message: "API返回的内容为空",
                                    addition: "请重试或联系开发者"
                                }
                            });
                        }
                    } catch (error) {
                        handleGeneralError(query, completion, {
                            type: "api",
                            message: "解析API响应时发生错误",
                            addition: error.message || "未知错误"
                        });
                    }
                } else {
                    completion({
                        error: {
                            type: "api",
                            message: "API返回的数据为空",
                            addition: "请重试或联系开发者"
                        }
                    });
                }
            }
        });
    } catch (error) {
        handleGeneralError(query, completion, {
            type: "api",
            message: error instanceof Error ? error.message : "未知错误",
            addition: "发起HTTP请求时发生错误",
        });
    }
}

// 必须按Bob插件规范导出这两个函数
exports.supportLanguages = supportLanguages;
exports.translate = translate;
