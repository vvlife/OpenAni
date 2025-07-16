// 内容脚本，用于在页面中注入Live2D组件
const live2d_path = chrome.runtime.getURL('/');

// 加载autoload.js
const script = document.createElement('script');
script.src = live2d_path + 'autoload.js';
script.onload = () => {
    console.log('Live2D组件加载成功');
};
script.onerror = (error) => {
    console.error('Live2D组件加载失败:', error);
};
document.head.appendChild(script);

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleWaifu') {
        const waifu = document.getElementById('waifu');
        if (waifu) {
            waifu.style.display = waifu.style.display === 'none' ? 'block' : 'none';
            sendResponse({status: waifu.style.display});
        } else {
            sendResponse({status: 'not found'});
        }
    } else if (request.action === 'updateApiKey') {
        // 向页面内的Live2D组件发送API密钥更新消息
        window.postMessage({
            type: 'UPDATE_API_KEY',
            apiKey: request.apiKey
        }, '*');
        sendResponse({status: 'updated'});
    }
});

// 监听来自页面内部的消息（如果需要）
window.addEventListener('message', (event) => {
    if (event.data.type === 'REQUEST_API_KEY') {
        // 如果页面内的组件请求API密钥，可以从chrome.storage获取
        chrome.storage.local.get(['savedApiKey'], (result) => {
            window.postMessage({
                type: 'API_KEY_RESPONSE',
                apiKey: result.savedApiKey || ''
            }, '*');
        });
    }
});

// 在content.js中添加页面加载时的API密钥获取
window.addEventListener('load', () => {
    // 页面加载完成后立即获取API密钥
    chrome.storage.local.get(['savedApiKey'], (result) => {
        if (result.savedApiKey) {
            // 向页面内的Live2D组件发送API密钥
            window.postMessage({
                type: 'UPDATE_API_KEY',
                apiKey: result.savedApiKey
            }, '*');
        }
    });
});

// 保持现有的消息监听
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateApiKey') {
        window.postMessage({
            type: 'UPDATE_API_KEY',
            apiKey: request.apiKey
        }, '*');
        sendResponse({status: 'updated'});
    }
});