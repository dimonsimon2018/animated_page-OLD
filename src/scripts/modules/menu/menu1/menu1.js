// обработка бургер меню
const burgrerMenu = document.querySelector(".icon-menu");
const menuBody = document.querySelector(".menu__body");
const htmlBody = document.querySelector("body");
burgrerMenu.onclick = function () {
    burgrerMenu.classList.toggle("active");
    menuBody.classList.toggle("active");
    htmlBody.classList.toggle("locked");
}