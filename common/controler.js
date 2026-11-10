// ====================================================================================================
// インポート
// ====================================================================================================

// キーワードリスト
import { initWordCollect } from "./template/word-list/controler.js";

// メール通知
import { showMailNotice as mailNoticeShowMailNotice } from "./template/mail-notice/controler.js";

// ====================================================================================================
// 共通メソッド
// ====================================================================================================

/**
 * メール通知
 */
export function showMailNotice() {
    mailNoticeShowMailNotice();
}

/**
 * 新着メールバッジの更新
 */
export function updateMailBadge() {
    const target = document.getElementById("buttonMail");

    if (!target) {
        return;
    }

    // 受信メールを取得
    const mails = JSON.parse(localStorage.getItem("mail-receive") || "[]");

    // 既読情報を取得
    const status = JSON.parse(localStorage.getItem("mail-status") || "{}");

    // 未読メールがあるか
    const hasNewMail = mails.some(id => status[id]?.readed == false);

    // バッジ表示
    target.classList.toggle("has-new-mail", hasNewMail);
}

/**
 * ボタン表示
 * @param {Boolean} anime アニメーションするか
 */
export function showButton(selector, anime) {
    // 対象を取得
    const targetToggleButton = document.getElementById(selector);

    // アニメーション
    if (anime) {
        targetToggleButton.classList.add("is-slide-in");
    }

    // ボタンを表示
    targetToggleButton.classList.add("is-show");
}

/**
 * HTMLテンプレートを読み込む
 * @param {string} htmlPath HTMLファイルのパス
 * @param {string} cssPath CSSファイルのパス
 * @param {string} containerSelector 挿入先のセレクター
 * @returns {Promise<HTMLElement | null>}
 */
export async function loadTemplate(baseUrl, containerSelector = null) {
    // 読み込み先を取得
    let container = document.querySelector(containerSelector);

    // ダイアログ（読み込み先が指定されていない）の場合、bodyに要素を追加
    if (!container) {
        // 要素を生成
        const addTemplate = document.createElement("div");
        addTemplate.id = "addElement"

        // 要素をbodyに追加
        document.body.appendChild(addTemplate)

        // 読み込み先として指定
        container = addTemplate;
    }

    try {
        // CSSを取得して設定
        const cssUrl = new URL("./style.css", baseUrl);
        if (!document.querySelector(`link[href="${cssUrl.href}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssUrl.href;
            document.head.appendChild(link);
        }

        // HTMLを取得して設定
        const htmlUrl = new URL("./index.html", baseUrl);
        const response = await fetch(htmlUrl);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        container.innerHTML = await response.text();

        return container;

    } catch (error) {
        console.error("テンプレートの読み込みに失敗しました。", error);
        return null;
    }
}

/**
 * 「メール」解放
 * @param {Boolean} first 初回
 */
export function releaseMail(first = false) {
    // ローカルストレージ操作
    const target = "releaseMail";
    if (!localStorage.getItem(target)) {
        localStorage.setItem(target, true);
    }

    // 表示
    showButton("buttonMail", first);

    // クリックイベント
    document.getElementById("buttonMail").addEventListener("click", () => {
        location.href = new URL("../../a-mail/list/#receive", location.href).href
    });
}

/**
 * 「掲示板」解放
 * @param {Boolean} first 初回
 */
export function releaseBulletin(first = false) {
    // ローカルストレージ操作
    const target = "releaseBulletin";
    if (!localStorage.getItem(target)) {
        localStorage.setItem(target, true);
    }

    // 表示
    showButton("buttonBulletin", first);

    // クリックイベント
    document.getElementById("buttonBulletin").addEventListener("click", () => {
        location.href = new URL("../../urban-legend-observatory/lobby/", location.href).href
    });
}

/**
 * 「キーワード」解放
 */
export function releaseKeyword() {
    // ローカルストレージに保存
    localStorage.setItem("releaseKeyword", true);

    // 表示アニメーション
    showButton("buttonKeyword", true);
}

// ====================================================================================================
// 初期化
// ====================================================================================================

// --------------------------------------------------
// リサイズ時のトランジション防止
// --------------------------------------------------

let resizeTimer;

window.addEventListener("resize", () => {

    document.body.classList.add("is-resizing");

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("is-resizing");
    }, 150);

});

// --------------------------------------------------
// フッターボタン
// --------------------------------------------------

// メール
if (localStorage.getItem("releaseMail") == "true") {
    releaseMail();
}

// 新着メールバッジ
updateMailBadge();

// 掲示板
if (localStorage.getItem("releaseBulletin") == "true") {
    releaseBulletin();
}

// キーワード
if (localStorage.getItem("releaseKeyword") == "true") {
    // ボタンを表示
    showButton("buttonKeyword");
}

// --------------------------------------------------
// キーワードリスト
// --------------------------------------------------

// 初期化
initWordCollect();