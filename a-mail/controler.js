// ====================================================================================================
// インポート
// ====================================================================================================

// ダイアログ
import { showDialog, showMindDialog } from "../common/template/dialog/controler.js";

// ====================================================================================================
// 準備
// ====================================================================================================

// 一覧
const targetList = document.querySelector("#area-main #mail > ul#list");

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

// FIXME:
// ●初回（メール情報が無い場合）
// if (mails == null) {
if (true) {
    // 現在日時を取得(yyyy/mm/dd)
    const date = new Date();
    const today = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    // メール情報を生成
    mails = [
        {
            "user": "J.Smith",
            "title": "怪異調査依頼",
            "message":
                "突然の連絡、すまない。\n"
                + "お前の調査能力を見込んで頼みがある。\n"
                + "\n"
                + "掲示板で騒がれている連続怪奇事件の裏には、俺たちが「怪異」と呼んでいる人外の存在が関わっている。\n"
                + "奴らは超常の力を用いて、人間を脅かし、時には命さえも奪う。\n"
                + "\n"
                + "お前には掲示板で情報を集め、それらをデータベースと照らし合わせ、事件を引き起こした怪異を特定してもらいたい。\n"
                + "\n"
                + "このメールを無視してくれてもいい。\n"
                + "……でも、お前は「面白いことが好き」だろ？\n"
                + "返信待ってるぞ。",
            "date": today,
            "new": true,
            "replyAction": "reply_1"
        },
        {
            user: '<span class="c-gray">（退会済みユーザー）</span>',
            title: "縺雁燕縺ｯ閭ｽ蜉帙ｒ遉ｺ縺励◆",
            message: '<span class="c-gray">（本文はありません）</span>',
            date: "1900/01/01",
        },
        {
            user: '<span class="c-gray">（退会済みユーザー）</span>',
            title: "蟆代＠縺ｯ蠖ｹ縺ｫ遶九▽繧医≧縺�縺ｪ縲�",
            message: '<span class="c-gray">（本文はありません）</span>',
            date: "1900/01/01",
        },
        {
            user: '<span class="c-gray">（退会済みユーザー）</span>',
            title: "螟ｱ譛帙＆縺帙ｉ繧後◆繧�",
            message: '<span class="c-gray">（本文はありません）</span>',
            date: "1900/01/01",
        },
    ];

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
    targetList.appendChild(elementParent);

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

// FIXME:
// 返信ファンクション
const replyActions = {

    // 怪異調査依頼
    async reply_1() {
        // ダイアログを表示
        const result = await showMindDialog(
            "なんと返そうか？",
            "返信する",
            [
                "分かった。やってみる。",
                "お前は誰だ？",
                "意味不明なメールはお前の仕業か？",
            ]
        );

        // 選択肢により分岐
        switch (result) {
            // 「分かった。やってみる。」
            case 0:
                break;

            // 「誰だお前は？」
            case 1:
                break;

            // 「意味不明なメールもお前の仕業か？」
            case 2:
                break;

            // キャンセル
            default:
        }
    },

};

// イベント設定
targetDetail.querySelector("#button-reply").addEventListener("click", async () => {

    // 設定された返信ファンクションを呼び出し
    const action = replyActions[currentMail?.replyAction];
    if (action) {
        await action();
    } else {
        showDialog("退会済みユーザーには返信できません。")
    }

});

// ====================================================================================================
// 受信ボックス
// ====================================================================================================

// イベント設定
document.querySelector("#button-receive").addEventListener("click", () => {

    // 「受信ボックス」を選択
    document.querySelector("#button-receive").classList.add("is-active");

    // それ以外を選択解除
    document.querySelectorAll("#sideBar .buttons li").forEach(element => {
        element.classList.remove("is-active");
    });

    // 詳細を非表示
    targetDetail.classList.add("is-hidden");

    // 一覧を表示
    targetList.classList.remove("is-hidden");

});

// ====================================================================================================
// 送信ボックス
// ====================================================================================================

// TODO: