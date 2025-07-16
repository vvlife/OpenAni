// 完整的修复版本

document.getElementById('toggleBtn').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleWaifu'}, (response) => {
            if (chrome.runtime.lastError) {
                console.log('请刷新页面后重试');
            }
        });
    });
});

// 加载设置
document.addEventListener('DOMContentLoaded', () => {
    loadApiKey();
});

function loadApiKey() {
    chrome.storage.local.get(['savedApiKey', 'autoShow'], (result) => {
        document.getElementById('apiKeyInput').value = result.savedApiKey || '';
        document.getElementById('autoShow').checked = result.autoShow || false;
    });
}

// 保存API密钥
document.getElementById('saveApiKey').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        alert('请输入API密钥');
        return;
    }

    chrome.storage.local.set({savedApiKey: apiKey}, () => {
        const status = document.getElementById('status');
        status.textContent = '保存成功！';
        status.style.color = '#4CAF50';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);

        // 通知所有标签页更新API密钥
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateApiKey',
                    apiKey: apiKey
                }).catch(() => {});
            });
        });
    });
});
