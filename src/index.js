import Model from "./model.js";
import showMessage from "./message.js";
import showResponseToUser from "./chat.js";
import randomSelection from "./utils.js";
import tools from "./tools.js";

function loadWidget(config) {

    // 在文件顶部添加
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'cover';
    video.style.zIndex = '-1';
    document.body.prepend(video);

    // 在现有代码中添加摄像头启动逻辑
    async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
    } catch(err) {
        showMessage('摄像头访问失败: ' + err.message, 3000);
    }
    }

    // 在初始化完成后调用
    // startCamera();

    const model = new Model(config);
    localStorage.removeItem("waifu-display");
    sessionStorage.removeItem("waifu-text");
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
            <div id="waifu-tips">按住我說話</div>
            <canvas id="live2d" width="800" height="800"></canvas>
            <div id="waifu-tool"></div>
        </div>
        <style>
            #waifu {
                position: fixed;
                left: 20px;
                bottom: 20px;
                height: 50%;
                cursor: move;
                user-select: none;
                z-index: 1000;
            }

            #waifu-tips.waifu-tips-active {
                display: block;
            }
        </style>
        `);

        // 添加新的API Key获取函数
        // 在src/index.js文件顶部添加这个函数
        // 在文件顶部添加全局变量存储API密钥
        let globalApiKey = '';
        
        // 添加API密钥更新监听
        window.addEventListener('message', async (event) => {
        if (event.data.type === 'UPDATE_API_KEY') {
        globalApiKey = event.data.apiKey;
        console.log('API密钥已更新');
        
        // 如果需要在更新后立即重新初始化某些功能，可以在这里调用
        // 例如重新初始化语音识别或聊天功能
        } else if (event.data.type === 'REQUEST_API_KEY') {
            // 响应API密钥请求
            if (!globalApiKey) {
            globalApiKey = await getApiKey();
            }
            window.postMessage({
            type: 'API_KEY_RESPONSE',
            apiKey: globalApiKey
            }, '*');
            }
        });
        
        // 修改原有的getApiKey函数，使其优先使用全局变量
        async function getApiKey() {
            if (globalApiKey) {
                return globalApiKey;
            }
            
            return new Promise((resolve) => {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.get(['savedApiKey'], (result) => {
                    globalApiKey = result.savedApiKey || '';
                    resolve(globalApiKey);
                    });
                } else {
                    resolve('');
                }
            });
        }
        
        // 确保所有使用API密钥的地方都使用getApiKey()函数
        // 例如在需要API密钥的地方：
        // const apiKey = await getApiKey();
        // 添加拖動功能
        const waifuElement = document.getElementById('waifu');
        let isDragging = false;
        let offsetX, offsetY;

        waifuElement.addEventListener('mousedown', (e) => {
            if (e.target === waifuElement) {
                isDragging = true;
                offsetX = e.clientX - waifuElement.getBoundingClientRect().left;
                offsetY = e.clientY - waifuElement.getBoundingClientRect().top;
                waifuElement.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                waifuElement.style.left = (e.clientX - offsetX) + 'px';
                waifuElement.style.top = (e.clientY - offsetY) + 'px';
                waifuElement.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            waifuElement.style.cursor = 'move';
        });

        // 顯示初始提示
        setTimeout(() => {
            const tips = document.getElementById('waifu-tips');
            tips.classList.add('waifu-tips-active');
            setTimeout(() => {
                showMessage(`主人可以長按開始對話哦~<br>首次使用請點擊信息圖標設置API密鑰`, 4000);
            }, 1000);
            tips.classList.remove('waifu-tips-active');
        }, 1000);

        // 添加錄音功能到人物
        let mediaRecorder;
        let audioChunks = [];
        let chunks = [];

        waifuElement.addEventListener('mousedown', startRecording);
        waifuElement.addEventListener('mouseup', stopRecording);

        async function startRecording() {
            const tips = document.getElementById('waifu-tips');
            tips.innerHTML = "正在錄音...";
            tips.classList.add('waifu-tips-active');
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };
                mediaRecorder.start();
            } catch (err) {
                console.error('錄音錯誤:', err);
                tips.innerHTML = "錄音失敗，請重試";
            }
        }

        function stopRecording() {
            const tips = document.getElementById('waifu-tips');
            tips.classList.remove('waifu-tips-active');
            
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunks = [];
                    
                    // 使用保存的API KEY
                    const apiKey = localStorage.getItem('siliconflow_api_key') || 'YOUR_API_KEY';
                    
                    // 後續API調用代碼保持不變...
                    // 调用语音转文本API
                    const formData = new FormData();
                    formData.append('file', audioBlob, 'recording.wav');
                    formData.append('model', 'FunAudioLLM/SenseVoiceSmall');

                    let canvas = document.createElement('canvas');
                    let currentSnapshot = null;

                    // 确保视频元素已加载并有数据

                    if (video.readyState >= video.HAVE_CURRENT_DATA) {

                        const canvas = document.createElement('canvas');

                        canvas.width = video.videoWidth;

                        canvas.height = video.videoHeight;

                        const ctx = canvas.getContext('2d');

                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        currentSnapshot = canvas.toDataURL('image/jpeg');

                    } else {

                        console.warn('视频元素未准备好，无法捕获图像。');

                    }

                    // 调试预览
                    if(currentSnapshot) {
                        const debugImg = document.createElement('img');
                        debugImg.src = currentSnapshot;
                        debugImg.style.position = 'fixed';
                        debugImg.style.right = '20px';
                        debugImg.style.bottom = '100px';
                        debugImg.style.width = '200px';
                        debugImg.style.border = '2px solid red';
                        document.body.appendChild(debugImg);
                        setTimeout(() => debugImg.remove(), 5000);
                    }
                    
                    try {
                        // 第一步：语音转文本
                        const savedApiKey = await getApiKey();
                        const transcribeResponse = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + savedApiKey
                            },
                            body: formData
                        });
                        
                        const transcription = await transcribeResponse.json();

                        const videoBlob = new Blob(chunks, { type: 'audio/webm' });
                        chunks = [];

                        mediaRecorder.addEventListener('start', () => {
                        const ctx = canvas.getContext('2d');
                        
                        // 确保视频流正确绑定到canvas
                        const videoElement = document.createElement('video');
                        videoElement.srcObject = stream;
                        videoElement.autoplay = true;
                        videoElement.muted = true;
                        videoElement.style.position = 'fixed';
                        videoElement.style.bottom = '0';
                        videoElement.style.left = '0';
                        videoElement.style.width = '100%';
                        videoElement.style.height = '100%';
                        videoElement.style.objectFit = 'cover';
                        
                        // 使用requestAnimationFrame确保渲染完成
                        let currentSnapshot = null;
                        function captureFrame() {
                            if (videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
                                const canvas = document.createElement('canvas');
                                canvas.width = videoElement.videoWidth;
                                canvas.height = videoElement.videoHeight;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                                currentSnapshot = canvas.toDataURL('image/jpeg');
                            } else {
                                requestAnimationFrame(captureFrame);
                            }
                        }
                        requestAnimationFrame(captureFrame);
                    });

                        // 确保至少包含文本内容
                        const multimodalContent = currentSnapshot ? [
                            {
                                type: "image_url",
                                image_url: { url: currentSnapshot }
                            },
                            {
                                type: "text",
                                text: transcription.text + ''
                            }
                        ] : [
                            {
                                type: "text",
                                text: transcription.text + ''
                            }
                        ];
                        
                        // 第二步：发送给对话模型
                        const chatResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + savedApiKey
                            },
                            body: JSON.stringify({
                                model: 'THUDM/GLM-4.1V-9B-Thinking',
                                // model: 'Qwen/Qwen3-8B',
                                
                                messages: [
                                    { role: 'user', content: multimodalContent }
                                    // { role: 'user', content: transcription.text }
                                ],
                                stream: false
                            })
                        });
                        
                        const result = await chatResponse.json();
                        
                        // 验证响应结构
                        if (!result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
                            throw new Error('Invalid API response structure');
                        }
                        
                        const responseText = result.choices[0].message.content;

                    
                        
                        // 在人物对话框显示结果
                        const tips = document.getElementById('waifu-tips');
                        tips.innerHTML = responseText;
                        tips.classList.add('waifu-tips-active');
                        
                        // 语音播报结果
                        const speechResponse = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + savedApiKey
                            },
                            body: JSON.stringify({
                                model: 'FunAudioLLM/CosyVoice2-0.5B',
                                input: result.choices[0].message.content,
                                voice: 'FunAudioLLM/CosyVoice2-0.5B:diana',
                                response_format: 'mp3'
                            })
                        });
                        
                        const audioBlob = await speechResponse.blob();
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        audio.play();
                    } catch (err) {
                        console.error('API调用错误:', err);
                    }
                };
            }
        }

    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    setTimeout(() => {
        document.getElementById("waifu").style.bottom = "20px";
    }, 0);

    // (function registerTools() {
    //     // tools["switch-model"].callback = () => model.loadOtherModel();
    //     // tools["switch-texture"].callback = () => model.loadRandModel();
    //     if (!Array.isArray(config.tools)) {
    //         config.tools = Object.keys(tools);
    //     }
    //     for (let tool of config.tools) {
    //         if (tools[tool]) {
    //             const { icon, callback } = tools[tool];
    //             document.getElementById("waifu-tool").insertAdjacentHTML("beforeend", `<span id="waifu-tool-${tool}">${icon}</span>`);
    //             document.getElementById(`waifu-tool-${tool}`).addEventListener("click", callback);
    //         }
    //     }
    // })();

    function welcomeMessage(time) {
        if (location.pathname === "/") { // 如果是主页
            for (let { hour, text } of time) {
                const now = new Date(),
                    after = hour.split("-")[0],
                    before = hour.split("-")[1] || after;
                if (after <= now.getHours() && now.getHours() <= before) {
                    return text;
                }
            }
        }
        const text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
        let from;
        if (document.referrer !== "") {
            const referrer = new URL(document.referrer),
                domain = referrer.hostname.split(".")[1];
            const domains = {
                "baidu": "百度",
                "so": "360搜索",
                "google": "谷歌搜索"
            };
            if (location.hostname === referrer.hostname) return text;

            if (domain in domains) from = domains[domain];
            else from = referrer.hostname;
            return `Hello！来自 <span>${from}</span> 的朋友<br>${text}`;
        }
        return text;
    }

    function registerEventListener(result) {
        // 检测用户活动状态，并在空闲时显示消息
        let userAction = false,
            userActionTimer,
            messageArray = result.message.default,
            lastHoverElement;
        window.addEventListener("mousemove", () => userAction = true);
        window.addEventListener("keydown", () => userAction = true);

        setInterval(() => {
            if (userAction) {
                userAction = false;
                clearInterval(userActionTimer);
                userActionTimer = null;
            } else if (!userActionTimer) {
                userActionTimer = setInterval(() => {
                    showResponseToUser(null, 10000);
                }, 20);
            }
        }, 10);

        result.seasons.forEach(({ date, text }) => {
            const now = new Date(),
                after = date.split("-")[0],
                before = date.split("-")[1] || after;
            if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                text = randomSelection(text);
                text = text.replace("{year}", now.getFullYear());
                messageArray.push(text);
            }
        });

    }

    (function initModel() {
        let modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (modelId === null) {
            // 首次访问加载 指定模型 的 指定材质
            modelId = 1; // 模型 ID
            modelTexturesId = 53; // 材质 ID
        }
        model.loadModel(modelId, modelTexturesId);
        // fetch(config.waifuPath)
        //     .then(response => response.json())
        //     .then(registerEventListener);
    })();
}

function initWidget(config, apiPath) {
    if (typeof config === "string") {
        config = {
            waifuPath: config,
            apiPath
        };
    }
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
            <span>看板娘</span>
        </div>`);
    const toggle = document.getElementById("waifu-toggle");
    toggle.addEventListener("click", () => {
        toggle.classList.remove("waifu-toggle-active");
        if (toggle.getAttribute("first-time")) {
            loadWidget(config);
            toggle.removeAttribute("first-time");
        } else {
            localStorage.removeItem("waifu-display");
            document.getElementById("waifu").style.display = "";
            setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0;
            }, 0);
        }
    });
    if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
        toggle.setAttribute("first-time", true);
        setTimeout(() => {
            toggle.classList.add("waifu-toggle-active");
        }, 0);
    } else {
        loadWidget(config);
    }
    // const form = document.getElementById('myform');
    // form.addEventListener('submit', event => {
    //     event.preventDefault(); // 防止表单提交
    //     const inputMsg = document.getElementById('input-msg');
    //     const msg = inputMsg.value;
    //     inputMsg.value = '';
    //     console.log("user msg: " + msg);
    //     showResponseToUser(msg, 4000);
    // });

