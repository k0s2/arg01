// ====================================================================================================
// インポート
// ====================================================================================================

// ダイアログ
import { showDialog } from "../common/templates/dialog/controler.js";

// ====================================================================================================
// イベントを設定
// ====================================================================================================

/**
 * キーワードリスト開閉ボタンを表示
 */
function showListButton() {
    // 対象を取得
    const targetToggleButton = document.getElementById("buttonWord");

    // 非表示クラスを除去
    targetToggleButton.classList.remove("is-hidden");
}

// --------------------------------------------------
// 「進行状況をリセットする」ボタン
// --------------------------------------------------

// クリックイベントを付与
const buttonReset = document.getElementById("button-reset");
buttonReset.addEventListener("click", async function () {

    // ダイアログ表示
    const result = await showDialog(
        "進行状況をリセットしてもいいですか？",
        "確認",
        ["はい", "いいえ"]
    );

    // ●「はい」
    if (result === 0) {
        // ローカルストレージを全削除
        localStorage.clear();

        // リセットフラグを設定
        sessionStorage.setItem("resetCompleted", true);

        // ページのリロード
        location.reload();
    }

});

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

    } else if (inputStart.textContent == "") {
        // ダイアログ表示
        showDialog("キーワードを入力してください。");
    } else {
        // ダイアログ表示
        showDialog("キーワードが違います。");
    }

});

// ====================================================================================================
// 初期化
// ====================================================================================================

// ゲーム開始用キーワード
const startWord = "調査を開始";

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
    targetInput.textContent = startWord;

}

// --------------------------------------------------
// リセット表示
// --------------------------------------------------

if (sessionStorage.getItem("resetCompleted") === "true") {
    // フラグを削除
    sessionStorage.removeItem("resetCompleted");

    // ダイアログ表示
    showDialog("進捗状況をリセットしました。");
}
