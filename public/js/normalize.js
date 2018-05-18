// 用于搜索当前网页是否有该信息
function getSearch() {
  // 搜索条件
  let currentSearchInfor = document.getElementById("search").value;

  // li
  let lis = document.querySelectorAll(".wrapper>ul>li");
  for (let i = 0; i < lis.length; i++) {
    // 文件、文档名
    let aText = lis[i].querySelector("a").innerText.toLocaleLowerCase();

    // 判断搜索条件是否为空
    if (currentSearchInfor == "" || /^\s+/.test(currentSearchInfor)) {
      if (lis[i].getAttribute("class")) {
        lis[i].setAttribute("class", "");
      }
    } else {
      // 搜索条件不为空
      if (aText.indexOf(currentSearchInfor) > 0) {
        lis[i].setAttribute("class", "highlight");
      } else {
        if (lis[i].getAttribute("class")) {
          lis[i].setAttribute("class", "");
        }
      }
    }
  }
}
