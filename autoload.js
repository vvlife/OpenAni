// 移除路径计算，直接使用相对路径
const live2d_path = "";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;

        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

// // 加载本地扩展文件
// if (screen.width >= 375) {
//     Promise.all([
//         loadExternalResource("waifu.css", "css"),
//         loadExternalResource("live2d.min.js", "js"),
//         loadExternalResource("waifu-tips.js", "js")
//     ]).then(() => {
//         // 配置选项的具体用法见 README.md
//         initWidget({
//             waifuPath: "waifu-tips.json",
//             //apiPath: "https://live2d.fghrsh.net/api/",
//             cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
//             tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
//         });
//     }).catch((error) => {
//         console.error('Live2D资源加载失败:', error);
//     });
// }

initWidget({
            waifuPath: "waifu-tips.json",
            //apiPath: "https://live2d.fghrsh.net/api/",
            cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
            tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
        });

console.log(`
  く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
`);
