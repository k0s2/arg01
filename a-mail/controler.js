import { showDialog, showMindDialog } from "../common/template/dialog/controler.js";

// 現在日時
const date = new Date();
const today = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

// メールデータ
let mails = localStorage.getItem("mail");

// ●初回
// if (mails == null) {
if (true) {

    mails = [
        {
            user: "J.Smith",
            title: "怪異調査依頼",
            message: `突然の連絡、すまない。
お前の調査能力を見込んで頼みがある。

掲示板で騒がれている連続怪奇事件の裏には、俺たちが「怪異」と呼んでいる人外の存在が関わっている。
奴らは超常の力を用いて、人間を脅かし、時には命さえも奪う。

お前には掲示板で情報を集め、それらをデータベースと照らし合わせ、事件を引き起こした怪異を特定してもらいたい。
調査結果はレポートページにまとめてくれ。

それと、調査のサポート用ソフトウェアを用意している。
以下のリンクをクリックしてインストールしてくれ。
<button id="button-install">FUGURUMA SYSTEM</button>

このメールを無視してくれてもいい。
……でも、お前は「面白いことが好き」だろ？

報酬は弾むぞ。検討を祈る。`,
            date: today,
            new: true,
            replyAction: "reply_1",
        },
        {
            user: "退会済みユーザー",
            title: "縺雁燕縺ｯ閭ｽ蜉帙ｒ遉ｺ縺励◆",
            message: "（本文はありません）",
            date: "1900/01/01",
        },
        {
            user: "退会済みユーザー",
            title: "蟆代＠縺ｯ蠖ｹ縺ｫ遶九▽繧医≧縺�縺ｪ縲�",
            message: "（本文はありません）",
            date: "1900/01/01",
        },
        {
            user: "退会済みユーザー",
            title: "螟ｱ譛帙＆縺帙ｉ繧後◆繧�",
            message: "（本文はありません）",
            date: "1900/01/01",
        },
    ];

    // メールデータを保存
    localStorage.setItem("mail", JSON.stringify(mails));

}
// ●それ以外
else {
    // JSONから復元
    mails = JSON.parse(mails);
}

// --------------------------------------------------
// 要素を取得
// --------------------------------------------------

const targetList = document.querySelector("#area-main #mail > ul#list");
const targetDetail = document.querySelector("#area-main #detail");

// --------------------------------------------------
// メール一覧を生成
// --------------------------------------------------

// 新着件数
let countNew = 0;

// メールデータを展開
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
    elementUser.textContent = data.user;
    elementParent.appendChild(elementUser);

    // 件名
    const elementTitle = document.createElement("div");
    elementTitle.classList.add("title");
    elementTitle.textContent = data.title;
    elementParent.appendChild(elementTitle);

    // 受信日時
    const elementDate = document.createElement("div");
    elementDate.classList.add("date");
    elementDate.textContent = data.date;
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

// --------------------------------------------------
// 返信処理
// --------------------------------------------------

const replyActions = {

    // 怪異調査依頼
    async reply_1() {
        // ダイアログを表示
        const result = await showMindDialog(
            "なんと返そうか？",
            "返信する",
            [
                "分かった。やってみる。",
                "誰だお前は？",
                "意味不明なメールもお前の仕業か？",
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

// --------------------------------------------------
// メール詳細
// --------------------------------------------------

// 戻るボタン
const buttonBack = targetDetail.querySelector(".detailHeader button#button-return");
buttonBack.addEventListener("click", () => {

    // 詳細を非表示
    targetDetail.classList.add("is-hidden");

    // 一覧を表示
    targetList.classList.remove("is-hidden");

});

// 返信ボタン
const buttonReply = targetDetail.querySelector("#button-reply");
let currentMail = null;
buttonReply.addEventListener("click", async () => {

    // 設定された返信ファンクションを呼び出し
    const action = replyActions[currentMail?.replyAction];
    if (action) {
        await action();
    } else {
        showDialog("退会済みユーザーには返信できません。")
    }

});

/**
 * メールを開く
 * @param {Number} index メールのインデックス（連番）
 */
function openMail(index) {
    // メール情報を取得
    const data = mails[index];
    currentMail = data;

    // 送信者
    targetDetail.querySelector("#mailInfo .user").textContent = data.user;

    // 件名
    targetDetail.querySelector("#mailInfo .title").textContent = data.title;

    // 受信日時
    targetDetail.querySelector("#mailInfo .date").textContent = data.date;

    // 本文
    targetDetail.querySelector(".message").innerHTML = data.message;

    // 既読にする
    if (data.new) {
        delete data.new;

        // メールデータを保存
        localStorage.setItem("mail", JSON.stringify(mails));

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
// 受信ボックス
// --------------------------------------------------

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