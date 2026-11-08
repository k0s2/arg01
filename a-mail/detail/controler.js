// ====================================================================================================
// インポート
// ====================================================================================================

// ダイアログ
import { showDialog, showMindDialog } from "../../common/template/dialog/controler.js";

// メール情報
import { getMails } from "../data/mail.js";

// 返信情報
import { getReplyData } from "../data/reply.js";

// メール共通
import { initFavorite, addBoxMail, setMailRead, getMailStatus } from "../controler.js";

// ====================================================================================================
// 準備
// ====================================================================================================

// 要素取得
const targetDetail = document.querySelector("#area-main #detail");

// 表示中のメールID（URLから取得）
const currentId = location.hash.slice(1);;

// ====================================================================================================
// イベント設定
// ====================================================================================================

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
    let reply = getReplyData(currentId);

    // ●文字化けメール
    if (reply == undefined) {
        showDialog("退会済みユーザーには返信できません。");
    }
    // ●選択肢あり
    else {
        // 返信済み選択肢は除外
        reply = reply.filter(item => !mails.some(mail => mail.id == item.mailId));

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
                addBoxMail("receive", newMail);

                // メール一覧ページへ遷移
                window.location.href = new URL("../../a-mail/list/#receive", location.href).href;
            }
        }
        // ●それ以外
        else {
            showMindDialog("返信の必要は無いな。");
        }
    }

});

// ====================================================================================================
// 初期化
// ====================================================================================================

// メール情報を取得
const data = getMails(currentId)[0];

// お気に入り
const star = targetDetail.querySelector("#mailInfo .star");
star.setAttribute("favoriteId", data.id);

// 送信者
targetDetail.querySelector("#mailInfo .user").innerHTML = data.user;

// 件名
targetDetail.querySelector("#mailInfo .title").innerHTML = data.title;

// 受信日時
targetDetail.querySelector("#mailInfo .date").innerHTML = getMailStatus(data.id).date;

// 本文
targetDetail.querySelector(".message>p").innerHTML = data.message;

// 既読情報の登録
setMailRead(data.id);

// 共通初期化処理
initFavorite();