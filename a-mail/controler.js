// ====================================================================================================
// インポート
// ====================================================================================================

// ダイアログ
import { showDialog, showMindDialog } from "../common/template/dialog/controler.js";

// メール情報
import { getMails } from "./data/mail.js";

// 返信情報
import { getReplyGroup } from "./data/reply.js";

// ====================================================================================================
// 準備
// ====================================================================================================

// 一覧
const targetList = document.querySelector("#area-main #list");

// 詳細
const targetDetail = document.querySelector("#area-main #detail");

// ====================================================================================================
// 一覧
// ====================================================================================================

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

mails.forEach((data, index) => {

    // 親要素を生成
    const elementParent = document.createElement("li");
    elementParent.classList.add("mailRow");

    // 新着メール
    if (data.new) {
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
        openMail(index);
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

// ====================================================================================================
// 詳細
// ====================================================================================================

// 表示中のメール
let currentMail = null;

/**
 * メールを開く
 * @param {Number} index メールのインデックス（連番）
 */
function openMail(index) {
    // メール情報を取得
    const data = mails[index];
    currentMail = data;

    // 送信者
    targetDetail.querySelector("#mailInfo .user").innerHTML = data.user;

    // 件名
    targetDetail.querySelector("#mailInfo .title").innerHTML = data.title;

    // 受信日時
    targetDetail.querySelector("#mailInfo .date").innerHTML = data.date;

    // 本文
    targetDetail.querySelector(".message").innerHTML = data.message;

    // 既読にする
    if (data.new) {
        delete data.new;

        // メールデータを保存
        localStorage.setItem("mail-receive", JSON.stringify(mails));

        // 新着件数を再計算
        countNew = mails.filter(mail => mail.new).length;

        targetNew.textContent = countNew || "";
        targetNew.classList.toggle("new", countNew >= 1);
    }

    // 画面切り替え
    targetList.classList.add("is-hidden");
    targetDetail.classList.remove("is-hidden");

}

// --------------------------------------------------
// 「一覧へ戻る」ボタン
// --------------------------------------------------

// イベント設定
targetDetail.querySelector(".detailHeader button#button-return").addEventListener("click", () => {

    // 詳細を非表示
    targetDetail.classList.add("is-hidden");

    // 一覧を表示
    targetList.classList.remove("is-hidden");

});

// --------------------------------------------------
// 「返信する」ボタン
// --------------------------------------------------

// イベント設定
targetDetail.querySelector("#button-reply").addEventListener("click", async () => {

    // 返信情報を取得
    const reply = getReplyChoice(currentMail?.id);

    // ●選択肢
    if (reply.length > 1) {
        // 選択ダイアログを表示
        const result = await showMindDialog(
            "なんと返そうか？",
            "返信する",
            reply,
        );

        //
    }
    // ●閉じるのみ
    else if (reply.length == 0) {
        showDialog("退会済みユーザーには返信できません。");
    }
    // ●それ以外
    else {
        showMindDialog(
            "返信の必要は無いな。"
        );
    }

});

// ====================================================================================================
// 受信ボックス
// ====================================================================================================

// イベント設定
document.querySelector("#button-receive").addEventListener("click", () => {

    // TODO:

    // // 「受信ボックス」を選択
    // document.querySelector("#button-receive").classList.add("is-active");

    // // それ以外を選択解除
    // document.querySelectorAll("#sideBar .buttons li").forEach(element => {
    //     element.classList.remove("is-active");
    // });

    // // 詳細を非表示
    // targetDetail.classList.add("is-hidden");

    // // 一覧を表示
    // targetList.classList.remove("is-hidden");

});

// ====================================================================================================
// 送信ボックス
// ====================================================================================================

// TODO:

// ====================================================================================================
// 表示
// ====================================================================================================

// わざと1秒ウェイト
await new Promise(resolve => setTimeout(resolve, 1000));

// ロード完了
document.querySelector("#area-main>p").classList.add("is-hidden");
document.querySelector("#area-main>section").classList.remove("is-hidden");