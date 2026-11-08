// ====================================================================================================
// インポート
// ====================================================================================================

// ダイアログ
import { showDialog, showMindDialog } from "../../common/template/dialog/controler.js";

// メール情報
import { getMails } from "../data/mail.js";

// 返信情報
import { getReplyData } from "../data/reply.js";

// ====================================================================================================
// 詳細
// ====================================================================================================

// 要素取得
const targetDetail = document.querySelector("#area-main #detail");

// 表示中のメールID（URLから取得）
const currentId = location.hash.slice(1);;

// --------------------------------------------------
// メール情報を取得
// --------------------------------------------------

// ローカルストレージを取得
let mails = localStorage.getItem("mail-receive");
mails = JSON.parse(mails);

// --------------------------------------------------
// 「一覧へ戻る」ボタン
// --------------------------------------------------

// イベント設定
targetDetail.querySelector(".detailHeader button#button-return").addEventListener("click", () => {

    // メール一覧ページへ遷移
    window.location.href = new URL("../list/#receive", location.href).href;

});

// --------------------------------------------------
// 「返信する」ボタン
// --------------------------------------------------

// イベント設定
targetDetail.querySelector("#button-reply").addEventListener("click", async () => {

    // 返信情報を取得
    const reply = getReplyData(currentId);

    // ●文字化けメール
    if (reply == undefined) {
        showDialog("退会済みユーザーには返信できません。");
    }
    // ●選択肢あり
    else if (reply.length > 1) {
        // 返信情報を取得
        let reply = getReplyData(currentId);

        // 返信済み選択肢は除外
        reply = reply.filter(item => !mails.some(mail => mail.id === item.mailId));

        // 選択ダイアログを表示
        const result = await showMindDialog(
            "なんと返そうか？",
            "返信する",
            reply.map(item => item.text),
        );

        // ●選択された場合
        if (result >= 0) {
            // 返信メールを取得
            const newMail = getMails([reply[result].mailId])[0];

            if (newMail) {
                // 新着メールとして追加
                mails.unshift({
                    ...newMail,
                    new: true,
                });

                // ローカルストレージに保存
                localStorage.setItem("mail-receive", JSON.stringify(mails));

                // ページのリロード
                location.reload();
            }
        }
    }
    // ●それ以外
    else {
        showMindDialog("返信の必要は無いな。");
    }

});

// ====================================================================================================
// 初期化
// ====================================================================================================

// 新着件数
let countNew = 0;
mails.forEach((data) => {
    // 新着メール
    if (!data.readed) {
        countNew++;
    }
});

// メール情報を取得
const data = mails.filter(mail => mail.id == currentId)[0];

// 送信者
targetDetail.querySelector("#mailInfo .user").innerHTML = data.user;

// 件名
targetDetail.querySelector("#mailInfo .title").innerHTML = data.title;

// 受信日時
targetDetail.querySelector("#mailInfo .date").innerHTML = data.date;

// 本文
targetDetail.querySelector(".message").innerHTML = data.message;

// 既読にする
if (!data.readed) {
    // フラグをON
    data.readed = true;

    // メールデータを保存
    localStorage.setItem("mail-receive", JSON.stringify(mails));

    // 新着件数を再計算
    countNew = mails.filter(mail => mail.new).length;
}

// --------------------------------------------------
// 新着件数を表示
// --------------------------------------------------

const targetNew = document.querySelector("#button-receive .count");

targetNew.textContent = countNew || "";
targetNew.classList.toggle("new", countNew >= 1);