
const buttonDecide = document.getElementById("button-decide");

buttonDecide.addEventListener("click", function () {

    const inputStart = document.getElementById("input-start");

    if (inputStart.value == "調査を開始") {
        window.location.href = "page/a-mail.html";
    }

});