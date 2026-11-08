// ====================================================================================================
// インポート
// ====================================================================================================

// メール情報
import { getMails } from "../data/mail.js";

// ====================================================================================================
// 初期化
// ====================================================================================================

// カテゴリー（URLから取得）
const currentCategory = location.hash.slice(1);

// 要素取得
const targetList = document.querySelector("#area-main #list");

// --------------------------------------------------
// メール情報を取得
// --------------------------------------------------

let mails = [];

switch (currentCategory) {
    // --------------------------------------------------
    // ●受信ボックス
    // --------------------------------------------------
    case "receive":

        // ローカルストレージから受信ボックスを取得
        mails = localStorage.getItem("mail-receive");

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

        break;

    // --------------------------------------------------
    // ●送信ボックス
    // --------------------------------------------------
    case "send":

        // ローカルストレージから送信ボックスを取得
        mails = localStorage.getItem("mail-send");

        // 配列として取得
        mails = JSON.parse(mails);

        break;

    // --------------------------------------------------
    // ●お気に入り
    // --------------------------------------------------
    case "favorite":

        // ローカルストレージから受信ボックスを取得
        mails = localStorage.getItem("mail-receive");

        // ローカルストレージからお気に入り情報を取得
        const favorites = JSON.parse(
            localStorage.getItem("mail-favorite") || "[]"
        );

        // 配列として取得
        mails = JSON.parse(mails);

        // お気に入りを抽出
        mails = mails.filter(mail => favorites.includes(mail.id));

        break;

    // --------------------------------------------------
    // ●それ以外
    // --------------------------------------------------
    default:

}

// --------------------------------------------------
// メールヘッダー
// --------------------------------------------------

// 受信者／送信者
document.querySelector(".mailRow.header > .user").textContent = (currentCategory == "send") ? "受信者" : "送信者";

// --------------------------------------------------
// メールデータを展開
// --------------------------------------------------

console.dir(mails);

mails.forEach((data) => {

    // 親要素を生成
    const elementParent = document.createElement("li");
    elementParent.classList.add("mailRow");

    // 新着メール
    if (!data.readed) {
        elementParent.classList.add("new");
    }

    // お気に入り
    const elementStar = document.createElement("div");
    elementStar.classList.add("star");
    elementStar.favoriteId = data.id;
    elementStar.innerHTML = "★";
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