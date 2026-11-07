// テンプレート読み込みモジュール
import { loadTemplate } from "../../controler.js";

/**
 * ダイアログを表示
 * @param {String} message 確認文章
 * @param {String} title 見出し（省略可）
 */
export async function showDialog(message, title = "", buttons = null) {
    return new Promise(async (resolve) => {

        // --------------------------------------------------
        // テンプレート読み込み
        // --------------------------------------------------

        let resultContainer = await loadTemplate(
            import.meta.url,
            null
        );

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

        // ●設定値あり
        if (buttons) {
            // ボタン配置位置を取得
            const targetButtons = resultContainer.querySelector(".buttons");

            buttons.forEach((text, index) => {
                // ボタンを追加
                const button = document.createElement("button");
                button.textContent = text;
                button.addEventListener("click", () => {
                    // ダイアログを閉じる
                    resultContainer.remove();
                    resolve(index);
                });
                targetButtons.appendChild(button);
            });

        }
        // ●設定値なし
        else {
            // 「閉じる」ボタンを追加
            const button = document.createElement("button");
            button.textContent = "閉じる";
            button.addEventListener("click", () => {
                // ダイアログを閉じる
                resultContainer.remove();
                resolve(-1);
            });
            resultContainer.querySelector(".buttons").appendChild(button);
        }

        // --------------------------------------------------
        // 枠外をクリックで閉じる
        // --------------------------------------------------

        const targetBackCover = resultContainer.querySelector("#dialog");
        targetBackCover.addEventListener("click", (event) => {

            // 子要素クリックで発火しないようにする
            if (event.target === event.currentTarget) {
                // ダイアログを閉じる
                resultContainer.remove();
                resolve(-1);
            }

        });

        // --------------------------------------------------
        // トランジション
        // --------------------------------------------------

        resultContainer.querySelector("#dialog").classList.remove("is-closed");

    });

}