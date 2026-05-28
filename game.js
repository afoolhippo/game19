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

const GAME_ID = "game_hakotarou";
const GAME_TITLE = "箱太郎伝説";

const SUPABASE_URL =
  "https://gmncxnybsovlallxgnkd.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ly3h5OhL8HDSHhYdmJq_Fw_9pG3mhla";

const kabaDb =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

const bgm = new Audio("bgm.mp3");
const seGood = new Audio("se_good.mp3");
const seBad = new Audio("se_bad.mp3");
const seIn = new Audio("se_in.mp3");
const seOut = new Audio("se_out.mp3");

bgm.loop = false;
bgm.volume = 0.45;

seGood.volume = 0.3;
seBad.volume = 0.3;

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

const startBtn =
  document.getElementById("startBtn");

const shareBtn =
  document.getElementById("shareBtn");

const registerBtn =
  document.getElementById("registerBtn");

const retryBtn =
  document.getElementById("retryBtn");

const homeBtn =
  document.getElementById("homeBtn");

const backBtn =
  document.getElementById("backBtn");

const resultButtons =
  document.getElementById("resultButtons");

const scoreEl =
  document.getElementById("score");

const timeEl =
  document.getElementById("time");

const customerEl =
  document.getElementById("customer");

const customerWrap =
  document.getElementById("customerWrap");

const speech =
  document.getElementById("speech");

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

  "うどん":[
    "men",
    "beef",
    "gyushi",
    "negi"
  ],

  "月見うどん":[
    "men",
    "beef",
    "gyushi",
    "negi",
    "egg"
  ],

  "チャニボ":[
    "men",
    "chamibuta",
    "negi",
    "niboshi"
  ],

  "かすうどん":[
    "men",
    "kasu",
    "negi"
  ],

  "浅利バター":[
    "men",
    "asari",
    "negi"
  ],

  "めし":[
    "gohan"
  ],

  "TKG":[
    "gohan",
    "egg"
  ],

  "うどんよもぎ麺":[
    "yomogi",
    "beef",
    "gyushi",
    "negi"
  ]
};

const recipeNames = [

  "うどん",
  "うどん",
  "うどん",

  "月見うどん",
  "月見うどん",

  "チャニボ",

  "かすうどん",

  "浅利バター",

  "めし",

  "TKG",

  "うどんよもぎ麺"

];

const labels = {

  men:"麺",
  yomogi:"よもぎ麺",
  beef:"牛肉",
  gyushi:"牛脂",
  chamibuta:"茶美豚",
  niboshi:"煮干脂",
  kasu:"かす",
  asari:"あさり",
  negi:"ネギ",
  egg:"卵",
  gohan:"ごはん"
};

const recipeNamesLength =
  recipeNames.length;

let currentOrder = "";

let currentRecipe = [];

let progress = 0;

let score = 0;

let time = 80;

let timer;

let scoreRegistered = false;

function randomOrder(){

  return recipeNames[
    Math.floor(
      Math.random() *
      recipeNamesLength
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

    if(index < currentRecipe.length - 1){

      const arrow =
        document.createElement("div");

      arrow.className =
        "arrow";

      arrow.textContent = "→";

      recipeTextEl.appendChild(arrow);
    }

  });
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

  },700);
}

function setTaisho(type){

  kitchenImage.src =
    `hakotarou_${type}.png`;
}

function resetTaisho(){

  kitchenImage.src =
    "hakotarou_normal.png";
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

  speech.classList.remove("show");
  customerWrap.classList.remove("hide");

  if(navigator.vibrate){

    navigator.vibrate(40);
  }

  setTimeout(()=>{

    customerWrap.classList.add("show");

  },50);

  setTimeout(()=>{

    speech.classList.add("show");

  },350);
}

function nextCustomer(){

  speech.classList.remove("show");

  customerWrap.classList.remove("show");

  customerWrap.classList.add("hide");

  setTimeout(()=>{

    resetTaisho();

    createOrder();

  },500);
}

