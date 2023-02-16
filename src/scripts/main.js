let currWindow; // номер текущего окна
let targets; // окна отслеживаемые IntersectionObserver
const FRAMESPERSECOND = 20;
const NUMOFFRAMES = 191;






window.addEventListener('load', windowLoad);

function windowLoad() {
  targets = document.querySelectorAll('.content__snap-page');
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

  // запускаем анимацию для проверки
  moviePlayer(0, 190);

}

function moviePlayer(startFrame, endFrame) {
  let startTimesstamp = null;
  let res = null;
  let dir = null;
  // проверяем направление движения анимации
  if (startFrame - endFrame > 0) { dir = false; } else { dir = true; }
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
    curSprite = sprite[res];

    reDrawCanvas();
    // показуем текущий спрайт
    
   // console.log(res);
    //console.log(dir);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }



  };
  window.requestAnimationFrame(step);

  //const relativeProgress = runtime / duration;


  /*  const animate = (timestamp) => {
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    
    if (runtime < duration) {
      
        requestAnimationFrame(animate);
    } else{startValue++;
      console.log(startValue);}
    
    }
    if(numSteps>startValue){
  requestAnimationFrame(animate);
    }
      */



  /* let startValue = 0;
  let startPosition = 0;
    function move(){
    startValue++;
    if(numSteps>startValue)
    requestAnimationFrame(move);
    console.log(startValue);
    }
  requestAnimationFrame(move); */
}





function checkDisplayedWindow(isFullHeight) {
  targets.forEach(function (elem, index) {
    if (elem.classList.contains('displayed')) {
      currWindow = index;
      // событие смены номера окна

      console.log(`Текущее окно: ${currWindow} , полная высота: ${isFullHeight}`);


      /*   if (currWindow === 0) {
          curSprite = sprite[0];
        };
        if (currWindow === 1) {
          curSprite = sprite[20];
        };
        if (currWindow === 2) {
          curSprite = sprite[40];
        };
        if (currWindow === 3) {
          curSprite = sprite[60];
        };
        if (currWindow === 4) {
          curSprite = sprite[80];
        };
        if (currWindow === 5) {
          curSprite = sprite[100];
        };
        if (currWindow === 6) {
          curSprite = sprite[120];
        };
        if (currWindow === 7) {
          curSprite = sprite[140];
        };
        if (currWindow === 8) {
          curSprite = sprite[160];
        };
        if (currWindow === 9) {
          curSprite = sprite[180];
        };
  
        reDrawCanvas(); */



    }
  });
}

const canvas = document.getElementById("snap-sequence-canvas");
let ctx = canvas.getContext('2d');
let sprite = [];
ctx.clearRect(0, 0, windowWidth, windowHeight);


createSprites();
let curSprite = sprite[0];
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



