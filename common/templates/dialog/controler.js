// テンプレート読み込みモジュール
import { loadTemplate } from "../../controler.js";

/**
 * ダイアログを表示
 * @param {String} message 確認文章
 * @param {String} title 見出し（省略可）
 */
export async function showDialog(message, title = "") {
    // テンプレート読み込み
    let resultContainer = await loadTemplate(
        import.meta.url,
        null
    );

    // 内容を設定
    const h1 = resultContainer.querySelector("h1");
    const p = resultContainer.querySelector("p");

    h1.textContent = title;
    p.textContent = message;

    // 閉じるボタン
    resultContainer.querySelector("button").addEventListener("click", () => {
        section.remove();
    });

    // 表示
    document.body.appendChild(resultContainer);

}