//     const waifu = document.getElementById("waifu");
//     let isDragging = false;
//     let startX;
//     let startY;
//     let originalX;
//     let originalY;

//     function getTransformValues() {
//         const transform = window.getComputedStyle(waifu).transform;
//         if (transform === 'none') return { x: 0, y: 0 };
        
//         const matrix = new DOMMatrix(transform);
//         return {
//             x: matrix.m41,
//             y: matrix.m42
//         };
//     }

//     function dragStart(e) {
//         if (e.target === waifu || waifu.contains(e.target)) {
//             isDragging = true;
//             const { x, y } = getTransformValues();
//             originalX = x;
//             originalY = y;
//             startX = e.clientX;
//             startY = e.clientY;
            
//             // 添加临时事件监听
//             document.addEventListener('mousemove', drag);
//             document.addEventListener('mouseup', dragEnd);
//         }
//     }

//     function drag(e) {
//         if (!isDragging) return;
        
//         const deltaX = e.clientX - startX;
//         const deltaY = e.clientY - startY;
        
//         const newX = originalX + deltaX;
//         const newY = originalY + deltaY;
        
//         waifu.style.transform = `translate(${newX}px, ${newY}px)`;
//     }

//     function dragEnd() {
//         isDragging = false;
        
//         // 移除临时事件监听
//         document.removeEventListener('mousemove', drag);
//         document.removeEventListener('mouseup', dragEnd);
//     }

//     // 只在waifu元素上监听mousedown
//     waifu.addEventListener('mousedown', dragStart);

}

export default initWidget;




