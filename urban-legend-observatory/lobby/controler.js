// ====================================================================================================
// インポート
// ====================================================================================================

import threadList from "../data/thread.js";

// ====================================================================================================
// 初期化
// ====================================================================================================

const section = document.querySelector("#area-main section");
const targetList = section.querySelector("ul");

// --------------------------------------------------
// スレッド一覧
// --------------------------------------------------

targetList.innerHTML = "";

threadList.forEach(thread => {
    const li = document.createElement("li");

    const button = document.createElement("button");

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = thread.title;

    const count = document.createElement("div");
    count.className = "responceCount";
    count.textContent = thread.responseCount ?? thread.threads.length;

    button.append(title, count);

    button.addEventListener("click", () => {
        location.href = `../thread/?id=${thread.id}`;
    });

    li.appendChild(button);
    targetList.appendChild(li);
});