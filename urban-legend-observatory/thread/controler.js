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
                    <p>
                        NOW INSTALLING
                        <span class="install-percentage">0%</span>
                    </p>
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

        const content = cover.querySelector(".install-content");

        const titleTransition = new Promise(resolve => {
            content.addEventListener("transitionend", function onTransitionEnd(event) {
                if (event.target !== content || event.propertyName !== "transform") {
                    return;
                }

                content.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        cover.classList.add("is-title");
        await titleTransition;

        // --------------------------------------------------
        // インストール表示
        // --------------------------------------------------

        cover.classList.add("is-progress");

        const gauge = cover.querySelector(".install-gauge span");
        const percentage = cover.querySelector(".install-percentage");

        gauge.classList.add("is-loading");

        const gaugeDuration = parseFloat(
            getComputedStyle(gauge).animationDuration
        ) * 1000;

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
        // キーワードリストを展開
        // --------------------------------------------------

        const container = await waitForElement("#collectListContainer");

        const isMobile = window.matchMedia("(max-width: 779px)").matches;
        const listTransition = new Promise(resolve => {
            container.addEventListener("transitionend", function onTransitionEnd(event) {
                const expectedProperty = isMobile ? "height" : "width";

                if (event.target !== container || event.propertyName !== expectedProperty) {
                    return;
                }

                container.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        container.classList.add("is-open");

        const wordButton = document.getElementById("buttonWord");

        if (wordButton) {
            wordButton.classList.add("is-active");
        }

        await listTransition;

        // --------------------------------------------------
        // タイトルとゲージを同時に上へ退場
        // --------------------------------------------------

        const contentExit = new Promise(resolve => {
            content.addEventListener("transitionend", function onTransitionEnd(event) {
                if (event.target !== content || event.propertyName !== "transform") {
                    return;
                }

                content.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        cover.classList.add("is-content-exiting");

        await contentExit;

        // --------------------------------------------------
        // キーワードリストの領域だけ暗色カバーを残す
        // --------------------------------------------------

        const rect = container.getBoundingClientRect();

        const clipTransition = new Promise(resolve => {
            cover.addEventListener("transitionend", function onTransitionEnd(event) {
                if (event.target !== cover || event.propertyName !== "clip-path") {
                    return;
                }

                cover.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        if (isMobile) {
            cover.style.clipPath =
                `inset(${rect.top - mainRect.top}px 0 0 0)`;
        } else {
            cover.style.clipPath =
                `inset(0 0 0 ${rect.left - mainRect.left}px)`;
        }

        cover.classList.add("is-minimizing");

        await clipTransition;

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

        const blueExit = waitAnimation(blueCover, "installBlueOut");

        const coverExit = new Promise(resolve => {
            cover.addEventListener("transitionend", function onTransitionEnd(event) {
                if (event.target !== cover || event.propertyName !== "clip-path") {
                    return;
                }

                cover.removeEventListener("transitionend", onTransitionEnd);
                resolve();
            });
        });

        blueCover.classList.add("is-exiting");

        if (isMobile) {
            cover.style.clipPath = "inset(100% 0 0 0)";
        } else {
            cover.style.clipPath = "inset(0 0 0 100%)";
        }

        await Promise.all([blueExit, coverExit]);

        cover.remove();

        // --------------------------------------------------
        // 「キーワード」解放
        // --------------------------------------------------

        // releaseKeyword();

    });
}