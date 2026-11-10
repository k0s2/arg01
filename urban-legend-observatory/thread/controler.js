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

// 指定時間待機
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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

    thread.threads.forEach((item, index) => {
        // 空のレスは表示しない
        if (!item.text.trim()) {
            return;
        }

        const li = document.createElement("li");

        // レス番号
        const threadNo = document.createElement("p");
        threadNo.className = "threadNo";
        threadNo.textContent = String(index + 1).padStart(4, "0");

        // 本文
        const text = document.createElement("p");
        text.innerHTML = item.text;

        // 投稿者名
        const userName = document.createElement("p");
        userName.className = "userName";
        userName.textContent = item.user || "ななし";

        li.append(threadNo, text, userName);
        targetList.appendChild(li);
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
        // カバーを生成
        // --------------------------------------------------

        const main = document.querySelector("main");
        const mainRect = main.getBoundingClientRect();

        const cover = document.createElement("div");
        cover.className = "install-cover";

        cover.style.inset = "auto";
        cover.style.top = `${mainRect.top}px`;
        cover.style.left = `${mainRect.left}px`;
        cover.style.width = `${mainRect.width}px`;
        cover.style.height = `${mainRect.height}px`;

        cover.innerHTML = `
            <div class="install-content">

                <div class="install-title">FUGURUMA SYSTEM</div>

                <div class="install-progress">

                    <p>NOW INSTALLING</p>

                    <div class="install-gauge">
                        <span></span>
                    </div>

                </div>

            </div>

            <div class="install-blue-cover"></div>
        `;

        main.appendChild(cover);

        cover.classList.add("is-entering");
        await waitAnimation(cover, "installCoverIn");

        // --------------------------------------------------
        // タイトル表示
        // --------------------------------------------------

        cover.classList.add("is-title");

        await wait(500);

        // --------------------------------------------------
        // インストール表示
        // --------------------------------------------------

        cover.classList.add("is-progress");

        const gauge = cover.querySelector(".install-gauge span");
        gauge.classList.add("is-loading");

        await waitAnimation(gauge, "installGauge");

        // --------------------------------------------------
        // キーワードリストを展開
        // --------------------------------------------------

        const container = await waitForElement("#collectListContainer");

        container.classList.add("is-open");

        const wordButton = document.getElementById("buttonWord");

        if (wordButton) {
            wordButton.classList.add("is-active");
        }

        await wait(250);

        // --------------------------------------------------
        // タイトルとゲージを同時に上へ退場
        // --------------------------------------------------

        cover.classList.add("is-content-exiting");

        await wait(500);

        // --------------------------------------------------
        // キーワードリストの領域だけ暗色カバーを残す
        // --------------------------------------------------

        const rect = container.getBoundingClientRect();
        const isMobile = window.matchMedia("(max-width: 779px)").matches;

        if (isMobile) {
            cover.style.clipPath = `inset(${rect.top - mainRect.top}px 0 0 0)`;
        } else {
            cover.style.clipPath = `inset(0 0 0 ${rect.left - mainRect.left}px)`;
        }

        cover.classList.add("is-minimizing");

        await wait(750);

        // --------------------------------------------------
        // 残った領域内でシアンカバーを展開
        // --------------------------------------------------

        const blueCover = cover.querySelector(".install-blue-cover");

        blueCover.style.top = `${rect.top - mainRect.top}px`;
        blueCover.style.left = `${rect.left - mainRect.left}px`;
        blueCover.style.width = `${rect.width}px`;
        blueCover.style.height = `${rect.height}px`;

        blueCover.classList.add("is-entering");
        await waitAnimation(blueCover, "installBlueIn");

        // --------------------------------------------------
        // シアンカバーと暗色カバーを同時に退場
        // --------------------------------------------------

        blueCover.classList.add("is-exiting");

        if (isMobile) {
            cover.style.clipPath = "inset(100% 0 0 0)";
        } else {
            cover.style.clipPath = "inset(0 0 0 100%)";
        }

        await waitAnimation(blueCover, "installBlueOut");

        cover.remove();

        // --------------------------------------------------
        // 「キーワード」解放
        // --------------------------------------------------

        // releaseKeyword();

    });
}