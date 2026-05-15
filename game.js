function setAppHeight(){

  const height =
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  document.documentElement
    .style
    .setProperty(
      "--app-height",
      `${height}px`
    );
}

setAppHeight();

window.addEventListener(
  "resize",
  setAppHeight
);

if(window.visualViewport){

  window.visualViewport
    .addEventListener(
      "resize",
      setAppHeight
    );
}

const bgm = new Audio("bgm.mp3");
const seGood = new Audio("se_good.mp3");
const seBad = new Audio("se_bad.mp3");
const seIn = new Audio("se_in.mp3");
const seOut = new Audio("se_out.mp3");

bgm.loop = true;
bgm.volume = 0.45;

const customers = [
  "🧓",
  "🧑‍💼",
  "🕵️",
  "🧑‍🏭",
  "🧑‍🦱",
  "👴",
  "👵",
  "👷",
  "🙋",
  "🧑‍🎤"
];

const titleScreen =
  document.getElementById("titleScreen");

const gameScreen =
  document.getElementById("gameScreen");

const resultScreen =
  document.getElementById("resultScreen");

const titleImage =
  document.getElementById("titleImage");

const retryBtn =
  document.getElementById("retryBtn");

const shareBtn =
  document.getElementById("shareBtn");

const homeBtn =
  document.getElementById("homeBtn");

const backBtn =
  document.getElementById("backBtn");

const scoreEl =
  document.getElementById("score");

const timeEl =
  document.getElementById("time");

const customerEl =
  document.getElementById("customer");

const orderNameEl =
  document.getElementById("orderName");

const recipeTextEl =
  document.getElementById("recipeText");

const popup =
  document.getElementById("popup");

const kitchenImage =
  document.getElementById("kitchenImage");

const rankEl =
  document.getElementById("rank");

const finalScoreEl =
  document.getElementById("finalScore");

const commentEl =
  document.getElementById("comment");

const recipes = {

  "肉うどん":[
    "men",
    "dashi",
    "beef",
    "negi"
  ],

  "チャニボ":[
    "men",
    "dashi",
    "pork",
    "oil"
  ],

  "かすうどん":[
    "men",
    "dashi",
    "kasu",
    "negi"
  ],

  "ごぼ天":[
    "men",
    "dashi",
    "gobo",
    "negi"
  ],

  "素うどん":[
    "men",
    "dashi",
    "negi"
  ],

  "全部のせ":[
    "men",
    "dashi",
    "beef",
    "gobo",
    "egg",
    "negi"
  ]
};

const labels = {

  men:"麺",
  dashi:"だし",
  beef:"牛肉",
  pork:"豚肉",
  oil:"煮干油",
  kasu:"かす",
  gobo:"ごぼ天",
  egg:"卵",
  negi:"ネギ",
  wakame:"わかめ"
};

const recipeNames =
  Object.keys(recipes);

let currentOrder = "";

let currentRecipe = [];

let progress = 0;

let score = 0;

let time = 60;

let timer;

function randomOrder(){

  return recipeNames[
    Math.floor(
      Math.random() *
      recipeNames.length
    )
  ];
}

function randomCustomer(){

  return customers[
    Math.floor(
      Math.random() *
      customers.length
    )
  ];
}

function renderRecipe(){

  recipeTextEl.innerHTML = "";

  currentRecipe.forEach((step,index)=>{

    const box =
      document.createElement("div");

    box.className =
      "recipeBox";

    if(index === progress){

      box.classList.add("active");
    }

    box.textContent =
      labels[step];

    recipeTextEl.appendChild(box);

    if(
      index <
      currentRecipe.length - 1
    ){

      const arrow =
        document.createElement("div");

      arrow.className =
        "arrow";

      arrow.textContent = "→";

      recipeTextEl.appendChild(arrow);
    }

  });

}