function resetRegisterButton(){

  scoreRegistered = false;

  registerBtn.disabled = false;

  registerBtn.textContent =
    "記録を登録";

  resultButtons.classList.add("hidden");
}

function showResultButtonsLater(){

  resultButtons.classList.add("hidden");

  setTimeout(()=>{

    resultButtons.classList.remove("hidden");

  },1500);
}

function startGame(){

  seIn.currentTime = 0;
  seIn.play();

  bgm.currentTime = 0;
  bgm.play();

  score = 0;

  time = 80;

  progress = 0;

  currentRecipe = [];

  updateUI();

  resetRegisterButton();

  popup.className = "";

  speech.classList.remove("show");

  customerWrap.classList.remove("show");
  customerWrap.classList.add("hide");

  resetTaisho();

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

  setTimeout(()=>{

    createOrder();

  },5000);
}

function success(){

  seGood.currentTime = 0;
  seGood.play();

  setTaisho("good");

  showPopup(
    "あいよ！",
    "success"
  );

  score++;

  updateUI();

  setTimeout(()=>{

    nextCustomer();

  },1200);
}

function miss(){

  seBad.currentTime = 0;
  seBad.play();

  setTaisho("bad");

  showPopup(
    "💦💦",
    "miss"
  );

  progress = 0;

  renderRecipe();

  setTimeout(()=>{

    resetTaisho();

  },1200);
}

document
  .querySelectorAll(".cookBtn")
  .forEach(btn=>{

    btn.addEventListener(
      "click",
      ()=>{

        const action =
          btn.dataset.action;

        if(currentRecipe.length === 0){
          return;
        }

        if(currentRecipe[progress] === action){

          progress++;

          renderRecipe();

          if(progress >= currentRecipe.length){

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

  currentRecipe = [];

  bgm.pause();

  seOut.currentTime = 0;
  seOut.play();

  gameScreen.classList.remove("active");

  resultScreen.classList.add("active");

  finalScoreEl.textContent =
    `${score}人前`;

  if(score >= 15){

    rankEl.textContent =
      "史上最高杯数";

    commentEl.textContent =
      "今日も大繁盛！";

  }else if(score >= 8){

    rankEl.textContent =
      "大行列";

    commentEl.textContent =
      "行列が止まらない！";

  }else{

    rankEl.textContent =
      "見習い大将";

    commentEl.textContent =
      "まだまだ修行中。";
  }

  showResultButtonsLater();
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

registerBtn.addEventListener(
  "click",
  async ()=>{

    if(scoreRegistered){

      alert("この記録は登録済みです");

      return;
    }

    const nickname =
      prompt(
        "ニックネームを入力してね",
        "匿名カバ"
      );

    if(!nickname){
      return;
    }

    registerBtn.disabled = true;

    registerBtn.textContent =
      "登録中...";

    const { error } =
      await kabaDb
        .from("kaba_scores")
        .insert({
          game_id: GAME_ID,
          game_title: GAME_TITLE,
          nickname: nickname,
          rank_title: rankEl.textContent,
          score: score
        });

    if(error){

      console.error(error);

      registerBtn.disabled = false;

      registerBtn.textContent =
        "記録を登録";

      alert("登録に失敗しました");

      return;
    }

    scoreRegistered = true;

    registerBtn.textContent =
      "登録済み";

    alert("記録を登録しました！");
  }
);

retryBtn.addEventListener(
  "click",
  ()=>{

    clearInterval(timer);

    bgm.pause();

    resultScreen.classList.remove("active");

    titleScreen.classList.add("active");
  }
);

homeBtn.addEventListener(
  "click",
  ()=>{

    location.href =
      "https://afoolhippo.github.io/home/?skipTitle=1";
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

startBtn.addEventListener(
  "click",
  ()=>{

    startGame();
  }
);