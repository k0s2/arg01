// ====================================================================================================
// インポート
// ====================================================================================================

// メール情報
import { getMails } from "../data/mail.js";

// ====================================================================================================
// 一覧
// ====================================================================================================

// 要素取得
const targetList = document.querySelector("#area-main #list");

// --------------------------------------------------
// メール情報を取得
// --------------------------------------------------

// ローカルストレージを取得
let mails = localStorage.getItem("mail-receive");

// ●初回（メール情報が無い場合）
if (mails == null) {
    // メール情報を生成
    mails = getMails([
        "100",
        "001",
        "002",
        "003",
    ]);

    // ローカルストレージに保存
    localStorage.setItem("mail-receive", JSON.stringify(mails));
}
// ●それ以外
else {
    // 配列として取得
    mails = JSON.parse(mails);
}

// --------------------------------------------------
// メールデータを展開
// --------------------------------------------------

// 新着件数
let countNew = 0;

mails.forEach((data) => {

    // 親要素を生成
    const elementParent = document.createElement("li");
    elementParent.classList.add("mailRow");

    // 新着メール
    if (!data.readed) {
        elementParent.classList.add("new");
        countNew++;
    }

    // 送信者
    const elementUser = document.createElement("div");
    elementUser.classList.add("user");
    elementUser.innerHTML = data.user;
    elementParent.appendChild(elementUser);

    // 件名
    const elementTitle = document.createElement("div");
    elementTitle.classList.add("title");
    elementTitle.innerHTML = data.title;
    elementParent.appendChild(elementTitle);

    // 受信日時
    const elementDate = document.createElement("div");
    elementDate.classList.add("date");
    elementDate.innerHTML = data.date;
    elementParent.appendChild(elementDate);

    // クリックイベント
    elementParent.addEventListener("click", () => {
        // メール詳細ページへ遷移
        window.location.href = new URL("../detail/#" + data.id, location.href).href;
    });

    // メール一覧に追加
    targetList.querySelector("ul").appendChild(elementParent);

});

// --------------------------------------------------
// 新着件数を表示
// --------------------------------------------------

const targetNew = document.querySelector("#button-receive .count");

targetNew.textContent = countNew || "";
targetNew.classList.toggle("new", countNew >= 1);