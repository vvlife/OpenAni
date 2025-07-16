// 悬浮聊天窗口
class FloatingChat {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createButton();
        this.createChatWindow();
    }

    createButton() {
        const button = document.createElement('div');
        button.id = 'floating-chat-button';
        button.innerHTML = '💬';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #ff6b6b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            this.toggleChat();
        });

        document.body.appendChild(button);
    }

    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'floating-chat-window';
        chatWindow.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 300px;
            height: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            z-index: 10002;
            font-family: Arial, sans-serif;
        `;

        // 聊天头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px;
            background: #ff6b6b;
            color: white;
            border-radius: 10px 10px 0 0;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>Live2D助手</span>
            <span style="cursor: pointer; font-size: 20px;" onclick="window.floatingChat.close()">×</span>
        `;

        // 聊天内容区域
        const content = document.createElement('div');
        content.id = 'chat-content';
        content.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f8f9fa;
        `;

        // 输入区域
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
            gap: 10px;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入消息...';
        input.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        `;

        const sendButton = document.createElement('button');
        sendButton.textContent = '发送';
        sendButton.style.cssText = `
            padding: 8px 16px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: background 0.3s;
        `;

        sendButton.addEventListener('click', () => {
            this.sendMessage(input.value);
            input.value = '';
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage(input.value);
                input.value = '';
            }
        });

        inputArea.appendChild(input);
        inputArea.appendChild(sendButton);

        chatWindow.appendChild(header);
        chatWindow.appendChild(content);
        chatWindow.appendChild(inputArea);

        document.body.appendChild(chatWindow);
    }

    toggleChat() {
        const chatWindow = document.getElementById('floating-chat-window');
        const button = document.getElementById('floating-chat-button');
        
        if (this.isOpen) {
            chatWindow.style.display = 'none';
            button.style.transform = 'scale(1)';
        } else {
            chatWindow.style.display = 'flex';
            button.style.transform = 'scale(0.9)';
        }
        this.isOpen = !this.isOpen;
    }

    close() {
        const chatWindow = document.getElementById('floating-chat-window');
        const button = document.getElementById('floating-chat-button');
        chatWindow.style.display = 'none';
        button.style.transform = 'scale(1)';
        this.isOpen = false;
    }

    sendMessage(message) {
        if (!message.trim()) return;

        const content = document.getElementById('chat-content');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 10px;
            padding: 8px 12px;
            background: #e3f2fd;
            border-radius: 15px;
            max-width: 80%;
            word-wrap: break-word;
            margin-left: auto;
        `;
        messageDiv.textContent = message;
        content.appendChild(messageDiv);

        // 自动滚动到底部
        content.scrollTop = content.scrollHeight;

        // 模拟回复
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.style.cssText = `
                margin-bottom: 10px;
                padding: 8px 12px;
                background: #f5f5f5;
                border-radius: 15px;
                max-width: 80%;
                word-wrap: break-word;
            `;
            replyDiv.textContent = '收到消息: ' + message;
            content.appendChild(replyDiv);
            content.scrollTop = content.scrollHeight;
        }, 1000);
    }
}

// 初始化悬浮聊天
window.floatingChat = new FloatingChat();