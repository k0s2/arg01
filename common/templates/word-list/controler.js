// ====================================================================================================
// キーワードリスト
// ====================================================================================================

/**
 * キーワードリストの開閉
 * @param {Number} mode 0:トグル / 1:開く / 2:閉じる
 */
function initCollectPanel(mode = 0) {
    const container = document.querySelector("#collectListContainer");
    if (!container) {
        return;
    }

    // ボタン
    const button = document.getElementById("buttonWord");
    if (!button) {
        return;
    }

    // 開閉処理
    switch (mode) {
        // ●開く
        case 1:
            container.classList.add("is-open");
            button.classList.add("is-active");
            break;

        // ●閉じる
        case 2:
            container.classList.remove("is-open");
            button.classList.remove("is-active");
            break;

        // ●トグル
        default:
            container.classList.toggle("is-open");
            button.classList.toggle("is-active");
    }
}

/**
 * キーワードリストの描画
 */
function renderCollectList() {
    const list = document.querySelector("#keywords");
    if (!list) {
        return;
    }

    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    list.innerHTML = "";

    // ●キーワードを取得している
    if (words.length > 0) {

        words.forEach(function (word) {
            const li = document.createElement("li");
            li.textContent = word;
            li.classList.add("is-disabled");
            list.appendChild(li);

            setEventWordInput(li);
        });
    }
    // ●そうでない場合
    else {
        const target = document.getElementById("collectPanel");
        const element = document.createElement("p");
        element.innerHTML = "キーワードがありません。<br>下部に水色の点線が表示されている文字をクリックし、リストに登録してください。";
        element.id = "listEmpty";
        target.appendChild(element);
    }
}

/**
 * キーワードボタンの活性状態切り替え
 * @param {Boolean} active 活性状態にする
 */
function shiftKeywordButton(active) {
    // 各キーワード要素に適用
    const targetsKeyword = document.querySelectorAll("#keywords>li");
    targetsKeyword.forEach(target => {

        // ●活性化
        if (active) {
            // 非活性クラスを除去
            target.classList.remove("is-disabled");
        }
        // ●非活性化
        else {
            // 非活性クラスを付与
            target.classList.add("is-disabled");
        }

    });
}

// ====================================================================================================
// キーワード取得
// ====================================================================================================

/**
 * 取得済みか判定
 * @param {String} word 判定するキーワード
 * @returns {Boolean} 取得済みの場合はtrue
 */
function isCollected(word) {
    // 追加するキーワードを取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 既に取得されているかどうかを返す
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
 * @param {String} word 取得するキーワード
 * @returns {Boolean} 追加に成功した場合はtrue
 */
function addCollectWord(word) {
    // --------------------------------------------------
    // キーワード取得
    // --------------------------------------------------

    // 取得
    const words = JSON.parse(localStorage.getItem("wordList") || "[]");

    // 重複チェック
    if (words.includes(word)) {
        return false;
    }

    // キーワードをローカルストレージに追加
    words.push(word);
    localStorage.setItem("wordList", JSON.stringify(words));

    // --------------------------------------------------
    // リストに追加する処理
    // --------------------------------------------------

    const addToList = () => {
        // 対象要素を取得
        const list = document.querySelector("#keywords");
        if (!list) return;

        const li = document.createElement("li");
        li.textContent = word;
        li.classList.add("is-new");

        list.appendChild(li);

        li.addEventListener("animationend", function () {
            li.classList.remove("is-new");
        });

        setEventWordInput(li);
    };

    // --------------------------------------------------
    // 「キーワードがありません。」を消す
    // --------------------------------------------------

    // 取得
    const empty = document.getElementById("listEmpty");

    // 最初のキーワードだった場合
    if (empty) {
        // 非表示にする
        empty.classList.add("is-hidden");

        // 非表示アニメーションが終わった後に処理
        empty.addEventListener("transitionend", () => {
            empty.remove();
            addToList();
        }, { once: true });

    } else {
        // 2個目以降はそのまま追加
        addToList();
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
    // アクティブを解除
    target.classList.remove("is-active");
    activeInput = null;

    // アクティブ解除アニメーション終了後に実行（表示バグ対策）
    target.addEventListener("transitionend", () => {

        // 中身を空にする
        target.textContent = "";

        // 1文字ずつ描画
        let index = 0;
        function typeNext() {
            if (index >= word.length) {
                return;
            }

            target.textContent += word[index];
            index++;

            typingTimer = setTimeout(typeNext, 100);
        }

        // 描画の実行
        typeNext();

    }, { once: true });
}

/**
 * キーワードリストのキーワードを入力欄に挿入
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

// テンプレート読み込みモジュール
import { loadTemplate } from "../../controler.js";

/**
 * 初期化
 */
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

    // トグルボタン
    const targetToggleButton = document.getElementById("buttonWord");
    if (targetToggleButton) {

        // クリックイベントを付与
        targetToggleButton.addEventListener("click", async function () {

            // 開閉
            initCollectPanel();

        });

    };

    // キーワード
    const targetsKeyword = document.querySelectorAll(".keyword");
    targetsKeyword.forEach(target => {

        // キーワードを抽出
        const word = target.textContent.trim();

        // すでに取得済みならクラスを付与
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

                // 取得済み表示に変更
                target.classList.add("collected");
            }

        });

    });

    // 入力欄
    const targetsInput = document.querySelectorAll(".inputBox");
    targetsInput.forEach(target => {

        target.addEventListener("click", function () {

            // ●入力欄を再びクリックした場合
            if (target === activeInput) {
                // アクティブ状態を解除
                target.classList.remove("is-active");
                activeInput = null;

                // キーワードボタンを非活性化
                shiftKeywordButton(false);

                return;
            }

            // ●前の入力欄のアクティブ状態を解除
            if (activeInput) {
                // アクティブ状態を解除
                activeInput.classList.remove("is-active");
            }

            // 新しい入力欄を選択：入力ＯＮ
            activeInput = target;
            activeInput.textContent = "";
            activeInput.classList.add("is-active");

            // キーワードボタンを非活性化
            shiftKeywordButton(true);

            // キーワードリストを開く
            initCollectPanel(1);

        });

    });

    // --------------------------------------------------
    // キーワードリストのテンプレートを読み込み
    // --------------------------------------------------

    // テンプレート読み込み
    const resultContainer = await loadTemplate(
        import.meta.url,
        "#collectListContainer"
    );

    // 読み込み失敗時
    if (!resultContainer) {
        return;
    }

    // リスト内容を描画
    renderCollectList();

}