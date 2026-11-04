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

const buttonDecide = document.getElementById("button-start");

buttonDecide.addEventListener("click", function () {

    const inputStart = document.getElementById("input-start");

    if (inputStart.textContent == "調査を開始") {
        window.location.href = "page/a-mail.html";
    }

});