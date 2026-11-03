// ====================================================================================================
// コレクトリスト
// ====================================================================================================

/**
 * コレクトリストのテンプレート読み込み
 */
async function loadCollectList() {
    const container = document.querySelector("#collectListContainer");

    if (!container) {
        return;
    }

    try {
        const response = await fetch("../common/template/collect-list.html");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const html = await response.text();

        container.innerHTML = html;

        initCollectPanel();
        renderCollectList();

    } catch (error) {
        console.error("コレクトリストの読み込みに失敗しました。", error);
    }
}

/**
 * コレクトリストの開閉
 * @param {Number} mode 0:トグル / 1:開く / 2:閉じる
 */
function initCollectPanel(mode = 0) {
    const toggle = document.querySelector("#collectToggle");
    const container = document.querySelector("#collectListContainer");

    if (!toggle || !container) {
        return;
    }

    // 開閉処理
    function changePanel(mode) {
        switch (mode) {
            // ●開く
            case 1:
                container.classList.remove("is-hidden");
                break;

            // ●閉じる
            case 2:
                container.classList.add("is-hidden");
                break;

            // ●トグル
            default:
                container.classList.toggle("is-hidden");
        }
    }

    // ボタンのクリックイベントは一度だけ登録
    if (!toggle.dataset.initialized) {
        toggle.addEventListener("click", function () {
            changePanel(0);
        });

        toggle.dataset.initialized = "true";
    }

    // 引数に応じて処理を実行
    if (mode !== 0) {
        changePanel(mode);
    }
}

/**
 * コレクトリストの描画
 */
function renderCollectList() {
    const list = document.querySelector("#collectWords");

    if (!list) {
        return;
    }

    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    list.innerHTML = "";

    words.forEach(function (word) {
        const li = document.createElement("li");
        li.textContent = word;
        list.appendChild(li);
    });
}

// 別ウィンドウからの更新を検出
window.addEventListener("storage", function (event) {
    if (event.key === "wordList") {
        renderCollectList();
    }
});

// ページ読み込み時に実行
loadCollectList();

// ====================================================================================================
// ワード自動入力
// ====================================================================================================

let activeInput = null;

/**
 * 入力欄の選択状態を管理
 */
document.addEventListener("focusin", function (event) {
    if (
        event.target.matches("input, textarea") &&
        !event.target.readOnly &&
        !event.target.disabled
    ) {
        // 前の入力欄の選択状態を解除
        if (activeInput) {
            activeInput.classList.remove("is-active");
        }

        activeInput = event.target;

        // 現在の入力欄を選択状態にする
        activeInput.classList.add("is-active");
    }
});

/**
 * 最後にフォーカスした入力欄を記憶
 */
document.addEventListener("focusin", function (event) {
    if (
        event.target.matches("input, textarea") &&
        !event.target.readOnly &&
        !event.target.disabled
    ) {
        activeInput = event.target;
    }
});

/**
 * コレクトリストのワードを入力欄に挿入
 */
document.addEventListener("click", function (event) {
    const target = event.target.closest("#collectWords li");

    if (!target || !activeInput) {
        return;
    }

    const input = activeInput;

    if (!input.isConnected || input.disabled || input.readOnly) {
        return;
    }

    // 入力欄の内容をすべて置き換え
    input.value = target.textContent.trim();

    // 入力イベントを発生させる
    input.dispatchEvent(new Event("input", {
        bubbles: true
    }));
});

// ====================================================================================================
// ワードコレクト
// ====================================================================================================

/**
 * コレクト済みか判定
 * @param {String} word 判定するワード
 * @returns {Boolean}
 */
function isCollected(word) {
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    return words.includes(word);
}

/**
 * ワードを追加
 * @param {String} word コレクトするワード
 * @returns {Boolean} 追加に成功した場合はtrue
 */
function addCollectWord(word) {
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 重複チェック
    if (words.includes(word)) {
        return false;
    }

    words.push(word);
    localStorage.setItem("wordList", JSON.stringify(words));

    return true;
}

/**
 * コレクトリストを開く
 */
async function showCollectPanel(newWord = false) {
    const loading = document.querySelector("#collectLoading");
    const container = document.querySelector("#collectListContainer");

    if (!loading || !container) {
        return;
    }

    const wasOpen = !container.classList.contains("is-hidden");

    // リストを開く
    initCollectPanel(1);

    if (newWord) {
        if (wasOpen) {
            loading.classList.add("animate-in");
            loading.classList.remove("is-hidden");

            await new Promise(requestAnimationFrame);

            loading.classList.add("is-visible");
        } else {
            loading.classList.remove("animate-in", "is-visible");
            loading.classList.remove("is-hidden");
        }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    renderCollectList();

    await new Promise(resolve => setTimeout(resolve, 500));

    loading.classList.remove("animate-in", "is-visible");
    loading.classList.add("is-hidden");
}

// --------------------------------------------------
// イベントを設定
// --------------------------------------------------

// 全てのワード要素を取得
const targets = document.querySelectorAll(".collectWord");

targets.forEach(target => {

    // ワードを抽出
    const word = target.textContent.trim();

    // すでにコレクト済みならクラスを付与
    if (isCollected(word)) {
        target.classList.add("collected");
    }

    // クリックイベントを付与
    target.addEventListener("click", async function () {

        // ワードを追加
        const newWord = addCollectWord(word);

        // 新規追加された場合だけクラスを付与
        if (newWord) {
            target.classList.add("collected");
        }

        // リストを開く
        await showCollectPanel(newWord);

    });
});