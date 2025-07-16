// import fa_comment from "@fortawesome/fontawesome-free/svgs/solid/comment.svg";
// import fa_paper_plane from "@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg";
// import fa_user_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-user.svg";
// import fa_street_view from "@fortawesome/fontawesome-free/svgs/solid/street-view.svg";
// import fa_camera_retro from "@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg";
// import fa_info_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-info.svg";
// import fa_xmark from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";

import showMessage from "./message.js";

function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch("https://v1.hitokoto.cn")
        .then(response => response.json())
        .then(result => {
            const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
            showMessage(result.hitokoto, 6000, 9);
        });
}

// 在文件顶部添加全局的getApiKey函数
// 修改getApiKey函数，确保自动获取
function getApiKey() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['savedApiKey'], (result) => {
                resolve(result.savedApiKey || '');
            });
        } else {
            resolve('');
        }
    });
}

// 在工具初始化时预加载API密钥
// 在文件底部添加
(async () => {
    const apiKey = await getApiKey();
    if (apiKey) {
        console.log('工具模块已加载API密钥');
    }
})();

const tools = {
//     "hitokoto": {
//         icon: fa_comment,
//         callback: showHitokoto
//     },
//     "asteroids": {
//         icon: fa_paper_plane,
//         callback: () => {
//             if (window.Asteroids) {
//                 if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
//                 window.ASTEROIDSPLAYERS.push(new Asteroids());
//             } else {
//                 const script = document.createElement("script");
//                 script.src = "https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js";
//                 document.head.appendChild(script);
//             }
//         }
//     },
//     "switch-model": {
//         icon: fa_user_circle,
//         callback: () => {}
//     },
//     "switch-texture": {
//         icon: fa_street_view,
//         callback: () => {}
//     },
//     "photo": {
//         icon: fa_camera_retro,
//         callback: () => {
//             showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
//             Live2D.captureName = "photo.png";
//             Live2D.captureFrame = true;
//         }
//     },
//     // 在tools.js顶部添加全局的getApiKey函数

//     // 修改info回调函数
//     // 修改info回调函数
// "info": {
//     icon: fa_info_circle,
//     callback: async () => {
//         const apiKey = await getApiKey();
//         const settingsHtml = `
//             <div class="settings-panel" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000;">
//                 <h3>API 密钥设置</h3>
//                 <input type="password" id="apiKeyInput" value="${apiKey}" placeholder="输入您的API密钥" style="width: 100%; padding: 8px; margin: 10px 0;">
//                 <button onclick="
//                     const key = document.getElementById('apiKeyInput').value;
//                     chrome.storage.local.set({savedApiKey: key}, () => {
//                         document.querySelector('.settings-panel').remove();
//                         alert('API密钥已保存！');
//                         // 通知所有标签页更新
//                         chrome.runtime.sendMessage({action: 'broadcastApiKey', apiKey: key});
//                     });
//                 " style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px;">保存</button>
//                 <button onclick="document.querySelector('.settings-panel').remove()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; margin-left: 10px;">取消</button>
//             </div>
//         `;
//         document.body.insertAdjacentHTML('beforeend', settingsHtml);
//     }
// },
//     "quit": {
//         icon: fa_xmark,
//         callback: () => {
//             localStorage.setItem("waifu-display", Date.now());
//             showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
//             document.getElementById("waifu").style.bottom = "-500px";
//             setTimeout(() => {
//                 document.getElementById("waifu").style.display = "none";
//                 document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
//             }, 3000);
//         }
//     }
};

export default tools;
