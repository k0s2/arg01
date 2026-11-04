// ====================================================================================================
// コレクトリスト
// ====================================================================================================

/**
 * コレクトリストのテンプレート読み込み
 */
async function loadCollectList() {
    // 読み込み先を取得
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
    const container = document.querySelector("#collectListContainer");
    if (!container) {
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
// ワードコレクト
// ====================================================================================================

/**
 * コレクト済みか判定
 * @param {String} word 判定するワード
 * @returns {Boolean}
 */
function isCollected(word) {
    // 追加するワードを取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 既にコレクトされているかどうかを返す
    return words.includes(word);
}

/**
 * コレクトリストを更新
 */
async function showCollectPanel() {
    // ローディング表示要素を取得
    const loading = document.querySelector("#collectLoading");
    if (!loading) {
        return;
    }

    // スタイル制御
    loading.classList.add("animate-in");
    loading.classList.remove("is-hidden");

    // ウェイト
    await new Promise(resolve => setTimeout(resolve, 500));

    // リストを更新
    renderCollectList();

    // ウェイト
    await new Promise(resolve => setTimeout(resolve, 500));

    // スタイル制御
    loading.classList.remove("animate-in", "is-visible");
    loading.classList.add("is-hidden");
}

/**
 * ポップアップ
 */
function playCollectEffect(target) {
    const effect = document.createElement("span");

    effect.textContent = "COLLECT";
    effect.classList.add("collectEffect");

    // クリック位置を取得
    const rect = target.getBoundingClientRect();

    effect.style.left = `${rect.left + rect.width / 2}px`;
    effect.style.top = `${rect.top}px`;

    document.body.appendChild(effect);

    // アニメーション終了後に削除
    effect.addEventListener("animationend", function () {
        effect.remove();
    });
}

/**
 * ワードを追加
 * @param {String} word コレクトするワード
 * @returns {Boolean} 追加に成功した場合はtrue
 */
function addCollectWord(word) {
    // 追加するワードを取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 重複チェック
    if (words.includes(word)) {
        return false;
    }

    // ワードをローカルストレージに追加
    words.push(word);
    localStorage.setItem("wordList", JSON.stringify(words));

    return true;
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
            // ポップアップ
            playCollectEffect(target);

            // リスト更新
            showCollectPanel();

            // コレクト済み表示に変更
            target.classList.add("collected");
        }

    });
});

// ====================================================================================================
// ワード自動入力
// ====================================================================================================

// アクティブなインプットボックス
let activeInput = null;

// タイピング演出用
let typingTimer = null;

/**
 * 入力欄の選択状態を管理
 */
document.addEventListener("click", function (event) {

    // 対象を取得
    const target = event.target.closest(".inputBox");
    if (!target) {
        return;
    }

    // 前の入力欄の選択状態を解除
    if (activeInput) {
        activeInput.classList.remove("is-active");
    }

    // ●入力ＯＮ
    if (target != activeInput) {
        // 中身を空にする
        target.value = "";

        // 現在の入力欄を選択状態にする
        activeInput = target;
        activeInput.classList.add("is-active");

        // コレクトリストを開く
        initCollectPanel(1);
    }
    // ●入力ＯＦＦ
    else {
        // アクティブ状態を解除
        activeInput = null;
    }

});

/**
 * タイピング演出
 */
function typeWord(element, word) {
    // 入力欄のアクティブ解除
    element.classList.remove("is-active");

    // 前のタイピング演出を中断
    clearTimeout(typingTimer);

    // 表示を空にする
    element.textContent = "";

    let index = 0;

    function typeNext() {
        if (index >= word.length) {
            return;
        }

        element.textContent += word[index];
        index++;

        typingTimer = setTimeout(typeNext, 100);
    }

    typeNext();
}

/**
 * コレクトリストのワードを入力欄に挿入
 */
document.addEventListener("click", function (event) {
    const target = event.target.closest("#collectWords li");

    if (!target || !activeInput) {
        return;
    }

    if (!activeInput.isConnected) {
        activeInput = null;
        return;
    }

    // ワードをタイピング表示
    const word = target.textContent.trim();
    typeWord(activeInput, word);
});