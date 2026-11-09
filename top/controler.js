// ====================================================================================================
// インポート
// ====================================================================================================

// 共通
import { showButton } from "../common/controler.js";

// ダイアログ
import { showDialog, showAlert } from "../common/template/dialog/controler.js";

// ====================================================================================================
// イベントを設定
// ====================================================================================================

/**
 * ボタン表示：キーワード（解放なし）
 * @param {Boolean} anime アニメーションするか
 */
export function showButtonKeyword(anime = false) {
    showButton("buttonWord", anime);
}

// ====================================================================================================
// イベントを設定
// ====================================================================================================

// --------------------------------------------------
// 「進行状況をリセットする」ボタン
// --------------------------------------------------

// クリックイベントを付与
const buttonReset = document.getElementById("button-reset");
buttonReset.addEventListener("click", async function () {

    // ダイアログ表示
    const result = await showAlert("進行状況をリセットしてもいいですか？");

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
        location.href = new URL("../urban-legend-observatory/lobby/", location.href).href

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

            // キーワードリストボタン表示（一時的）
            showButtonKeyword(true);

        });

    });

    // --------------------------------------------------
    // 入力欄
    // --------------------------------------------------

    // クリックイベントを付与
    targetInput.addEventListener("click", async function () {

        // キーワードリストボタン表示（一時的）
        showButtonKeyword(true);

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
