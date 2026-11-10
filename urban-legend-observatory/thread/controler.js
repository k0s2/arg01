// ====================================================================================================
// インポート
// ====================================================================================================

// データ
import threadList from "../data/thread.js";

// 共通
import { releaseKeyword } from "../../common/controler.js";

// ====================================================================================================
// 共通メソッド
// ====================================================================================================

// 要素が読み込まれるまで待機
function waitForElement(selector) {
    return new Promise(resolve => {
        const target = document.querySelector(selector);

        if (target) {
            resolve(target);
            return;
        }

        const observer = new MutationObserver(() => {
            const target = document.querySelector(selector);

            if (target) {
                observer.disconnect();
                resolve(target);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

// アニメーション終了まで待機
function waitAnimation(target, animationName) {
    return new Promise(resolve => {
        function onAnimationEnd(event) {
            if (event.target !== target || event.animationName !== animationName) {
                return;
            }

            target.removeEventListener("animationend", onAnimationEnd);
            resolve();
        }

        target.addEventListener("animationend", onAnimationEnd);
    });
}

// ====================================================================================================
// 初期化
// ====================================================================================================

const section = document.querySelector("#area-main section");
const threadId = new URLSearchParams(location.search).get("id");
const thread = threadList.find(item => item.id === threadId);

// --------------------------------------------------
// スレッド表示
// --------------------------------------------------

if (thread) {
    // タイトル
    section.querySelector("h1").textContent = thread.title;

    // レス一覧
    const targetList = section.querySelector("ul");
    targetList.innerHTML = "";

    let no = 1;

    thread.threads.forEach((item) => {
        // 空のレスは表示しない
        if (!item.text.trim()) {
            return;
        }

        // 一致
        if (item.match) {
            if (!localStorage.getItem(item.match)) {
                return;
            }
        }

        // 不一致
        if (item.not) {
            if (localStorage.getItem(item.not)) {
                return;
            }
        }

        const li = document.createElement("li");

        // レス番号
        const threadNo = document.createElement("p");
        threadNo.className = "threadNo";
        threadNo.textContent = String(no).padStart(4, "0");

        // 本文
        const text = document.createElement("p");
        text.innerHTML = item.text;

        // 投稿者名
        const userName = document.createElement("p");
        userName.className = "userName";
        userName.innerHTML = (item.user != undefined) ? item.user : "ななし";

        li.append(threadNo, text, userName);
        targetList.appendChild(li);

        no++;
    });

} else {
    section.querySelector("h1").textContent = "スレッドが見つかりません";
    section.querySelector("ul").remove();
}

// ====================================================================================================
// FUGURUMA SYSTEM インストール
// ====================================================================================================

let isInstalling = false;
const installButton = document.getElementById("buttonm-install");

if (installButton) {
    installButton.addEventListener("click", async () => {
        if (isInstalling) {
            return;
        }
        isInstalling = true;

        // --------------------------------------------------
        // カバー：黒
        // --------------------------------------------------

        const cover = document.createElement("div");
        cover.className = "install-cover";
        cover.innerHTML = `
            <div class="install-content">

                <div class="install-title">FUGURUMA SYSTEM</div>

                <div class="install-progress">

                    <p>
                        NOW INSTALLING
                        <span class="install-percentage">0%</span>
                    </p>

                    <div class="install-gauge">
                        <span></span>
                    </div>

                </div>

            </div>
        `;

        document.querySelector("main").appendChild(cover);

        cover.classList.add("is-entering");
        await waitAnimation(cover, "installCoverIn");

        // --------------------------------------------------
        // タイトル表示
        // --------------------------------------------------

        const content = cover.querySelector(".install-content");

        const titleTransition = new Promise(resolve => {
            content.addEventListener("transitionend", function onTransitionEnd(event) {
                if (
                    event.target !== content
                    || event.propertyName !== "transform"
                ) {
                    return;
                }

                content.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        cover.classList.add("is-title");
        await titleTransition;

        // --------------------------------------------------
        // インストール演出
        // --------------------------------------------------

        cover.classList.add("is-progress");

        const gauge = cover.querySelector(".install-gauge span");
        const percentage = cover.querySelector(".install-percentage");

        gauge.classList.add("is-loading");

        const gaugeDuration = parseFloat(getComputedStyle(gauge).animationDuration) * 1000;
        const gaugeStart = performance.now();

        const updatePercentage = now => {
            const progress = Math.min((now - gaugeStart) / gaugeDuration, 1);
            percentage.textContent = `${Math.floor(progress * 100)}%`;

            if (progress < 1) {
                requestAnimationFrame(updatePercentage);
            }
        };

        requestAnimationFrame(updatePercentage);

        await waitAnimation(gauge, "installGauge");
        percentage.textContent = "100%";

        // --------------------------------------------------
        // キーワードリスト展開
        // --------------------------------------------------

        const keywordList = await waitForElement("#collectListContainer");

        const listTransition = new Promise(resolve => {
            keywordList.addEventListener("transitionend", function onTransitionEnd(event) {
                if (
                    event.target !== keywordList
                    || !["width", "height"].includes(event.propertyName)
                ) {
                    return;
                }

                keywordList.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        keywordList.classList.add("is-open");
        await listTransition;

        // --------------------------------------------------
        // タイトル・ゲージ退場
        // --------------------------------------------------

        const contentExit = new Promise(resolve => {
            content.addEventListener("transitionend", function onTransitionEnd(event) {
                if (
                    event.target !== content
                    || event.propertyName !== "transform"
                ) {
                    return;
                }

                content.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        cover.classList.add("is-content-exiting");
        await contentExit;

        // --------------------------------------------------
        // カバーをリスト領域に移行
        // --------------------------------------------------

        keywordList.classList.add("is-installing");

        // --------------------------------------------------
        // カバー：黒をスライドアウト
        // --------------------------------------------------

        cover.classList.add("is-exiting");
        await waitAnimation(cover, "installCoverOut");

        cover.remove();

        // --------------------------------------------------
        // カバー：青をスライドアウト
        // --------------------------------------------------

        keywordList.classList.add("is-installed");
        await waitAnimation(keywordList, "wordListCoverOut");

        keywordList.classList.remove("is-installing", "is-installed");

        // --------------------------------------------------
        // 進行処理
        // --------------------------------------------------

        // ストーリー進行
        localStorage.setItem("system-install", true);

        // 「キーワード」解放
        releaseKeyword();

        // メール受信表示
        // TODO:

    });
}