function createOrder(){

  currentOrder =
    randomOrder();

  currentRecipe =
    recipes[currentOrder];

  progress = 0;

  customerEl.textContent =
    randomCustomer();

  orderNameEl.textContent =
    currentOrder;

  renderRecipe();

  if(navigator.vibrate){

    navigator.vibrate(40);
  }

}

function updateUI(){

  scoreEl.textContent =
    score;

  timeEl.textContent =
    time;
}

function showPopup(text,type){

  popup.textContent =
    text;

  popup.className =
    `show ${type}`;

  setTimeout(()=>{

    popup.className = "";

  },500);

}

function setTaisho(type){

  kitchenImage.src =
    `hakotarou_${type}.png`;

  setTimeout(()=>{

    kitchenImage.src =
      "hakotarou_normal.png";

  },500);

}

function startGame(){

  seIn.currentTime = 0;
  seIn.play();

  bgm.currentTime = 0;
  bgm.play();

  score = 0;

  time = 60;

  progress = 0;

  updateUI();

  createOrder();

  titleScreen.classList.remove("active");

  resultScreen.classList.remove("active");

  gameScreen.classList.add("active");

  clearInterval(timer);

  timer = setInterval(()=>{

    time--;

    updateUI();

    if(time <= 0){

      endGame();
    }

  },1000);

}

function success(){

  seGood.currentTime = 0;
  seGood.play();

  setTaisho("good");

  showPopup(
    "成功！",
    "success"
  );

  score++;

  updateUI();

  setTimeout(()=>{

    createOrder();

  },250);

}

function miss(){

  seBad.currentTime = 0;
  seBad.play();

  setTaisho("bad");

  showPopup(
    "失敗！",
    "miss"
  );

  progress = 0;

  renderRecipe();

}

document
  .querySelectorAll(".cookBtn")
  .forEach(btn=>{

    btn.addEventListener(
      "click",
      ()=>{

        const action =
          btn.dataset.action;

        if(
          currentRecipe[
            progress
          ] === action
        ){

          progress++;

          renderRecipe();

          if(
            progress >=
            currentRecipe.length
          ){

            success();
          }

        }else{

          miss();
        }

      }
    );

  });

document
  .getElementById("cancelBtn")
  .addEventListener(
    "click",
    ()=>{

      progress = 0;

      renderRecipe();

    }
  );

function endGame(){

  clearInterval(timer);

  bgm.pause();

  seOut.currentTime = 0;
  seOut.play();

  gameScreen.classList.remove("active");

  resultScreen.classList.add("active");

  finalScoreEl.textContent =
    `${score}人前`;

  if(score >= 45){

    rankEl.textContent =
      "爆速製麺王";

    commentEl.textContent =
      "行列が止まらない。";

  }else if(score >= 25){

    rankEl.textContent =
      "行列名人";

    commentEl.textContent =
      "今日も大繁盛！";

  }else{

    rankEl.textContent =
      "見習い大将";

    commentEl.textContent =
      "まだまだ修行中。";
  }

}

shareBtn.addEventListener(
  "click",
  ()=>{

    const text =
`🍜 ${score}人前さばいた！

箱太郎伝説

${rankEl.textContent}

https://afoolhippo.github.io/

#箱太郎伝説
#カバゲーセン`;

    const url =
      "https://twitter.com/intent/tweet?text="
      + encodeURIComponent(text);

    window.open(
      url,
      "_blank"
    );

  }
);

retryBtn.addEventListener(
  "click",
  ()=>{

    startGame();

  }
);

homeBtn.addEventListener(
  "click",
  ()=>{

    location.href =
      "https://afoolhippo.github.io/home/";

  }
);

backBtn.addEventListener(
  "click",
  ()=>{

    clearInterval(timer);

    bgm.pause();

    gameScreen.classList.remove("active");

    titleScreen.classList.add("active");

  }
);

titleImage.addEventListener(
  "click",
  ()=>{

    startGame();

  }
);