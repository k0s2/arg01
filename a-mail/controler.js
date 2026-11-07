// 現在日時
const date = new Date();
const today = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

// メールデータ
let mails = localStorage.getItem("mail");

// ●初回
if (mails === null) {

    mails = [
        {
            user: "D",
            title: "怪異調査依頼",
            message: "",
            date: today,
            new: true,
        },
        {
            user: "退会済みユーザー",
            title: "縺雁燕縺ｯ閭ｽ蜉帙ｒ遉ｺ縺励◆",
            message: "",
            date: "1900/01/01",
        },
        {
            user: "退会済みユーザー",
            title: "蟆代＠縺ｯ蠖ｹ縺ｫ遶九▽繧医≧縺�縺ｪ縲�",
            message: "",
            date: "1900/01/01",
        },
        {
            user: "退会済みユーザー",
            title: "螟ｱ譛帙＆縺帙ｉ繧後◆繧�",
            message: "",
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
// メール一覧を生成
// --------------------------------------------------

// 新着件数
let countNew = 0;

// メール一覧を取得
const target = document.querySelector("#mail > ul#list");

// メールデータを展開
mails.forEach(data => {

    // 親要素を生成
    const elementParent = document.createElement("li");

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
        document.querySelector("#list").classList.add("is-hidden");
        document.querySelector("#detail").classList.remove("is-hidden");
    });

    // メール一覧に追加
    target.appendChild(elementParent);

});

if (countNew >= 1) {
    const targetNew = document.querySelector("#button-receive .count");
    targetNew.textContent = countNew;
    targetNew.classList.add("new");
}