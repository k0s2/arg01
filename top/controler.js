// ====================================================================================================
// ファンクション
// ====================================================================================================

/**
 * ゲームのリセット
 */
function listReset() {

    // ダイアログ表示
    showDialog("テスト");

    // ローカルストレージを全削除
    localStorage.clear();

    // ページのリロード
    location.reload();
}

// ====================================================================================================
// イベントを設定
// ====================================================================================================

// ゲーム開始用キーワード
const startWord = "調査を開始";

/**
 * キーワードリスト開閉ボタンを表示
 */
function showListButton() {
    // 対象を取得
    const targetToggleButton = document.getElementById("buttonWord");

    // 非表示クラスを除去
    targetToggleButton.classList.remove("is-hidden");
}

// 入力欄
const targetInput = document.getElementById("input-start");

// ●初回
if (!localStorage.getItem("gameStart")) {

    // --------------------------------------------------
    // キーワード
    // --------------------------------------------------

    // 各キーワード要素に適用
    const targetsKeyword = document.querySelectorAll(".keyword");
    targetsKeyword.forEach(target => {

        // クリックイベントを付与
        target.addEventListener("click", async function () {

            // キーワードリスト開閉ボタンを表示
            showListButton();

        });

    });

    // --------------------------------------------------
    // 入力欄
    // --------------------------------------------------

    // クリックイベントを付与
    targetInput.addEventListener("click", async function () {

        // キーワードリスト開閉ボタンを表示
        showListButton();

    });

}
// ●それ以外
else {

    // --------------------------------------------------
    // 入力欄
    // --------------------------------------------------

    // ゲーム開始用キーワードを設定
    targetInput.value = startWord;

}

// --------------------------------------------------
// 「決定」ボタン
// --------------------------------------------------

// クリックイベントを付与
const buttonDecide = document.getElementById("button-start");
buttonDecide.addEventListener("click", function () {

    // ●ゲーム開始用キーワードが入力されている場合
    const inputStart = document.getElementById("input-start");
    if (inputStart.textContent == startWord) {

        // ゲーム開始フラグをON
        localStorage.setItem("gameStart", true);

        // メールページへ遷移
        window.location.href = new URL("../a-mail/", location.href).href;

    }

});
