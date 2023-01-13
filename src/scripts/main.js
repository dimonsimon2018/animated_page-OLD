let currWindow; // номер текущего окна
let currFrame; // номер текущего кадра

/////////////////// Хэндлер для пересечения полного экрана
const options = {
  threshold: [1]
};
const callback = function (entries, observer) {
// обнуляем номер кадра

console.log(`Текущий номер кадра: ${currFrame}`);
currFrame = 0;
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
    checkDisplayedWindow();
  });
};
const observer = new IntersectionObserver(callback, options);
//////////////////////////////////////////////////////////////

/////////////////// Хэндлер для пересечения части экрана
const intersections = [0.25,0.35,0.45,0.55,0.65];
const options2 = {
  threshold: intersections
};
const callback2 = function (entries, observer) {

  entries.forEach(function (elem, index) {
    
      // проверяем пришло ли сообщение от активного окна
      if(elem.target.classList.contains('displayed')){
        currFrame++;
        curSprite = sprite[currFrame*4];
        reDrawCanvas();
        //console.log( elem.intersectionRatio);
       // console.log(`${checkintersectionRatio(elem.intersectionRatio)}`);

        //console.log(elem);
      }
      
      
      // console.log(checkintersectionRatio(elem.intersectionRatio));
    

  });
};
const observer2 = new IntersectionObserver(callback2, options2);
//////////////////////////////////////////////////////////////


function checkintersectionRatio(val) {
let arr = [];
 intersections.forEach(function (elem, index) {
    arr[index] = Math.abs(intersections[index]-val) ;      
    
  });
  // находим минимальное
  
  let reversed = arr.reverse();
  let minimumVal = reversed[0];
  let indexMin = 0;
reversed.forEach(function (elem, index) {
    if(reversed[index] < minimumVal) {
    minimumVal = reversed[index]; // если находим другое минимальное число, то сохраняем в переменную
    indexMin = index;
    
  }
 // console.log(reversed);
  });
return indexMin;
}

const targets = document.querySelectorAll('.content__snap-page');
targets.forEach(p => { observer.observe(p) });
targets.forEach(p => { observer2.observe(p) });




function checkDisplayedWindow() {
  targets.forEach(function (elem, index) {
    if (elem.classList.contains('displayed')) {
      currWindow = index;
      // событие смены номера окна
      console.log(`Текущее окно: ${currWindow}`);
      if (currWindow === 0) {
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

      reDrawCanvas();

      //animationBG.setAttribute('height', '350');    

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
  for (let i = 0; i < 191; i++) {
    sprite[i] = new Image();
    sprite[i].src = `img/sequence/Section1_${i}.jpg`;

  }
}


window.onload = function (e) {
 // console.log("Событие window.onload");

  // Canvas.init();
  checkWindowSize();

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



