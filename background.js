chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'broadcastApiKey') {
        console.log('broadcasting');
        // 向所有标签页广播API密钥更新
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateApiKey',
                    apiKey: request.apiKey
                }).catch(() => {});
            });
        });
    }
});