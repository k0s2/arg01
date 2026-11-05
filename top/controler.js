/**
 * コレクトリストのリセット
 */
function listReset() {
    // リセット
    localStorage.removeItem("wordList");

    // ページのリロード
    location.reload();
}

// --------------------------------------------------
// イベントを設定
// --------------------------------------------------

const targetToggleButton = document.getElementById("collectToggle");

// キーワード
const targetsKeyword = document.querySelectorAll(".collectWord");
targetsKeyword.forEach(target => {

    // クリックイベントを付与
    target.addEventListener("click", async function () {

        targetToggleButton.classList.remove("is-hidden");

    });

});

const buttonDecide = document.getElementById("button-start");

buttonDecide.addEventListener("click", function () {

    const inputStart = document.getElementById("input-start");

    if (inputStart.textContent == "調査を開始") {
        window.location.href = new URL("../a-mail/", location.href).href;
    }

});