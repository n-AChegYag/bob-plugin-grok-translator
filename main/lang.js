'use strict';

/**
 * Bob翻译插件语言映射模块
 */

var langMap = {
    // Bob语言代码到标准语言代码映射
    'auto': 'auto',
    'zh-Hans': 'zh-CN',
    'zh-Hant': 'zh-TW',
    'yue': '粤语',
    'wyw': '古文',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'it': 'it',
    'ru': 'ru',
    'pt': 'pt',
    'nl': 'nl',
    'pl': 'pl',
    'ar': 'ar',
    'tr': 'tr',
    'vi': 'vi',
    'th': 'th',
    'hi': 'hi'
    // ...更多语言映射可以在需要时添加
};

/**
 * 将Bob内部语言代码转换为标准语言代码
 * @param {string} langCode Bob内部使用的语言代码
 * @returns {string} 标准语言代码
 */
function standardLangCode(langCode) {
    return langMap[langCode] || langCode;
}

/**
 * 获取表示语言的名称
 * @param {string} langCode 语言代码
 * @returns {string} 语言名称
 */
function getDisplayName(langCode) {
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
        'tr': '土耳其语',
        'vi': '越南语',
        'th': '泰语',
        'hi': '印地语'
    };
    
    return displayNames[langCode] || langCode;
}

exports.standardLangCode = standardLangCode;
exports.getDisplayName = getDisplayName;