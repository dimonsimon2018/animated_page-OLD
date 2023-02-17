let currWindow; // номер текущего окна
let isMovieEnable; // разрешить воспроизведение видео
let targets; // окна отслеживаемые IntersectionObserver
let targetsNum; // количество окон
const FRAMESPERSECOND = 10;
const NUMOFFRAMES = 191;
let sprite = []; // массив обьектов кадров
let curSprite; // текущий обьект кадра
let curSpriteNum = 0; // текущий номер кадра

/* массив для анимации сайта 
[
0 - начало кадра для окна 0, 
0 - конец кадра для окна 0 и начало для окна 1,
19 - конец кадра для окна 1 и начало для окна 2,
38 - конец кадра для окна 2 и начало для окна 3,
57 - конец кадра для окна 3 и начало для окна 4,
76 - конец кадра для окна 4 и начало для окна 5,
95 - конец кадра для окна 5 и начало для окна 6,
114 - конец кадра для окна 6 и начало для окна 7,
133 - конец кадра для окна 7 и начало для окна 8,
152 - конец кадра для окна 8 и начало для окна 9,
190 - конец кадра для окна 9
] 
*/

let animationSequence = [0, 0, 19, 38, 57, 76, 95, 114, 133, 152, 190] // 

window.addEventListener('load', windowLoad);
// вешаем прослушку для скролла
function chekcScrollPos(){
  console.log('windowLoad');
}

function windowLoad() {
  targets = document.querySelectorAll('.content__snap-page');
  targetsNum = targets.length;
  checkWindowSize();

  
  //#region /////////////////// Хэндлер для пересечения полного экрана
  const options = {
    threshold: [1]
  };
  const callback = function (entries, observer) {
    // запускаем обработку если уже прогружена страница

    entries.forEach(function (elem, index) {    

      if (elem.isIntersecting) {
        // чистим классы у остальных элементов
        targets.forEach(function (e, i) {

          if (e.classList.contains('displayed')) {
            e.classList.remove('displayed');
          }
        });
        elem.target.classList.add("displayed");
      }
      checkDisplayedWindow(elem.isIntersecting);
    });
  };
  const observer = new IntersectionObserver(callback, options);
  targets.forEach(p => { observer.observe(p) });
  //console.log(targets[currWindow].getBoundingClientRect().y);
  //console.log('windowLoad');
  //#endregion//////////////////////////////////////////////////////////////



}

function moviePlayer(startFrame, endFrame) {
  let startTimesstamp = null;
  let res = null;
  let dir = null;
  // проверяем направление движения анимации
  if (startFrame - endFrame > 0) { dir = false; } else { dir = true; };
  let numSteps = Math.abs(endFrame - startFrame);
  const duration = (1000 / FRAMESPERSECOND) * numSteps;
  let startValue = numSteps;


  const step = (timestamp) => {
    if (!startTimesstamp) startTimesstamp = timestamp;
    const progress = Math.min((timestamp - startTimesstamp) / duration, 1);
    if (dir) {
      res = Math.floor(progress * (startValue) + startFrame);
    } else {
      res = Math.floor((1 - progress) * (startValue) + endFrame);
    }
    // Выполняем рекурсию только если токен в TRUE и если есть разница в количестве кадров
    if(isMovieEnable===true){
      // выполняем проверку на разницу кадров, если он один то его и показываем
      if(startFrame-endFrame!=0){
        curSpriteNum = res;
      } else {curSpriteNum = startFrame; }
      
      curSprite = sprite[curSpriteNum];
      reDrawCanvas();    
      if (progress < 1 ) {
          window.requestAnimationFrame(step);
      }
    }

  };
  window.requestAnimationFrame(step);
}





function checkDisplayedWindow(isFullHeight) { 
  targets.forEach(function (elem, index) {
    // устанавливаем значения токена для видео (запрещаем проигрывание если окно не на 100% высоты)
    isMovieEnable = isFullHeight;

    if (elem.classList.contains('displayed')) {
      // назначаем глобальной переменной порядкового номера текущего блока новое значение
      currWindow = index;
      // событие смены номера окна
      //console.log(`Текущее окно: ${currWindow} , полная высота: ${isFullHeight}`);
      // запускаем анимацию для проверки  
      for (let index = 0; index < targetsNum; index++) {
        if (currWindow === index) {     
          // проверяем номер текущего кадра
          if(curSpriteNum > animationSequence[index] && curSpriteNum <= animationSequence[index + 1]){
            moviePlayer(curSpriteNum, animationSequence[index + 1]);
          } else{
            moviePlayer(animationSequence[index], animationSequence[index + 1]);
          } 
        }          
      }       
    }
  })
}

const canvas = document.getElementById("snap-sequence-canvas");
let ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, windowWidth, windowHeight);


createSprites();
// Устанавливаем начальный спрайт для фона
curSprite = sprite[animationSequence[0]];
reDrawCanvas();


function createSprites() {
  for (let i = 0; i < NUMOFFRAMES; i++) {
    sprite[i] = new Image();
    sprite[i].src = `img/sequence/Section1_${i}.jpg`;
  }
}





// вешаем прослушку изменения ширины окна
window.addEventListener('resize', checkWindowSize);

let windowWidth;
let windowHeight;

function checkWindowSize() {
  windowWidth = parseInt(document.body.clientWidth);
  windowHeight = parseInt(document.body.clientHeight);
  canvas.setAttribute('width', windowWidth);
  canvas.setAttribute('height', windowHeight);
  reDrawCanvas();

}
function reDrawCanvas() {
  //Используйте два последних параметра для смещения изображения:
  // drawImageProp(ctx, backgroundImg, 0, 0, windowWidth, windowHeight, offsetX, offsetY);
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  drawImageProp(ctx, curSprite, 0, 0, windowWidth, windowHeight);
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill    
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}



