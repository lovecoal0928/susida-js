const QuestionIndex = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const answerTimer = document.getElementById("answerTimer");

// Audioファイルの読み込み
const typeSound = new Audio("./Audio/typing.mp3");
const correctSound = new Audio("./Audio/correct.mp3");
const incorrectSound = new Audio("./Audio/incorrect.mp3");
typeSound.volume = 0.1;
correctSound.volume = 0.3;
incorrectSound.volume = 0.05;

// inputテキスト入力が合っているかどうかを判定
typeInput.addEventListener("input", () => {
    // タイピング音
    typeSound.play();
    typeSound.currentTime = 0;

    // 問題とinputの中身をそれぞれ取得
    const sentenceArray = typeDisplay.querySelectorAll("span");
    const arrayValue = typeInput.value.split("");

    // 正解のフラグ（初期値）
    let correct = true;

    // 比較
    sentenceArray.forEach((characterSpan, index) => {
        // 未入力（黒字）
        if((arrayValue[index] == null)){
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        // 正解（緑字）
        }else if(characterSpan.innerText == arrayValue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        // 不正解（赤字）
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");
            correct = false;
            
            incorrectSound.play();
            incorrectSound.currentTime = 0;
        }
    });
    if(correct) {
        correctSound.play();
        correctSound.currentTime = 0;
        nextTimer();
    }
});

// 非同期処理で問題を取得
function GetRandomSentence() {
    return fetch(QuestionIndex)
    .then((response) => response.json())
    .then((data) => data.content);
}

// 問題を取得して表示する
async function RenderNextSentence() {
    const sentence = await GetRandomSentence();
    console.log(sentence);
    // 問題の表示
    typeDisplay.innerText = "";

    // 文章を一文字ずつ分解
    let oneText = sentence.split("");

    oneText.forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        typeDisplay.appendChild(characterSpan);
    });

    // テキストボックスの中身を消す
    typeInput.value = null;

    // 次の問題が呼ばれたらタイマーを動かす
    StartAnswerTimer();
}

// 開始時間の定義
let startTime;

// 解答時間
let answerTime = 2000;

// 解答時間のロジック
function StartAnswerTimer() {
    answerTimer.value = answerTime;
    startTime = new Date();
    // 1msずつプログレスバーを削る表示
    setInterval(() => {
        if (answerTimer.value > 0) {
            answerTimer.value = answerTime - getTimerTime();
        }
        if (answerTimer.value <= 1000 && answerTimer.value > 500) {
            answerTimer.classList.add("half");
        }else if (answerTimer.value <= 500 && answerTimer.value > 0) {
            answerTimer.classList.add("quarter");
            answerTimer.classList.remove("half");
        }else if (answerTimer.value <= 0) {
            nextTimer();
        }
    }, 10);
}
function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 10
  ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}

// タイムアップ時に次の問題を呼び出す
function nextTimer() {
    setInterval(() => {
        answerTimer.classList.remove("quarter");
        answerTimer.classList.remove("half");
        RenderNextSentence();
    }, 100);
}
