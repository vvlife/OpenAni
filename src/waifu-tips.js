import initWidget from "./index.js";

window.initWidget = initWidget;

initWidget({
    waifuPath: "waifu-tips.json",
    //apiPath: "https://live2d.fghrsh.net/api/",
    cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
    tools: []
});

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