// ====================================================================================================
// インポート
// ====================================================================================================

import threadList from "../data/thread.js";

// ====================================================================================================
// 初期化
// ====================================================================================================

const section = document.querySelector("#area-main section");
const threadId = new URLSearchParams(location.search).get("id");
const thread = threadList.find(item => item.id === threadId);

// --------------------------------------------------
// スレッド表示
// --------------------------------------------------

if (thread) {
    // タイトル
    section.querySelector("h1").textContent = thread.title;

    // レス一覧
    const targetList = section.querySelector("ul");
    targetList.innerHTML = "";

    thread.threads.forEach((item, index) => {
        // 空のレスは表示しない
        if (!item.text.trim()) {
            return;
        }

        const li = document.createElement("li");

        // レス番号
        const threadNo = document.createElement("p");
        threadNo.className = "threadNo";
        threadNo.textContent = String(index + 1).padStart(4, "0");

        // 本文
        const text = document.createElement("p");
        text.innerHTML = item.text;

        // 投稿者名
        const userName = document.createElement("p");
        userName.className = "userName";
        userName.textContent = item.user || "ななし";

        li.append(threadNo, text, userName);
        targetList.appendChild(li);
    });

} else {
    section.querySelector("h1").textContent = "スレッドが見つかりません";
    section.querySelector("ul").remove();
}