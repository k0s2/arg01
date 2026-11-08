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

// わざと0.5秒ウェイト
await new Promise(resolve => setTimeout(resolve, 500));

// ロード完了
document.querySelector("#area-main>p").classList.add("is-hidden");
document.querySelector("#area-main>section").classList.remove("is-hidden");