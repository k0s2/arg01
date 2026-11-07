const date = new Date();
const today = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

let mails = localStorage.getItem("mail");

if (!mails) {

    mails.push({
        user: "退会済みユーザー",
        title: "螟ｱ譛帙＆縺帙ｉ繧後◆繧�",
        message: "",
        date: "1900/01/01",
    })

    mails.push({
        user: "退会済みユーザー",
        title: "蟆代＠縺ｯ蠖ｹ縺ｫ遶九▽繧医≧縺�縺ｪ縲�",
        message: "",
        date: "1900/01/01",
    })

    mails.push({
        user: "退会済みユーザー",
        title: "縺雁燕縺ｯ閭ｽ蜉帙ｒ遉ｺ縺励◆",
        message: "",
        date: "1900/01/01",
    })

    mails.push({
        user: "D",
        title: "怪異調査依頼",
        message: "",
        date: today,
        new: true,
    })

    localStorage.setItem("mail", mails);

}

const target = document.querySelector("#mailDetail>mails");

mails.forEach(data => {
    let elementParent = document.createElement("li");

    let elementUser = document.createElement("div");
    elementUser.textContent = data.user;
    elementParent.appendChild(elementUser);

    let elementTitle = document.createElement("div");
    elementTitle.textContent = data.title;
    elementParent.appendChild(elementTitle);

    let elementDate = document.createElement("div");
    elementDate.textContent = data.date;
    elementParent.appendChild(elementDate);

    target.appendChild(element);
});