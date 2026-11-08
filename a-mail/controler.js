// ====================================================================================================
// 初期化
// ====================================================================================================

// ローカルストレージからメール情報を取得
let mails = localStorage.getItem("mail-receive");
mails = JSON.parse(mails);

// --------------------------------------------------
// サイドバー
// --------------------------------------------------

// 一旦全てアクティブ解除
document.querySelectorAll("#sideBar .buttons li").forEach(element => {
    element.classList.remove("is-active");
});

// カテゴリー（URLから取得）
const currentCategory = location.hash.slice(1);

// 対象カテゴリーをアクティブ
document.querySelector("#button-" + currentCategory)?.classList.add("is-active");

// --------------------------------------------------
// 新着件数を表示
// --------------------------------------------------

// 件数を取得
const countNew = mails.filter(mail => !mail.readed).length;

// 描画
const targetNew = document.querySelector("#button-receive .count");
targetNew.textContent = countNew || "";
targetNew.classList.toggle("new", countNew >= 1);

// --------------------------------------------------
// ロード表示
// --------------------------------------------------

// ウェイト
await new Promise(resolve => setTimeout(resolve, 250));

// ロード完了
document.querySelector("#area-main>p").classList.add("is-hidden");
document.querySelector("#area-main>section").classList.remove("is-hidden");

// ====================================================================================================
// イベント設定
// ====================================================================================================

// --------------------------------------------------
// 受信ボックス
// --------------------------------------------------

document.querySelector("#button-receive:not(.is-active)")?.addEventListener("click", () => {

    // 「受信ボックス」ページへ遷移
    window.location.href = new URL("../list/#receive", location.href).href;

    // ページのリロード
    location.reload();

});

// --------------------------------------------------
// 送信ボックス
// --------------------------------------------------

document.querySelector("#button-send:not(.is-active)")?.addEventListener("click", () => {

    // 「送信ボックス」ページへ遷移
    window.location.href = new URL("../list/#send", location.href).href;

    // ページのリロード
    location.reload();

});

// --------------------------------------------------
// お気に入り
// --------------------------------------------------

document.querySelector("#button-favorite:not(.is-active)")?.addEventListener("click", () => {

    // 「お気に入り」ページへ遷移
    window.location.href = new URL("../list/#favorite", location.href).href;

    // ページのリロード
    location.reload();

});

// --------------------------------------------------
// お気に入り
// --------------------------------------------------

// ローカルストレージから取得
let favorites = JSON.parse(
    localStorage.getItem("mail-favorite") || "[]"
);

// 「★」を取得
const targetsFavorite = document.querySelectorAll(".mailRow:not(.header) > .star");
targetsFavorite.forEach(target => {

    // お気に入り済みか
    if (favorites.includes(target.favoriteId)) {
        target.classList.add("is-favorite");
    }

    // クリックイベントを設定
    target.addEventListener("click", (event) => {

        // 詳細遷移イベントを発火しないようにする
        event.stopPropagation();

        // ●お気に入り済み
        if (favorites.includes(target.favoriteId)) {
            // 削除
            favorites = favorites.filter(item => item !== target.favoriteId);

            // クラス除去
            target.classList.remove("is-favorite");
        }
        // ●それ以外の場合
        else {
            // 追加
            favorites.push(target.favoriteId);

            // クラス付与
            target.classList.add("is-favorite");
        }

        // ローカルストレージに反映
        localStorage.setItem("mail-favorite", JSON.stringify(favorites));

    });

});
