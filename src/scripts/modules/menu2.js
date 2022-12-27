
// Проверка типа устройства
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
  .test(navigator.userAgent)) {
  document.body.classList.add('_touch');
} else { document.body.classList.add('_pc'); }

const menuItems = document.querySelectorAll('.menu__item');

//console.log(`Пунктов главного меню: ` + menuItems.length);
// если имеются пункты меню
if (menuItems.length > 0) {
  // проганяем цикл по элементам меню 
  for (let index = 0; index < menuItems.length; index++) {
    // вешаем задержку на пункты главного меню
    let menuLink = menuItems[index].querySelector('.menu__top-level-link');
    var string = (`${(index + 1) * 0.1}s`);
         // console.log(string);
          menuLink.style.transitionDelay = string;
    // проверяем наличие стрелочек, подменю и главной ссылки
    let strelochki = menuItems[index].querySelector('.menu__iconcontainer');
    let subMenuList = menuItems[index].querySelector('.menu__dropdown-list');
    let linkItem = menuItems[index].querySelector('.menu__top-level-link');
    // если имеются то идем дальше...
    if (strelochki && subMenuList && linkItem) {
      //console.log(`Найдена срелочка и подменю и ссылка`);

      // находим все li в данном подменю
      let subMenuItem = subMenuList.querySelectorAll('li');
      if (subMenuItem.length > 0) {
        for (let i = 0; i < subMenuItem.length; i++) {
          var string = (`${(i + 1) * 0.1}s`);
         // console.log(string);
          subMenuItem[i].style.transitionDelay = string;

          // getComputedStyle(subMenuItem[i]).paddingLeft = "50px";
          // console.log();
        }

      }

      // вешаем прослушку событий
      strelochki.addEventListener('click', function () {
        // определяем, был ли навешан класс .active
        let isClassActive;
        if (linkItem.classList.contains('active')) {
          isClassActive = true;
         // console.log(`isClassActive = true;`);
        } else {
          isClassActive = false;
         // console.log(`isClassActive = false;`);
        };
        // пробегаем по всему документу и снимаем классы .active у ссылок и подменю
        const linktems = document.querySelectorAll('.menu__top-level-link');
        const subMenutems = document.querySelectorAll('.menu__dropdown-list');
        if (linktems.length > 0) {
          for (let i = 0; i < linktems.length; i++) {
            if (linktems[i].classList.contains('active')) {
              linktems[i].classList.remove('active');
            }
          }
        }
        if (subMenutems.length > 0) {
          for (let i = 0; i < subMenutems.length; i++) {
            if (subMenutems[i].classList.contains('active')) {
              subMenutems[i].classList.remove('active');
            }
          }
        }
        // если ранее не было класса, то навешиваем на текущий элемент
        if (isClassActive == false) {
          linkItem.classList.add('active');
          subMenuList.classList.add('active');
        } else {
          linkItem.classList.remove('active');
          subMenuList.classList.remove('active');
        }
      })
    }
  }
}

let windowWidthBeforeClick;
window.onload = function(e){ 
  calcWindowWidth(); 
}
// вешаем прослушку изменения ширины окна
window.addEventListener('resize', calcWindowWidth);
function calcWindowWidth(){
  //Если активно меню, то вычисления не производим
  if(!document.body.classList.contains('active')){
     windowWidthBeforeClick = parseInt(document.body.clientWidth);
      //console.log(windowWidthBeforeClick);
  }
  
    //console.log(windowWidthBeforeClick);
}


const sideMenu = document.querySelector(".menu__sidebar-container");
const buttons = document.querySelector(".header__burger");
const screenFilter = document.querySelector(".screen-filter");

buttons.addEventListener('click', function () {
  buttons.classList.toggle('active');
  sideMenu.classList.toggle('active');
  screenFilter.classList.toggle('active');
  document.body.classList.toggle('active');
// при возникновении большого меню возникает фриз, если есть вертикальная прокрутка
// устраняем это путем добавления паддинга к элементу меню

// Определяем, будет ли показываться большое меню (по признаку видимости SVG Shape)
const svgShape = document.querySelector('.menu__shape');
const svgShapeIsvisible = getComputedStyle(svgShape);
//console.log(svgShapeIsvisible.visibility);
if(svgShapeIsvisible.visibility === 'visible'){
//console.log('Работаем в режиме малого меню');
}
else{
  //console.log('Клик баттон');
  calcWindowWidth();
  // узнаем пользовательскую ширину окна после клика
  const windowWidthAfterClick = parseInt(document.body.clientWidth);
  // Вычисляем ширину полосы прокрутки
  let scrollWidth = windowWidthAfterClick - windowWidthBeforeClick;
//console.log(`Переменная scrollWidth: ${scrollWidth}`);
  if(scrollWidth > 0){
  // console.log('Имеем полосу прокрутки шириной ');
   //console.log(scrollWidth);

   document.body.style.paddingRight = `${scrollWidth}px`;
  } 
  else{
    document.body.style.paddingRight = ``;
  }
  // снимаем паддинг если у body есть класс .active
  if(!document.body.classList.contains('active')){
   // console.log('Снимаем паддинг');
    document.body.style.paddingRight = ``;
  }

}




clearMenuClasses();
});


// Очищаем класс active у меню
function clearMenuClasses(){
 const dropMenuItems = document.querySelectorAll('.menu__dropdown-list');
const linkMenuItems = document.querySelectorAll('.menu__top-level-link');
if(dropMenuItems.length>0){ 
  for (let index = 0; index < dropMenuItems.length; index++){
     if (dropMenuItems[index].classList.contains('active')) {
              dropMenuItems[index].classList.remove('active');
              // console.log("Найдены активные подменю");
            }
  }
}
if(linkMenuItems.length>0){ 
  for (let index = 0; index < linkMenuItems.length; index++){
     if (linkMenuItems[index].classList.contains('active')) {
              linkMenuItems[index].classList.remove('active');
              // console.log("Найдены активные подменю");
            }
  }
}

}

// при возникновении большого меню возникает фриз, если есть вертикальная прокрутка
// устраняем это путем добавления паддинга к элементу меню





