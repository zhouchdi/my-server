// fs 文件操作模块
const fs = require("fs");
// path 路径操作模块
const path = require("path");
// express
const express = require("express");
// opn模块, 自动打开浏览器
const opn = require('opn');

const app = express();
let port = "1994";
let host = "127.0.0.1";

// 代码文件夹
let code = __dirname + "/codes";
// 文件数组
let fileArr = [];
// 静态文件
app.use(express.static("public"));
// 设置模板引擎
app.set("view engine", "ejs");

// 读取所有的文件
function listFiles(path, directory) {
  fs.readdir(path, function(err, files) {
    // 表示深入了一层
    if (err) {
      return console.error(err);
    }

    // 读取所有文件
    files.forEach(function(file) {
      let states = fs.statSync(path + "/" + file);
      // 判断是否是文件夹，是继续读取其中的文件，不是输出
      if (states.isDirectory()) {
        // 自调
        listFiles(path + "/" + file, file);
        // 文件夹信息
        fileArr.push({
          file: {
            name: file, // 当前文件夹
            thisUrl: file, // 当前文件夹地址
            parent: directory, // 父文件夹
            icon: "icon-open", // 文件夹图标
            date: new Date().toLocaleString() // 创建时间
          }
        });

        // 截取url
        let url = subUrl(path + "/" + file);

        app.get(url, function(req, res) {
          let sectionUrlArr = [];
          // url 分段
          getUrlSection(sectionUrlArr, url);
          // 重新排序
          sectionUrlArr.reverse();
          res.render("folder", {
            files: fileArr,
            indexUrl: sectionUrlArr
          });
        });
      } else {
        fs.readFile(path + "/" + file, function(err, data) {
          if (err) {
            console.dir(err);
          } else {
            // 截取url
            let url = subUrl(path + "/" + file);
            let HTML = file.substr(file.indexOf(".") + 1);
            // 打开的html
            if (HTML == "html" || HTML == "htm") {
              app.get(url, function(req, res) {
                res.sendFile(__dirname + `/codes${url}`);
              });
            } else {
              app.get(url, function(req, res) {
                res.render("show-content", {
                  data: data.toString(),
                  filename: file
                }); //将index.html显示在客户端
                res.end();
              });
            }
            // 文件信息
            fileArr.push({
              file: {
                name: file,
                thisUrl: file,
                parent: directory,
                icon: getIcon(file.substr(file.indexOf("."))),
                date: new Date().toLocaleString()
              }
            });
            // 主页
            app.get("/", function(req, res) {
              res.render("folder", { files: fileArr, indexUrl: ["/"] });
            });
          }
        });
      }
    });
  });
}

// main
async function main() {
  try {
    // 读取文件列表
    await listFiles(code, "/");
  } catch (error) {
    console.log(error);
  }
}

// 截取地址组成url地址
function subUrl(path) {
  let thisPath = path;
  let reg = /D:\\codes\\codes\\node_demos\\my-server\/codes/g;
  let url = thisPath.replace(reg, "");

  return url;
}

// 获取url数组
function getUrlSection(arr, url) {
  function smallSection(arr, url) {
    let index = url.lastIndexOf("/");
    arr.push(url.substr(index + 1));

    url = url.substr(0, index);
    if (url.length) {
      smallSection(arr, url);
    }
  }

  smallSection(arr, url);
}

// 图标显示
function getIcon(iconName) {
  let Icon = "";
  switch (iconName) {
    case ".js":
      return (Icon = "icon-js");
      break;
    case ".css":
      return (Icon = "icon-css");
      break;
    case ".html":
      return (Icon = "icon-html");
      break;
    case ".png":
      return (Icon = "icon-png");
      break;
    case ".jpg":
      return (Icon = "icon-jpg");
      break;
    case ".gif":
      return (Icon = "icon-gif");
      break;
    case ".ppt":
      return (Icon = "icon-ppt");
      break;
    case ".pdf":
      return (Icon = "icon-pdf");
      break;
    case ".zip":
      return (Icon = "icon-zip");
      break;
    case ".log":
      return (Icon = "icon-log");
      break;
    case ".php":
      return (Icon = "icon-php");
      break;
    case ".doc":
      return (Icon = "icon-doc");
      break;
    case ".mp3":
      return (Icon = "icon-mp3");
      break;
    case ".wav":
      return (Icon = "icon-wav");
      break;
    case ".json":
      return (Icon = "icon-paper");
      break;
    case ".md":
      return (Icon = "icon-notes");
      break;
    default:
      return (Icon = "icon-code");
      break;
  }
}

// 监听
app.listen(port, host, function() {
  let consoleUrl = 'http://' + host + ':' + port;
  console.log(`Serving ${__dirname + '/codes'} at ${consoleUrl}`);
  // 打开consoleUrl
  opn(consoleUrl);
});

// 运行主程序
// main();

module.exports = {
  start: main()
};
