// fs 文件操作模块
const fs = require("fs");
// path 路径操作模块
const path = require("path");
// express
const express = require("express");

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
        fileArr.push({
          file: {
            name: file,
            thisUrl: file,
            parent: directory,
            date: new Date().toLocaleString()
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
          res.render("file", {
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
            app.get(url, function(req, res) {
              res.writeHeader(200, {
                "content-type": 'text/html;charset="utf-8"'
              });
              res.write(data); //将index.html显示在客户端
              res.end();
            });
            fileArr.push({
              file: {
                name: file,
                thisUrl: file,
                parent: directory,
                date: new Date().toLocaleString()
              }
            });
            // 主页
            app.get("/", function(req, res) {
              res.render("file", { files: fileArr, indexUrl: ["/"] });
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

// 运行主程序
// main();

app.listen(port, host, function() {
  console.log(`Server at ${host}:${port}`);
});

module.exports = {
  start:main()
}