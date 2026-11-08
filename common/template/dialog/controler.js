// テンプレート読み込みモジュール
import { loadTemplate } from "../../controler.js";

// ダイアログ要素
let resultContainer = null;

/**
 * ダイアログを閉じる
 */
function hideDialog() {
    // ダイアログを取得
    const target = resultContainer.querySelector("#dialog");

    // トランジション終了イベント
    const onTransitionEnd = (event) => {
        // ダイアログ自身のopacity以外は無視
        if (event.target !== target || event.propertyName !== "opacity") {
            return;
        }

        // イベントリスナーを解除
        target.removeEventListener("transitionend", onTransitionEnd);

        // ダイアログ要素を削除
        resultContainer.remove();
    };
    target.addEventListener("transitionend", onTransitionEnd);

    // 非表示クラスを付与
    target.classList.add("is-hidden");
}

/**
 * ダイアログを表示
 * @param {String} message 確認文章
 * @param {String} title 見出し（省略可）
 */
export async function showDialog(message, title = "", buttons = null, modeMind = false) {
    return new Promise(async (resolve) => {

        // --------------------------------------------------
        // テンプレート
        // --------------------------------------------------

        // 読み込み
        resultContainer = await loadTemplate(
            import.meta.url,
            null
        );

        // --------------------------------------------------
        // モード
        // --------------------------------------------------

        if (modeMind) {
            // ラッパーを取得
            const targetBack = resultContainer.querySelector("#dialog");

            // モード切替
            targetBack.classList.add("mode-mind");
        }

        // --------------------------------------------------
        // 見出しを設定
        // --------------------------------------------------

        // 対象を取得
        const h1 = resultContainer.querySelector("h1");

        // ●設定値あり
        if (title) {
            // 文字列を設定
            h1.textContent = title;
        }
        // ●設定値なし
        else {
            // 要素を削除
            h1.remove();
        }

        // --------------------------------------------------
        // 内容を設定
        // --------------------------------------------------

        // 対象を取得
        const p = resultContainer.querySelector("p");

        // ●設定値あり
        if (message) {
            // 文字列を設定
            p.textContent = message;
        }
        // ●設定値なし
        else {
            // 要素を削除
            p.remove();
        }

        // --------------------------------------------------
        // 閉じるボタン
        // --------------------------------------------------

        // ●設定値なし
        if (!buttons) {
            // 「閉じる」ボタンのみにする
            buttons = ["閉じる"];
        }

        // ボタン配置位置を取得
        const targetButtons = resultContainer.querySelector(".buttons");

        // 設定値ごとに処理
        buttons.forEach((text, index) => {
            // ボタンを生成
            const button = document.createElement("button");
            button.textContent = text;

            // クリックイベントを追加
            button.addEventListener("click", () => {
                // ダイアログを閉じる
                hideDialog();

                // 選択インデックスを渡す
                resolve(index);
            });

            // ボタンエリアに追加
            targetButtons.appendChild(button);
        });

        // --------------------------------------------------
        // 枠外をクリックで閉じる
        // --------------------------------------------------

        const targetBackCover = resultContainer.querySelector("#dialog");
        targetBackCover.addEventListener("click", (event) => {

            // 子要素クリックで発火しないようにする
            if (event.target === event.currentTarget) {
                // ダイアログを閉じる
                hideDialog();

                // 選択インデックスを渡す
                resolve(-1);
            }

        });

        // --------------------------------------------------
        // トランジション
        // --------------------------------------------------

        // 描画を待つ
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // 非表示クラスを除去
                const target = resultContainer.querySelector("#dialog");
                target.classList.remove("is-hidden");
            });
        });

    });

}

/**
 * ダイアログ（精神モード）を表示
 * @param {String} message 確認文章
 * @param {String} title 見出し（省略可）
 */
export async function showMindDialog(message, title = "", buttons = null) {
    // 精神モードで、既存のダイアログ表示処理を呼び出し
    showDialog(message, title, buttons, true);
}