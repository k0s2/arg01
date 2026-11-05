// ダイアログ
import { initDialog } from "./templates/dialog/controler.js";
initDialog();

// ワードコレクト
import { initWordCollect } from "./templates/collect-list/controler.js";
initWordCollect();

/**
 * HTMLテンプレートを読み込む
 * @param {string} htmlPath HTMLファイルのパス
 * @param {string} cssPath CSSファイルのパス
 * @param {string} containerSelector 挿入先のセレクター
 * @returns {Promise<HTMLElement | null>}
 */
export async function loadTemplate(baseUrl, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return null;

    try {
        const htmlUrl = new URL("./index.html", baseUrl);
        const cssUrl = new URL("./style.css", baseUrl);

        const response = await fetch(htmlUrl);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // CSSを読み込む
        if (!document.querySelector(`link[href="${cssUrl.href}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssUrl.href;
            document.head.appendChild(link);
        }

        // HTMLを描画
        container.innerHTML = await response.text();

        return container;

    } catch (error) {
        console.error("テンプレートの読み込みに失敗しました。", error);
        return null;
    }
}