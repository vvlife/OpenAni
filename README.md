# OpenAni

看到Grok4的AI伙伴功能，感觉不错，但是很多人用安卓或者没有会员用不到，于是想自己实现一个，项目有几个特点：
- 基于Live2D实现
- 免費API，通过语音交互
- 不需要后端，作为浏览器插件导入即可使用
- 视频通话功能（免费API过于慢了，目前已屏蔽，想用的可以自己搜一下startCamera去掉注释再编译即可)

![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-html.svg)
![](https://forthebadge.com/images/badges/made-with-javascript.svg)
![](https://forthebadge.com/images/badges/contains-cat-gifs.svg)
![](https://forthebadge.com/images/badges/powered-by-electricity.svg)
![](https://forthebadge.com/images/badges/makes-people-smile.svg)

## 特性

通过瀏覽器访问OpenAni，对接了AI語音聊天功能，長按人物出現正在錄音（第一次需要授權）即可聊天。

由於免費API不是端到端，所以需要三個請求才能語音聊天，需要一些反應時間，請耐心等待

（注：以上人物模型仅供展示之用，本仓库并不包含任何模型。）

关于Live2D，你也可以查看示例网页（不支持AI聊天）：
- [demo.html](https://stevenjoezhang.github.io/live2d-widget/demo/demo.html)，展现基础功能
- [login.html](https://stevenjoezhang.github.io/live2d-widget/demo/login.html)，仿 NPM 的登陆界面

### 使用
- 打开 Chrome 浏览器，进入 chrome://extensions/
- 开启右上角的"开发者模式"
- 点击"加载已解压的扩展程序"，选择项目文件夹
- 扩展安装完成，可以在任何网页看到OpenAni的图标
- 点击图标，设置API密钥
- 即可在任何网页使用OpenAni

這裏需要指定siliconflow的API密鑰,否則無法使用AI聊天功能,使用的模型都是免費模型
如果沒有siliconflow的API密鑰,可以申請一個,送14元的邀請地址: https://cloud.siliconflow.cn/i/OybsmjxB


## 鸣谢

live2d-widget: 可交互式Live2D网页看板娘插件
ollama: 使用大型语言模型开始您的旅程

## 更多

二次开发编译命令：
```
npm install
npm run build
```

更多内容可以参考：  
https://www.dongaigc.com/p/stevenjoezhang/live2d-widget
https://ollama.org.cn

## 许可证

Released under the GNU General Public License v3  
http://www.gnu.org/licenses/gpl-3.0.html

本仓库并不包含任何模型，用作展示的所有 Live2D 模型、图片、动作数据等版权均属于其原作者，仅供研究学习，不得用于商业用途。

Live2D 官方网站：  
https://www.live2d.com/en/  
https://live2d.github.io

Live2D Cubism Core は Live2D Proprietary Software License で提供しています。  
https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html  
Live2D Cubism Components は Live2D Open Software License で提供しています。  
http://www.live2d.com/eula/live2d-open-software-license-agreement_en.html

> The terms and conditions do prohibit modification, but obfuscating in `live2d.min.js` would not be considered illegal modification.

https://community.live2d.com/discussion/140/webgl-developer-licence-and-javascript-question
