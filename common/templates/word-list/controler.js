// ====================================================================================================
// コレクトリスト
// ====================================================================================================

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

        setEventWordInput(li);
    });
}

// ====================================================================================================
// キーワードコレクト
// ====================================================================================================

/**
 * コレクト済みか判定
 * @param {String} word 判定するキーワード
 * @returns {Boolean} コレクト済みの場合はtrue
 */
function isCollected(word) {
    // 追加するキーワードを取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 既にコレクトされているかどうかを返す
    return words.includes(word);
}

/**
 * ポップアップ
 * @param {HTMLElement} target 表示対象
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
 * キーワードを追加
 * @param {String} word コレクトするキーワード
 * @returns {Boolean} 追加に成功した場合はtrue
 */
function addCollectWord(word) {
    // 追加するキーワードを取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 重複チェック
    if (words.includes(word)) {
        return false;
    }

    // キーワードをローカルストレージに追加
    words.push(word);
    localStorage.setItem("wordList", JSON.stringify(words));

    // --------------------------------------------------
    // リストに追加
    // --------------------------------------------------

    // 対象要素を取得
    const list = document.querySelector("#collectWords");
    if (list) {
        const li = document.createElement("li");
        li.textContent = word;
        li.classList.add("is-new");

        list.appendChild(li);

        li.addEventListener("animationend", function () {
            li.classList.remove("is-new");
        });

        setEventWordInput(li);
    }

    // --------------------------------------------------

    return true;
}

// ====================================================================================================
// キーワード自動入力
// ====================================================================================================

// アクティブなインプットボックス
let activeInput = null;

// タイピング演出用
let typingTimer = null;

/**
 * タイピング演出
 * @param {HTMLElement} target 入力対称
 * @param {String} word キーワード
 */
function typeWord(target, word) {
    target.classList.remove("is-active");
    activeInput = null;

    clearTimeout(typingTimer);
    target.textContent = "";

    let index = 0;

    function typeNext() {
        if (index >= word.length) {
            return;
        }

        target.textContent += word[index];
        index++;

        typingTimer = setTimeout(typeNext, 100);
    }

    typeNext();
}

/**
 * コレクトリストのキーワードを入力欄に挿入
 */
function setEventWordInput(target) {
    target.addEventListener("click", function () {
        if (!activeInput) {
            return;
        }

        const word = target.textContent.trim();
        typeWord(activeInput, word);
    });
}

// ====================================================================================================
// モジュール初期化
// ====================================================================================================

import { loadTemplate } from "../../controler.js";

export async function initWordCollect() {

    // --------------------------------------------------
    // イベント設定
    // --------------------------------------------------

    // 別ウィンドウからの更新を検出
    window.addEventListener("storage", function (event) {

        if (event.key === "wordList") {
            renderCollectList();
        }

    });

    // キーワード
    const targets = document.querySelectorAll(".collectWord");
    targets.forEach(target => {

        // キーワードを抽出
        const word = target.textContent.trim();

        // すでにコレクト済みならクラスを付与
        if (isCollected(word)) {
            target.classList.add("collected");
        }

        // クリックイベントを付与
        target.addEventListener("click", async function () {

            // キーワードを追加
            const newWord = addCollectWord(word);

            // 新規追加された場合だけクラスを付与
            if (newWord) {
                // ポップアップ
                playCollectEffect(target);

                // コレクト済み表示に変更
                target.classList.add("collected");
            }

        });

    });

    // 入力欄
    const targetsInput = document.querySelectorAll(".inputBox");
    targetsInput.forEach(target => {

        target.addEventListener("click", function () {

            // ●同じ入力欄をクリックした場合：入力ＯＦＦ
            if (target === activeInput) {
                target.classList.remove("is-active");
                activeInput = null;
                return;
            }

            // ●前の入力欄のアクティブ状態を解除
            if (activeInput) {
                activeInput.classList.remove("is-active");
            }

            // 新しい入力欄を選択：入力ＯＮ
            activeInput = target;
            activeInput.textContent = "";
            activeInput.classList.add("is-active");

            // コレクトリストを開く
            initCollectPanel(1);

        });

    });

    // --------------------------------------------------
    // ページ読み込み時に実行
    // --------------------------------------------------

    const container = await loadTemplate(
        import.meta.url,
        "#collectListContainer"
    );

    if (!container) {
        return;
    }

    renderCollectList();

}