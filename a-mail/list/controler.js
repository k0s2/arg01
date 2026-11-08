// ====================================================================================================
// インポート
// ====================================================================================================

// メール共通
import { initFavorite, getBoxMails, addBoxMail, getMailStatus } from "../controler.js";

// ====================================================================================================
// 初期化
// ====================================================================================================

// カテゴリー（URLから取得）
const currentCategory = location.hash.slice(1);

// 送信ボックスか
const isSend = (currentCategory == "send");

// 要素取得
const targetList = document.querySelector("#area-main #list");

// --------------------------------------------------
// メール情報を取得
// --------------------------------------------------

let mails = [];

// メール情報を取得
mails = getBoxMails(currentCategory);

// ●初回（受信メール情報が無い場合）
if (
    currentCategory == "receive"
    && mails.length == 0
) {
    // メール情報を生成
    addBoxMail(currentCategory, "003", true, "1900/01/01");
    addBoxMail(currentCategory, "002", true, "1900/01/01");
    addBoxMail(currentCategory, "001", true, "1900/01/01");
    addBoxMail(currentCategory, "100");

    // メール情報を取得
    mails = getBoxMails(currentCategory);
}

// --------------------------------------------------
// メールヘッダー
// --------------------------------------------------

// 受信者／送信者
document.querySelector(".mailRow.header > .user").textContent = (isSend) ? "受信者" : "送信者";

// --------------------------------------------------
// メールデータを展開
// --------------------------------------------------

mails.forEach((data) => {

    // 親要素を生成
    const elementParent = document.createElement("li");
    elementParent.classList.add("mailRow");

    // 新着メール
    if (
        currentCategory != "send"
        && getMailStatus(data.id).readed == false
    ) {
        elementParent.classList.add("new");
    }

    // お気に入り
    const elementStar = document.createElement("div");
    elementStar.classList.add("star");
    if (!isSend) {
        elementStar.innerHTML = "★";
        elementStar.setAttribute("favoriteId", data.id);
    }
    elementParent.appendChild(elementStar);

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
    elementDate.innerHTML = getMailStatus(data.id).date;
    elementParent.appendChild(elementDate);

    // クリックイベント
    elementParent.addEventListener("click", () => {
        // メール詳細ページへ遷移
        window.location.href = new URL("../detail/#" + data.id, location.href).href;
    });

    // メール一覧に追加
    targetList.querySelector("ul").appendChild(elementParent);

});

// 共通初期化処理
initFavorite();