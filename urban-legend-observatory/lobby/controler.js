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

    // --------------------------------------------------
    // タイトル
    // --------------------------------------------------

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = thread.title;

    // --------------------------------------------------
    // レス数
    // --------------------------------------------------

    let countThreads = 0;
    thread.comment.forEach(item => {

        // 一致
        if (item.match) {
            if (!localStorage.getItem(item.match)) {
                return;
            }
        }

        // 不一致
        if (item.not) {
            if (localStorage.getItem(item.not)) {
                return;
            }
        }

        countThreads++;
    })

    const count = document.createElement("div");
    count.className = "responceCount";
    count.textContent = countThreads

    // --------------------------------------------------
    // 描画
    // --------------------------------------------------

    button.append(title, count);

    button.addEventListener("click", () => {
        location.href = `../thread/?id=${thread.id}`;
    });

    li.appendChild(button);
    targetList.appendChild(li);
});