let currWindow; // номер текущего окна
let currFrame; // номер текущего кадра
let direction; // направление прокрутки
let LastItersectionRatio; // последняя координата Y элемента
let intersectionPositions = [];
let intersectionPositionsReversed = [];
/////////////////// Хэндлер для пересечения полного экрана
const options = {
  threshold: [1]
};
const callback = function (entries, observer) {
  // обнуляем номер кадра

  //console.log(`Текущий номер кадра: ${currFrame}`);
  currFrame = 0;
  LastItersectionRatio = 0;
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

/////////////////// Хэндлер2 для пересечения части экрана
const intersections2 = [0.1, 0.26, 0.42, 0.58, 0.74];
const options2 = {
  threshold: intersections2
};
const callback2 = function (entries, observer) {
  entries.forEach(function (elem, index) {
    // проверяем пришло ли сообщение от активного окна
    if (elem.target.classList.contains('displayed')) {
      checkScrollDirection(elem.boundingClientRect.y);
      console.log(direction);
      checkintersectionRatio(elem.intersectionRatio, intersections2);
      curSprite = sprite[numOfSnapPos];
      console.log(`Кадр: ${numOfSnapPos}`);

      // определяем направление движения
      //console.log();


      // reDrawCanvas();

      console.log(`${checkintersectionRatio(elem.intersectionRatio, intersections2)}`);
      //console.log(elem);
    }
    // console.log(checkintersectionRatio(elem.intersectionRatio));
  });
};
const observer2 = new IntersectionObserver(callback2, options2);
//////////////////////////////////////////////////////////////

/////////////////// Хэндлер3 для пересечения части экрана
const intersections3 = [0.14, 0.30, 0.46, 0.62, 0.78];
const options3 = {
  threshold: intersections3
};
const callback3 = function (entries, observer) {
  entries.forEach(function (elem, index) {
    // проверяем пришло ли сообщение от активного окна
    if (elem.target.classList.contains('displayed')) {
      checkScrollDirection(elem.boundingClientRect.y);
      console.log(direction);
      checkintersectionRatio(elem.intersectionRatio, intersections2);
      curSprite = sprite[numOfSnapPos];
      console.log(`Кадр: ${numOfSnapPos}`);

      //curSprite = sprite[currFrame];
      //console.log(`Кадр: ${currFrame}`);
      //currFrame++;
      //reDrawCanvas();
      //console.log( elem.intersectionRatio);



      console.log(`${checkintersectionRatio(elem.intersectionRatio, intersections3)}`);
      //console.log(elem);
    }

  });
};
const observer3 = new IntersectionObserver(callback3, options3);
//////////////////////////////////////////////////////////////

/////////////////// Хэндлер4 для пересечения части экрана
const intersections4 = [0.18, 0.34, 0.5, 0.66, 0.82];
const options4 = {
  threshold: intersections4
};
const callback4 = function (entries, observer) {
  entries.forEach(function (elem, index) {
    // проверяем пришло ли сообщение от активного окна
    if (elem.target.classList.contains('displayed')) {
      checkScrollDirection(elem.boundingClientRect.y);
      console.log(direction);
      checkintersectionRatio(elem.intersectionRatio, intersections2);
      curSprite = sprite[numOfSnapPos];
      console.log(`Кадр: ${numOfSnapPos}`);



      console.log(`${checkintersectionRatio(elem.intersectionRatio, intersections4)}`);
      //console.log(elem);
    }

  });
};
const observer4 = new IntersectionObserver(callback4, options4);
//////////////////////////////////////////////////////////////

//#region /////////////////// Хэндлер5 для пересечения части экрана
const intersections5 = [0.22, 0.38, 0.54, 0.7, 0.86];
const options5 = {
  threshold: intersections5
};
const callback5 = function (entries, observer) {
  entries.forEach(function (elem, index) {
    // проверяем пришло ли сообщение от активного окна
    if (elem.target.classList.contains('displayed')) {
      checkScrollDirection(elem.boundingClientRect.y);
      console.log(direction);
      checkintersectionRatio(elem.intersectionRatio, intersections2);
      curSprite = sprite[numOfSnapPos];
      console.log(`Кадр: ${numOfSnapPos}`);

      //reDrawCanvas();
      //console.log( elem.intersectionRatio);


      //console.log(`Кадр: ${currFrame}`);


      console.log(`${checkintersectionRatio(elem.intersectionRatio, intersections5)}`);
      //console.log(elem);
    }

  });
};
const observer5 = new IntersectionObserver(callback5, options5);
//#endregion//////////////////////////////////////////////////////////////




const targets = document.querySelectorAll('.content__snap-page');
targets.forEach(p => { observer5.observe(p) });
targets.forEach(p => { observer4.observe(p) });
targets.forEach(p => { observer3.observe(p) });
targets.forEach(p => { observer2.observe(p) });
targets.forEach(p => { observer.observe(p) });

function calcFrameNumber() {

}
let numOfSnapPos;
function checkintersectionRatio(val, array) {
  let arr = [];

  array.forEach(function (elem, index) {
    arr[index] = Math.abs(array[index] - val);
  });
  // находим минимальное  
  //let reversed = arr.reverse();

  let indexMin = 0;

  let minimumVal = arr[0];
  arr.forEach(function (elem, index) {
    if (arr[index] < minimumVal) {
      minimumVal = arr[index]; // если находим другое минимальное число, то сохраняем в переменную
      indexMin = index;
    }
  });
  //console.log(`index ${indexMin}`);
  //checkScrollDirection (y_Pos);
  // разворачиваем массив в случае прокрутки вверх

  // возвращаем реальую величину процента видимости экрана 

  intersectionPositionsReversed.forEach(function (elem, index) {
    //console.log('гоняем цикл');
    if (intersectionPositionsReversed[index] === array[indexMin]) {
      // console.log(index);
      // console.log('условие цикла выполнено');
      numOfSnapPos = index;
    }
  });
  //return numOfSnapPos;
}


function checkScrollDirection(rate) {
  if (LastItersectionRatio - rate > 0) {
    direction = 'down';
    //console.log('down')
  }
  else {
    direction = 'up';
  }
  LastItersectionRatio = rate;
  //console.log(direction);
}






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

unionArrays();
createSprites();
let curSprite = sprite[0];
reDrawCanvas();


function createSprites() {
  for (let i = 0; i < 191; i++) {
    sprite[i] = new Image();
    sprite[i].src = `img/sequence/Section1_${i}.jpg`;

  }
}

function unionArrays() {
  // обьединяем intersections в единый массив и зеркалим его
  let currIndex = 0;
  let arr1 = [];
  let arr2 = [];
  intersections2.forEach(function (elem, index) {

    arr1[currIndex] = arr2[currIndex] = intersections2[index];
    currIndex++;
    arr1[currIndex] = arr2[currIndex] = intersections3[index];
    currIndex++;
    arr1[currIndex] = arr2[currIndex] = intersections4[index];
    currIndex++;
    arr1[currIndex] = arr2[currIndex] = intersections5[index];
    currIndex++;
  });
  intersectionPositions = arr1;
  intersectionPositionsReversed = arr2.reverse();

}


window.onload = function (e) {
  console.log("Событие window.onload");

  // Canvas.init();
  checkWindowSize();
  currFrame = 0;






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



