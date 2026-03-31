let page = 1;
let cnv;

// --------------------
// 이미지
// --------------------
let diceSheet = null;
let diceFrames = [];
const DICE_COLS = 5;
const DICE_ROWS = 2;
const HOME_DICE_FRAME = 0;

// 실제 숫자와 정확히 일치하는 이미지 세트가 아니라서
// 시각용 프레임만 연결하고, 실제 결과는 아래 숫자로 표시합니다.
let valueFrameMap = [0, 0, 5, 2, 7, 9, 4];

// --------------------
// 홈
// --------------------
let homeIcons = [];

// --------------------
// 주사위
// --------------------
let diceA;
let diceB;

// --------------------
// 직업 카드
// --------------------
let jobDeck = [];
let myCards = [];
let selectedCard = null;
let flyingCard = null;
let nextCardId = 1;


// --------------------
// 경제 용어 카드
// --------------------
let econRawTerms = [];
let econTerms = [];
let econCategories = ["전체", "기초경제", "소비생활", "금융", "투자", "기업과창업", "정부와세금", "무역과세계", "환경과미래"];
let econActiveCategory = "전체";
let econCards = [];
let econCurrentIndex = 0;
let econFlipProgress = 0;
let econFlipTarget = 0;

const CARD_W = 130;
const CARD_H = 180;
const MAX_HAND = 5;

// ======================================================
// preload
// ======================================================
function preload() {
  diceSheet = loadImage(
    "2307-w019-n002-1160B-p15-1160.jpg",
    () => {},
    () => {
      console.warn("주사위 이미지를 불러오지 못했습니다.");
      diceSheet = null;
    }
  );
}

// ======================================================
// setup / resize
// ======================================================
function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style("display", "block");

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CORNER);

  buildDiceFrames();
  setupHomeIcons();
  setupJobDeck();
  setupDice();
  initEconomyCards();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ======================================================
// 초기 데이터
// ======================================================
function setupHomeIcons() {
  homeIcons = [
    {
      type: "dice",
      label: "주사위",
      action: () => {
        page = 2;
      }
    },
    {
      type: "job",
      label: "직업카드",
      action: () => {
        page = 3;
      }
    },
    {
      type: "robot",
      label: "청소로봇",
      action: () => {
        initRobotGame();
        page = 4;
      }
    },
    {
      type: "economy",
      label: "경제용어",
      action: () => {
        initEconomyCards();
        page = 5;
      }
    }
  ];
}

function setupDice() {
  diceA = createDice(width / 2 - 140, height / 2, 240);
  diceB = createDice(width / 2 + 140, height / 2, 240);

  diceA.value = floor(random(1, 7));
  diceB.value = floor(random(1, 7));

  diceA.frameIndex = valueFrameMap[diceA.value];
  diceB.frameIndex = valueFrameMap[diceB.value];
}

function setupJobDeck() {
  jobDeck = [
    {
      title: "퍼실리테이터",
      emoji: "🗣️",
      summary: "사람들이 의견을 나누고 함께 결정하도록 돕는 역할",
      description: "퍼실리테이터는 회의, 수업, 토론에서 사람들이 편하게 말하고 함께 생각을 정리할 수 있도록 돕는 사람입니다. 직접 정답을 말하기보다 질문을 던지고 대화를 이끌어 모두가 참여하도록 돕습니다."
    },
    {
      title: "게임기획자",
      emoji: "🎮",
      summary: "게임의 규칙, 이야기, 목표를 설계하는 사람",
      description: "게임기획자는 어떤 캐릭터가 나오고, 어떤 규칙으로 진행되며, 어떤 미션을 수행하는지 계획합니다. 사람들이 재미있게 게임할 수 있도록 전체 구조를 만드는 직업입니다."
    },
    {
      title: "드론조종사",
      emoji: "🚁",
      summary: "드론을 조종해 촬영·점검·탐사를 하는 사람",
      description: "드론조종사는 드론을 안전하게 조종하여 사진과 영상을 찍거나 시설을 점검하고 넓은 지역을 살펴보는 일을 합니다. 기술 이해와 안전수칙이 모두 중요합니다."
    },
    {
      title: "데이터사이언티스트",
      emoji: "📊",
      summary: "많은 정보를 분석해 의미 있는 답을 찾는 사람",
      description: "데이터사이언티스트는 다양한 데이터를 분석하여 사람들이 궁금해하는 문제의 답을 찾습니다. 어떤 상품이 인기 있는지, 어떤 변화가 생길지를 예측하는 데 도움을 줍니다."
    },
    {
      title: "스마트팜관리자",
      emoji: "🌱",
      summary: "기술을 활용해 농작물을 효율적으로 키우는 사람",
      description: "스마트팜관리자는 온도, 습도, 빛, 물의 양을 자동으로 조절하는 시스템을 활용해 작물을 키웁니다. 농업과 기술을 함께 이해해야 하는 직업입니다."
    },
    {
      title: "로봇개발자",
      emoji: "🤖",
      summary: "사람을 돕는 로봇을 설계하고 만드는 사람",
      description: "로봇개발자는 로봇이 어떤 움직임을 하고 어떤 일을 할지 설계합니다. 기계, 전자, 소프트웨어를 함께 활용해 실제로 작동하는 로봇을 만드는 직업입니다."
    },
    {
      title: "웹툰작가",
      emoji: "✍️",
      summary: "그림과 이야기로 웹툰을 만드는 사람",
      description: "웹툰작가는 등장인물, 이야기, 장면 구성을 생각하고 그림과 글로 작품을 완성합니다. 창의적인 아이디어와 꾸준히 작업하는 힘이 중요합니다."
    },
    {
      title: "환경컨설턴트",
      emoji: "♻️",
      summary: "환경 문제를 줄일 방법을 제안하는 사람",
      description: "환경컨설턴트는 공기, 물, 쓰레기, 에너지 같은 환경 문제를 살펴보고 더 나은 방법을 제안합니다. 기관이나 기업이 환경을 덜 해치도록 돕는 역할을 합니다."
    },
    {
      title: "도서관사서",
      emoji: "📚",
      summary: "책과 정보를 찾기 쉽게 정리하고 안내하는 사람",
      description: "도서관사서는 책을 분류하고, 필요한 자료를 찾도록 도와주며, 독서 프로그램을 운영하기도 합니다. 단순히 책을 보관하는 것이 아니라 정보를 연결해 주는 역할입니다."
    },
    {
      title: "기상연구원",
      emoji: "🌦️",
      summary: "날씨와 기후를 연구하고 예측하는 사람",
      description: "기상연구원은 비, 바람, 온도, 구름 같은 자료를 분석해 날씨 변화를 연구합니다. 재난 대비와 생활 정보 제공에도 중요한 역할을 합니다."
    },
    {
      title: "수의사",
      emoji: "🐶",
      summary: "동물의 건강을 돌보고 치료하는 사람",
      description: "수의사는 반려동물과 다양한 동물의 건강을 살피고 치료합니다. 예방접종, 검사, 수술 등 동물의 생명을 지키는 중요한 일을 합니다."
    },
    {
      title: "특수교사",
      emoji: "🧩",
      summary: "학생의 특성과 필요에 맞게 배우도록 돕는 교사",
      description: "특수교사는 학생마다 다른 학습 방법과 지원이 필요하다는 점을 고려해 맞춤형 수업을 진행합니다. 학생이 스스로 성장하도록 돕는 중요한 역할을 합니다."
    },
    {
      title: "도시재생전문가",
      emoji: "🏙️",
      summary: "오래된 지역을 더 살기 좋게 바꾸는 사람",
      description: "도시재생전문가는 낡은 건물, 골목, 지역 시설을 새롭게 바꾸는 계획을 세웁니다. 주민들이 더 편리하고 안전하게 생활할 수 있도록 공간을 다시 디자인합니다."
    },
    {
      title: "유전자연구원",
      emoji: "🧬",
      summary: "생명체의 유전 정보를 연구하는 사람",
      description: "유전자연구원은 생명체의 특징과 질병, 유전 원리를 연구합니다. 의학, 생명과학, 농업 등 여러 분야에서 중요한 정보를 찾는 역할을 합니다."
    },
    {
      title: "소방관",
      emoji: "🚒",
      summary: "화재와 사고 현장에서 사람을 돕고 구조하는 사람",
      description: "소방관은 화재를 끄는 일뿐 아니라 사고 현장에서 구조 활동을 하고 응급 상황에 대응합니다. 사람들의 생명과 안전을 지키는 매우 중요한 직업입니다."
    }
  ];
}

// ======================================================
// draw
// ======================================================
function draw() {
  drawBackground();

  if (page === 1) {
    drawHomePage();
  } else if (page === 2) {
    updateDiceAnimation(diceA);
    updateDiceAnimation(diceB);
    drawDicePage();
  } else if (page === 3) {
    updateFlyingCard();
    drawJobCardPage();
  } else if (page === 4) {
    drawRobotPage();
  } else if (page === 5) {
    updateEconomyFlip();
    drawEconomyPage();
  }
}

// ======================================================
// mouse
// ======================================================
function mousePressed() {
  if (page === 1) {
    checkHomeIconClick();
  } else if (page === 2) {
    handleDicePageClick();
  } else if (page === 3) {
    handleJobPageClick();
  } else if (page === 4) {
    handleRobotPageClick();
  } else if (page === 5) {
    handleEconomyPageClick();
  }
}

// ======================================================
// 공통 배경
// ======================================================
function drawBackground() {
  background(243, 246, 251);

  noStroke();
  fill(232, 238, 246);
  ellipse(width * 0.10, height * 0.27, min(width * 0.18, 260), min(width * 0.18, 260));
  ellipse(width * 0.88, height * 0.25, min(width * 0.14, 220), min(width * 0.14, 220));
  ellipse(width * 0.50, -10, min(width * 0.45, 520), 120);
  ellipse(width * 0.50, height + 40, min(width * 0.75, 980), 260);
}

// ======================================================
// 이미지 프레임
// ======================================================
function buildDiceFrames() {
  diceFrames = [];

  if (!diceSheet || !diceSheet.width || !diceSheet.height) {
    for (let i = 0; i < DICE_COLS * DICE_ROWS; i++) {
      diceFrames.push({ sx: 0, sy: 0, sw: 0, sh: 0 });
    }
    return;
  }

  let cellW = diceSheet.width / DICE_COLS;
  let cellH = diceSheet.height / DICE_ROWS;

  for (let r = 0; r < DICE_ROWS; r++) {
    for (let c = 0; c < DICE_COLS; c++) {
      diceFrames.push({
        sx: c * cellW,
        sy: r * cellH,
        sw: cellW,
        sh: cellH
      });
    }
  }
}

// ======================================================
// 1. 홈 화면
// ======================================================
function drawHomePage() {
  fill(35);
  textSize(clampText(28, 40));
  text("시작 화면", width / 2, height * 0.14);

  fill(92);
  textSize(clampText(16, 20));
  text("아이콘을 눌러 기능을 선택하세요", width / 2, height * 0.19);

  let layout = getHomeLayout();
  drawCenteredIcons(homeIcons, layout.centerX, layout.centerY, layout.iconSize, layout.gap);
}

function getHomeLayout() {
  let iconSize = constrain(min(width, height) * 0.16, 120, 150);
  return {
    centerX: width / 2,
    centerY: height * 0.48,
    iconSize: iconSize,
    gap: iconSize * 0.42
  };
}

function drawCenteredIcons(iconList, centerX, centerY, iconSize, gap) {
  let positions = getCenteredIconPositions(iconList.length, centerX, centerY, iconSize, gap);

  for (let i = 0; i < iconList.length; i++) {
    let x = positions[i].x;
    let y = positions[i].y;
    let hover = isInsideRect(mouseX, mouseY, x, y, iconSize, iconSize + 20);

    noStroke();
    fill(0, 18);
    rect(x, y + 12, iconSize, iconSize + 18, 24);

    stroke(185);
    strokeWeight(2);
    fill(255);
    rect(x, y + (hover ? -4 : 0), iconSize, iconSize + 18, 24);

    if (iconList[i].type === "dice") {
      drawHomeDiceIcon(x, y - 16 + (hover ? -4 : 0), iconSize * 0.62);
    } else if (iconList[i].type === "job") {
      drawHomeJobCardIcon(x, y - 18 + (hover ? -4 : 0), iconSize * 0.56);
    } else if (iconList[i].type === "robot") {
      drawHomeRobotIcon(x, y - 16 + (hover ? -4 : 0), iconSize * 0.58);
    } else if (iconList[i].type === "economy") {
      drawHomeEconomyIcon(x, y - 16 + (hover ? -4 : 0), iconSize * 0.58);
    }

    noStroke();
    fill(40);
    textSize(clampText(16, 18));
    text(iconList[i].label, x, y + 42 + (hover ? -4 : 0));
  }
}

function getCenteredIconPositions(count, centerX, centerY, iconSize, gap) {
  let positions = [];
  let totalWidth = count * iconSize + (count - 1) * gap;
  let startX = centerX - totalWidth / 2 + iconSize / 2;

  for (let i = 0; i < count; i++) {
    positions.push({
      x: startX + i * (iconSize + gap),
      y: centerY
    });
  }

  return positions;
}

function drawHomeDiceIcon(x, y, size) {
  push();
  translate(x, y);
  rotate(-0.08);

  noStroke();
  fill(0, 16);
  ellipse(0, size * 0.52, size * 0.95, size * 0.22);

  if (diceSheet && diceFrames.length > 0 && diceFrames[HOME_DICE_FRAME].sw > 0) {
    imageMode(CENTER);
    let f = diceFrames[HOME_DICE_FRAME];
    image(diceSheet, 0, 0, size, size, f.sx, f.sy, f.sw, f.sh);
  } else {
    fill(255);
    stroke(150);
    strokeWeight(2);
    rect(0, 0, size * 0.8, size * 0.8, 12);
    noStroke();
    fill(40);
    circle(0, 0, 10);
  }

  pop();
}

function drawHomeJobCardIcon(x, y, size) {
  push();
  translate(x, y);
  drawCardBack(8, -8, size, size * 1.2, 0.08);
  drawCardBack(0, 0, size, size * 1.2, -0.03);
  pop();
}



function drawHomeRobotIcon(x, y, size) {
  push();
  translate(x, y);

  noStroke();
  fill(0, 16);
  ellipse(0, size * 0.56, size * 0.92, size * 0.18);

  fill(217, 234, 255);
  stroke(103, 145, 212);
  strokeWeight(2);
  rect(0, -4, size * 0.9, size * 0.72, 16);

  line(-size * 0.14, -size * 0.42, 0, -size * 0.3);
  noStroke();
  fill(103, 145, 212);
  circle(-size * 0.16, -size * 0.46, 8);

  fill(255);
  rect(0, -8, size * 0.54, size * 0.28, 10);
  fill(76, 104, 168);
  circle(-size * 0.1, -8, 8);
  circle(size * 0.1, -8, 8);
  rect(0, size * 0.08, size * 0.18, 4, 2);

  stroke(103, 145, 212);
  strokeWeight(3);
  line(-size * 0.18, size * 0.28, -size * 0.18, size * 0.48);
  line(size * 0.18, size * 0.28, size * 0.18, size * 0.48);
  line(-size * 0.34, 0, -size * 0.18, size * 0.08);
  line(size * 0.34, 0, size * 0.18, size * 0.08);

  noStroke();
  fill(255, 210, 90);
  rect(size * 0.3, size * 0.2, size * 0.18, size * 0.22, 6);
  fill(130);
  rect(size * 0.3, size * 0.1, size * 0.18, size * 0.05, 3);

  pop();
}


function drawHomeEconomyIcon(x, y, size) {
  push();
  translate(x, y);

  noStroke();
  fill(0, 16);
  ellipse(0, size * 0.56, size * 0.92, size * 0.18);

  stroke(95, 132, 192);
  strokeWeight(2);
  fill(255);
  rect(0, 0, size * 0.82, size * 1.02, 18);

  noStroke();
  fill(232, 241, 255);
  rect(0, -size * 0.12, size * 0.66, size * 0.22, 10);

  fill(61, 98, 163);
  textSize(size * 0.14);
  text("경제", 0, -size * 0.12);

  stroke(95, 132, 192);
  strokeWeight(3);
  line(-size * 0.22, size * 0.12, -size * 0.22, size * 0.28);
  line(-size * 0.05, 0, -size * 0.05, size * 0.28);
  line(size * 0.12, size * 0.08, size * 0.12, size * 0.28);
  line(size * 0.29, -size * 0.04, size * 0.29, size * 0.28);

  noStroke();
  fill(95, 132, 192);
  circle(-size * 0.22, size * 0.12, size * 0.07);
  circle(-size * 0.05, 0, size * 0.07);
  circle(size * 0.12, size * 0.08, size * 0.07);
  circle(size * 0.29, -size * 0.04, size * 0.07);

  pop();
}

function checkHomeIconClick() {
  let layout = getHomeLayout();
  let positions = getCenteredIconPositions(homeIcons.length, layout.centerX, layout.centerY, layout.iconSize, layout.gap);

  for (let i = 0; i < homeIcons.length; i++) {
    if (isInsideRect(mouseX, mouseY, positions[i].x, positions[i].y, layout.iconSize, layout.iconSize + 20)) {
      homeIcons[i].action();
      return;
    }
  }
}

// ======================================================
// 2. 주사위 페이지
// ======================================================
function getDiceLayout() {
  let diceSize = constrain(min(width, height) * 0.24, 180, 260);
  let centerX = width / 2;
  let centerY = height * 0.56;
  let gap = diceSize * 1.05;

  return {
    diceSize: diceSize,
    x1: centerX - gap / 2,
    x2: centerX + gap / 2,
    y: centerY,
    resultY: centerY + diceSize / 2 + 95
  };
}

function drawDicePage() {
  let layout = getDiceLayout();

  diceA.x = layout.x1;
  diceA.y = layout.y;
  diceA.size = layout.diceSize;

  diceB.x = layout.x2;
  diceB.y = layout.y;
  diceB.size = layout.diceSize;

  fill(35);
  textSize(clampText(28, 34));
  text("주사위", width / 2, 60);

  fill(92);
  textSize(clampText(16, 18));
  if (diceA.animating || diceB.animating) {
    text("주사위를 굴리는 중입니다", width / 2, 95);
  } else {
    text("주사위를 클릭하면 굴러갑니다", width / 2, 95);
  }

  drawButton(80, 45, 120, 44, "뒤로가기");

  drawImageDice(diceA);
  drawImageDice(diceB);

  drawDiceResultPanel(width / 2, layout.resultY);

  fill(80);
  textSize(clampText(14, 17));
  text("이미지 주사위 + 굴러가는 애니메이션이 적용된 버전입니다", width / 2, layout.resultY + 62);
}

function createDice(x, y, size) {
  return {
    x: x,
    y: y,
    size: size,
    value: 1,
    frameIndex: 0,
    targetValue: 1,
    timer: 0,
    duration: 0,
    animating: false,
    rot: 0,
    scaleNow: 1,
    bounceY: 0,
    finalFrame: 0
  };
}

function handleDicePageClick() {
  if (isInsideRect(mouseX, mouseY, 80, 45, 120, 44)) {
    page = 1;
    return;
  }

  let layout = getDiceLayout();
  let hitSize = layout.diceSize + 40;

  if (
    isInsideRect(mouseX, mouseY, layout.x1, layout.y, hitSize, hitSize) ||
    isInsideRect(mouseX, mouseY, layout.x2, layout.y, hitSize, hitSize)
  ) {
    startDiceRoll();
  }
}

function startDiceRoll() {
  if (diceA.animating || diceB.animating) return;

  startSingleDiceRoll(diceA, int(random(30, 42)));
  startSingleDiceRoll(diceB, int(random(34, 46)));
}

function startSingleDiceRoll(d, dur) {
  d.animating = true;
  d.timer = 0;
  d.duration = dur;
  d.targetValue = floor(random(1, 7));
  d.finalFrame = valueFrameMap[d.targetValue];
}

function updateDiceAnimation(d) {
  if (!d.animating) {
    d.rot *= 0.82;
    d.scaleNow = lerp(d.scaleNow, 1, 0.2);
    d.bounceY = lerp(d.bounceY, 0, 0.2);
    return;
  }

  d.timer++;

  if (diceFrames.length > 0) {
    d.frameIndex = floor(random(diceFrames.length));
  }

  d.rot = sin(frameCount * 0.55 + d.x * 0.01) * 0.18;
  d.scaleNow = 1 + abs(sin(d.timer * 0.45)) * 0.06;
  d.bounceY = abs(sin(d.timer * 0.38)) * 18;

  if (d.timer >= d.duration) {
    d.animating = false;
    d.value = d.targetValue;
    d.frameIndex = d.finalFrame;
    d.rot = 0;
    d.scaleNow = 1;
    d.bounceY = 0;
  }
}

function drawImageDice(d) {
  let boxSize = d.size;
  let boxX = d.x;
  let boxY = d.y - d.bounceY;

  let boxLeft = boxX - boxSize / 2;
  let boxTop = boxY - boxSize / 2;

  let clipLeftPad = 4;
  let clipRightPad = 4;
  let clipTopPad = 16;
  let clipBottomPad = 4;

  let imgSize = d.size * 0.90;
  let imgYOffset = 18;

  push();

  noStroke();
  fill(255);
  rect(boxX, boxY, boxSize, boxSize, 0);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(
    boxLeft + clipLeftPad,
    boxTop + clipTopPad,
    boxSize - clipLeftPad - clipRightPad,
    boxSize - clipTopPad - clipBottomPad
  );
  drawingContext.clip();

  translate(boxX, boxY);
  rotate(d.rot);
  scale(d.scaleNow);

  imageMode(CENTER);

  if (diceSheet && diceFrames.length > 0 && diceFrames[d.frameIndex].sw > 0) {
    let f = diceFrames[d.frameIndex];
    image(diceSheet, 0, imgYOffset, imgSize, imgSize, f.sx, f.sy, f.sw, f.sh);
  } else {
    fill(255);
    stroke(150);
    strokeWeight(2);
    rect(0, imgYOffset, imgSize * 0.72, imgSize * 0.72, 14);
  }

  drawingContext.restore();

  noStroke();
  fill(255);
  rect(boxX, boxTop + 5, boxSize, 12, 0);

  pop();

  noStroke();
  fill(255);
  rect(d.x, d.y + d.size / 2 + 34, 72, 42, 20);

  fill(35);
  textSize(22);
  text(d.value, d.x, d.y + d.size / 2 + 34);
}

function drawDiceResultPanel(x, y) {
  noStroke();
  fill(0, 14);
  rect(x + 8, y + 8, 270, 82, 18);

  stroke(185);
  strokeWeight(2);
  fill(255);
  rect(x, y, 270, 82, 18);

  noStroke();
  fill(75);
  textSize(clampText(14, 16));
  text("결과", x, y - 16);

  fill(35);
  textSize(clampText(22, 24));
  text(diceA.value + " + " + diceB.value + " = " + (diceA.value + diceB.value), x, y + 18);
}

// ======================================================
// 3. 직업 카드 페이지
// ======================================================
function getJobLayout() {
  let groupW = min(980, width - 80);
  let left = width / 2 - groupW / 2;

  let deckX = left + 90;
  let deckY = height * 0.33;

  let panelW = min(610, groupW - 220);
  panelW = max(panelW, 420);
  let panelH = 320;
  let panelX = left + 220 + panelW / 2;
  let panelY = height * 0.33;

  return {
    deckX,
    deckY,
    panelX,
    panelY,
    panelW,
    panelH
  };
}

function drawJobCardPage() {
  fill(35);
  textSize(clampText(28, 34));
  text("직업 카드", width / 2, 52);

  fill(92);
  textSize(clampText(15, 17));
  text("카드 더미를 눌러 뽑고, 내 카드 중 하나를 눌러 설명을 확인하세요", width / 2, 86);

  drawButton(80, 42, 120, 42, "뒤로가기");
  drawButton(width - 100, 42, 132, 42, "카드 비우기");

  drawDeckArea();
  drawHandArea();
  drawDescriptionPanel();

  if (flyingCard) {
    drawFlyingCard();
  }
}

function drawDeckArea() {
  let layout = getJobLayout();
  let deckX = layout.deckX;
  let deckY = layout.deckY;
  let hover = isInsideRect(mouseX, mouseY, deckX, deckY, CARD_W + 30, CARD_H + 30);

  fill(45);
  textSize(22);
  text("카드 더미", deckX, deckY - 150);

  noStroke();
  fill(0, 16);
  rect(deckX + 10, deckY + 12, CARD_W + 16, CARD_H + 16, 16);

  drawCardBack(deckX + 12, deckY - 10, CARD_W, CARD_H, 0.10);
  drawCardBack(deckX + 6, deckY - 5, CARD_W, CARD_H, 0.05);
  drawCardBack(deckX, deckY + (hover ? -6 : 0), CARD_W, CARD_H, 0);

  fill(90);
  textSize(15);
  if (flyingCard) {
    text("카드가 날아오는 중", deckX, deckY + 118);
  } else if (myCards.length < MAX_HAND) {
    text("클릭해서 1장 뽑기", deckX, deckY + 118);
  } else {
    text("최대 5장까지 보관 가능", deckX, deckY + 118);
  }

  fill(70);
  textSize(15);
  text("내 카드: " + myCards.length + " / " + MAX_HAND, deckX, deckY + 146);
}

function drawCardBack(x, y, w, h, angleValue) {
  push();
  translate(x, y);
  rotate(angleValue);

  stroke(80, 110, 185);
  strokeWeight(2);
  fill(104, 136, 221);
  rect(0, 0, w, h, 14);

  noStroke();
  fill(132, 158, 232);
  rect(0, 0, w - 18, h - 18, 12);

  stroke(255, 150);
  strokeWeight(1.5);
  noFill();
  rect(0, 0, w - 28, h - 28, 10);

  noStroke();
  fill(255, 230);
  textSize(16);
  text("JOB", 0, 40);

  textSize(26);
  text("⭐", 0, -26);

  fill(255, 235);
  circle(-30, -5, 10);
  circle(30, -5, 10);
  circle(-18, 18, 8);
  circle(18, 18, 8);

  pop();
}

function drawHandArea() {
  fill(45);
  textSize(22);
  text("내 앞의 카드", width / 2, height * 0.72 - 40);

  let positions = getHandPositions();

  for (let i = 0; i < MAX_HAND; i++) {
    let x = positions[i].x;
    let y = positions[i].y;

    if (i < myCards.length) {
      let isSelected = selectedCard && selectedCard.id === myCards[i].id;
      drawFrontCard(myCards[i], x, y, isSelected);
    } else {
      stroke(212);
      strokeWeight(2);
      fill(249);
      rect(x, y, CARD_W, CARD_H, 12);

      noStroke();
      fill(175);
      textSize(14);
      text("빈 자리", x, y);
    }
  }
}

function getHandPositions() {
  let positions = [];
  let gap = 18;
  let totalWidth = MAX_HAND * CARD_W + (MAX_HAND - 1) * gap;
  let startX = width / 2 - totalWidth / 2 + CARD_W / 2;
  let y = height * 0.72 + 95;

  for (let i = 0; i < MAX_HAND; i++) {
    positions.push({
      x: startX + i * (CARD_W + gap),
      y: y
    });
  }

  return positions;
}

function drawFrontCard(card, x, y, isSelected) {
  let drawY = isSelected ? y - 12 : y;

  noStroke();
  fill(0, 16);
  rect(x, drawY + 8, CARD_W, CARD_H, 12);

  stroke(isSelected ? 70 : 132);
  strokeWeight(isSelected ? 4 : 2);
  fill(255);
  rect(x, drawY, CARD_W, CARD_H, 12);

  noStroke();
  textSize(38);
  text(card.emoji, x, drawY - 46);

  fill(35);
  textSize(17);
  text(card.title, x, drawY + 14);

  fill(110);
  textSize(12);
  text("눌러서 설명 보기", x, drawY + 60);
}

function drawDescriptionPanel() {
  let layout = getJobLayout();

  let panelX = layout.panelX;
  let panelY = layout.panelY;
  let panelW = layout.panelW;
  let panelH = layout.panelH;

  let left = panelX - panelW / 2;
  let top = panelY - panelH / 2;
  let pad = 28;
  let innerW = panelW - pad * 2;

  noStroke();
  fill(0, 16);
  rect(panelX + 8, panelY + 8, panelW, panelH, 18);

  stroke(182);
  strokeWeight(2);
  fill(255);
  rect(panelX, panelY, panelW, panelH, 18);

  if (!selectedCard) {
    push();
    textAlign(CENTER, CENTER);
    noStroke();
    fill(120);
    textSize(22);
    text("카드를 선택하세요", panelX, panelY - 24);

    fill(142);
    textSize(16);
    text("내 앞에 놓인 직업카드를 누르면\n이곳에 직업 설명이 표시됩니다.", panelX, panelY + 34);
    pop();
    return;
  }

  push();
  textAlign(LEFT, TOP);

  noStroke();
  fill(35);
  textSize(28);
  text(selectedCard.emoji + " " + selectedCard.title, left + pad, top + 22);

  fill(90);
  textSize(15);
  text("한 줄 소개", left + pad, top + 78);

  fill(45);
  textSize(17);
  drawWrappedTextBlock(selectedCard.summary, left + pad, top + 104, innerW, 26, 2);

  fill(90);
  textSize(15);
  text("직업 설명", left + pad, top + 162);

  fill(45);
  textSize(16);
  drawWrappedTextBlock(selectedCard.description, left + pad, top + 188, innerW, 24, 4);

  pop();
}

function drawWrappedTextBlock(str, x, y, maxWidth, lineHeight, maxLines) {
  let lines = [];
  let current = "";
  let chars = Array.from(str);

  for (let i = 0; i < chars.length; i++) {
    let ch = chars[i];

    if (ch === "\n") {
      lines.push(current);
      current = "";
      continue;
    }

    let testLine = current + ch;

    if (textWidth(testLine) > maxWidth && current !== "") {
      lines.push(current);
      current = ch;

      if (maxLines && lines.length >= maxLines) {
        break;
      }
    } else {
      current = testLine;
    }
  }

  if ((!maxLines || lines.length < maxLines) && current !== "") {
    lines.push(current);
  }

  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
  }

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + i * lineHeight);
  }
}

function handleJobPageClick() {
  if (isInsideRect(mouseX, mouseY, 80, 42, 120, 42)) {
    page = 1;
    return;
  }

  if (isInsideRect(mouseX, mouseY, width - 100, 42, 132, 42)) {
    if (!flyingCard) {
      myCards = [];
      selectedCard = null;
    }
    return;
  }

  let layout = getJobLayout();

  if (isInsideRect(mouseX, mouseY, layout.deckX, layout.deckY, CARD_W + 30, CARD_H + 30)) {
    startFlyingJobCard();
    return;
  }

  let positions = getHandPositions();
  for (let i = 0; i < myCards.length; i++) {
    if (isInsideRect(mouseX, mouseY, positions[i].x, positions[i].y, CARD_W, CARD_H)) {
      if (selectedCard && selectedCard.id === myCards[i].id) {
        selectedCard = null;
      } else {
        selectedCard = myCards[i];
      }
      return;
    }
  }
}

function startFlyingJobCard() {
  if (flyingCard) return;
  if (myCards.length >= MAX_HAND) return;

  let layout = getJobLayout();
  let slot = getHandPositions()[myCards.length];
  let picked = getRandomJobCard();

  flyingCard = {
    card: picked,
    startX: layout.deckX,
    startY: layout.deckY,
    endX: slot.x,
    endY: slot.y,
    p: 0,
    startRot: random(-0.35, 0.35),
    endRot: random(-0.05, 0.05),
    startScale: 0.86,
    endScale: 1.0
  };
}

function updateFlyingCard() {
  if (!flyingCard) return;

  flyingCard.p += 0.08;

  if (flyingCard.p >= 1) {
    flyingCard.p = 1;
    myCards.push(flyingCard.card);
    flyingCard = null;
  }
}

function drawFlyingCard() {
  if (!flyingCard) return;

  let t = easeOutCubic(flyingCard.p);
  let x = lerp(flyingCard.startX, flyingCard.endX, t);
  let y = lerp(flyingCard.startY, flyingCard.endY, t) - sin(t * PI) * 120;
  let rot = lerp(flyingCard.startRot, flyingCard.endRot, t);
  let sc = lerp(flyingCard.startScale, flyingCard.endScale, t);

  push();
  translate(x, y);
  rotate(rot);
  scale(sc);
  drawFrontCardAtOrigin(flyingCard.card);
  pop();
}

function drawFrontCardAtOrigin(card) {
  noStroke();
  fill(0, 16);
  rect(0, 8, CARD_W, CARD_H, 12);

  stroke(132);
  strokeWeight(2);
  fill(255);
  rect(0, 0, CARD_W, CARD_H, 12);

  noStroke();
  textSize(38);
  text(card.emoji, 0, -46);

  fill(35);
  textSize(17);
  text(card.title, 0, 14);

  fill(110);
  textSize(12);
  text("새 카드", 0, 60);
}

function getRandomJobCard() {
  let available = jobDeck.filter(job => {
    return !myCards.some(card => card.title === job.title);
  });

  if (available.length === 0) {
    available = jobDeck;
  }

  let base = random(available);

  return {
    id: nextCardId++,
    title: base.title,
    emoji: base.emoji,
    summary: base.summary,
    description: base.description
  };
}

// ======================================================
// 4. 청소로봇 페이지
// ======================================================
let robotItems = [];
let robotCurrentItem = null;
let robotStage = 1;
let robotScore = 0;
let robotRound = 1;
const robotMaxRounds = 10;
let robotLearnedData = 0;
let robotFeedback = "물건을 보고 먼저 분류해 보세요.";
let robotGuessLabel = "아직 예측 전";
let robotAnswered = false;
let robotFinished = false;

function initRobotGame() {
  robotItems = [
    { name: "종이 쓰레기", type: "trash", visual: "paperTrash", hint: "구겨진 종이라\n모양이 일정하지 않아요." },
    { name: "과자봉지", type: "trash", visual: "wrapper", hint: "먹고 남은\n포장지예요." },
    { name: "지우개 가루", type: "trash", visual: "eraserDust", hint: "작고 흩어진\n쓰레기예요." },
    { name: "연필", type: "tool", visual: "pencil", hint: "글씨를 쓰는\n학용품이에요." },
    { name: "필통", type: "tool", visual: "pencilCase", hint: "학용품을 담는\n통이에요." },
    { name: "공책", type: "tool", visual: "notebook", hint: "얇게 넘길 수 있는\n학용품이에요." },
    { name: "책", type: "tool", visual: "book", hint: "두껍고 오래 쓰는\n물건이에요." }
  ];

  robotStage = 1;
  robotScore = 0;
  robotRound = 1;
  robotLearnedData = 0;
  robotFeedback = "물건을 보고 먼저 분류해 보세요.";
  robotGuessLabel = "아직 예측 전";
  robotAnswered = false;
  robotFinished = false;
  robotCurrentItem = random(robotItems);
}

function getRobotLayout() {
  const contentW = 1020;
  const startX = width / 2 - contentW / 2;

  return {
    backBtn: { x: 92, y: 42, w: 116, h: 40 },

    left: { x: startX, y: 108, w: 200, h: 360 },
    center: { x: startX + 220, y: 108, w: 390, h: 360 },
    right: { x: startX + 630, y: 108, w: 390, h: 360 },

    bottomLeft: { x: startX, y: 495, w: 240, h: 130 },
    bottomMid: { x: startX + 260, y: 495, w: 240, h: 130 },
    bottomRight: { x: startX + 520, y: 495, w: 500, h: 130 },

    feedback: { x: startX, y: 700, w: 1020, h: 40 }
  };
}

function drawRobotPage() {
  if (!robotItems.length || !robotCurrentItem) {
    initRobotGame();
  }

  const ui = getRobotLayout();

  push();
  textAlign(CENTER, CENTER);
  noStroke();
  fill(35);
  textSize(34);
  text("우리 반 청소로봇 AI 체험", width / 2, 22);

  fill(95);
  textSize(16);
  text("첫 화면의 세 번째 아이콘에서 들어온 청소로봇 분류 체험입니다.", width / 2, 62);
  pop();

  drawRobotTopButton(ui.backBtn.x, ui.backBtn.y, ui.backBtn.w, ui.backBtn.h, "뒤로가기");

  drawRobotPanel(ui.left.x, ui.left.y, ui.left.w, ui.left.h, 24);
  drawRobotPanel(ui.center.x, ui.center.y, ui.center.w, ui.center.h, 24);
  drawRobotPanel(ui.right.x, ui.right.y, ui.right.w, ui.right.h, 24);

  drawRobotLeftPanel(ui);
  drawRobotCenterPanel(ui);
  drawRobotRightPanel(ui);

  drawRobotPanel(ui.bottomLeft.x, ui.bottomLeft.y, ui.bottomLeft.w, ui.bottomLeft.h, 24);
  drawRobotPanel(ui.bottomMid.x, ui.bottomMid.y, ui.bottomMid.w, ui.bottomMid.h, 24);
  drawRobotPanel(ui.bottomRight.x, ui.bottomRight.y, ui.bottomRight.w, ui.bottomRight.h, 24);
  drawRobotPanel(ui.feedback.x, ui.feedback.y, ui.feedback.w, ui.feedback.h, 18);

  drawRobotBottomPanels(ui);
}

function drawRobotPanel(x, y, w, h, r) {
  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 12);
  rect(x + 4, y + 6, w, h, r);

  stroke(220);
  strokeWeight(2);
  fill(255);
  rect(x, y, w, h, r);
  pop();
}

function drawRobotLeftPanel(ui) {
  const p = ui.left;

  drawRobotText("청소 구역", p.x, p.y + 14, p.w, 24, 22, CENTER, color(35));

  push();
  rectMode(CORNER);

  const iconBoxW = 120;
  const iconBoxH = 150;
  const iconBoxX = p.x + (p.w - iconBoxW) / 2;
  const iconBoxY = p.y + 95;

  noStroke();
  fill(101, 69, 35);
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(NORMAL);
  text("쓰레기통", iconBoxX + iconBoxW / 2, iconBoxY - 28);

  noFill();
  stroke(239, 168, 53);
  strokeWeight(2);
  rect(iconBoxX, iconBoxY, iconBoxW, iconBoxH, 22);

  noStroke();
  fill(130);
  rect(iconBoxX + 39, iconBoxY + 38, 42, 78, 12);
  rect(iconBoxX + 33, iconBoxY + 28, 54, 14, 10);

  pop();

  drawRobotParagraph(
    "청소로봇은\n교실 바닥의\n물건을 보고,\n쓰레기통으로\n분류합니다.",
    p.x + 24,
    iconBoxY + iconBoxH + 14,
    p.w - 48,
    150,
    16,
    28,
    CENTER,
    color(110)
  );
}

function drawRobotCenterPanel(ui) {
  const p = ui.center;
  const textShift = 90;

  drawRobotText("현재 물건", p.x, p.y + 14, p.w, 24, 22, CENTER, color(35));

  push();
  rectMode(CORNER);
  stroke(220);
  strokeWeight(2);
  fill(248, 250, 253);
  rect(p.x + 20, p.y + 48, p.w - 40, 168, 24);
  pop();

  drawRobotText(robotCurrentItem.name, p.x, p.y + 72, p.w, 24, 24, CENTER, color(35));

  drawRobotItemVisual(robotCurrentItem, p.x + p.w / 2, p.y + 112, 48);

push();
fill(105);
noStroke();
textAlign(LEFT, TOP);
textSize(16);
text("이 물건은 어디로 가야 할까요?", p.x + 130, p.y + 164);
pop();

  drawRobotText("물건 설명", p.x + 20 + textShift, p.y + 248, 90, 20, 15, LEFT, color(80));

  drawRobotParagraph(
    robotCurrentItem.hint,
    p.x + 20 + textShift,
    p.y + 274,
    p.w - 140 - textShift,
    52,
    14,
    22,
    LEFT,
    color(110)
  );

  drawRobotDeskGraphic(p.x + p.w - 74, p.y + 314, 56);
}

function drawRobotRightPanel(ui) {
  const p = ui.right;
  const textShift = 90;

  drawRobotText("청소로봇 판단", p.x, p.y + 14, p.w, 24, 22, CENTER, color(35));

drawRobotParagraph(
  "로봇이 이 물건을 어떻게 판단하는지\n확인해 보세요.",
  p.x + 72,
  p.y + 48,
  p.w - 90,
  42,
  14,
  20,
  LEFT,
  color(95)
);

  drawRobotInfoCard(
    p.x + 18,
    p.y + 96,
    p.w - 36,
    82,
    "로봇의 예측",
    robotGuessLabel,
    robotStage === 1 ? color(219, 80, 20) : color(30, 120, 70),
    17
  );

  drawRobotInfoCard(
    p.x + 18,
    p.y + 190,
    p.w - 36,
    94,
    "학습 정보",
    `라운드: ${robotRound} / ${robotMaxRounds}\n맞힌 개수: ${robotScore}\n학습 데이터: ${robotLearnedData}개`,
    color(80),
    14
  );


}

function drawRobotBottomPanels(ui) {
  const textShift = 90;

  drawRobotText("학생 선택", ui.bottomLeft.x, ui.bottomLeft.y + 14, ui.bottomLeft.w, 22, 20, CENTER, color(35));
  drawRobotText("로봇 학습 단계", ui.bottomMid.x, ui.bottomMid.y + 14, ui.bottomMid.w, 22, 20, CENTER, color(35));
  drawRobotText("진행", ui.bottomRight.x, ui.bottomRight.y + 14, ui.bottomRight.w, 22, 20, CENTER, color(35));

  drawRobotParagraph(
    "먼저 물건이 어디로 가야 하는지 골라 보세요.",
    ui.bottomLeft.x + 16 + textShift,
    ui.bottomLeft.y + 44,
    ui.bottomLeft.w - 32 - textShift,
    36,
    14,
    20,
    LEFT,
    color(110)
  );

  drawRobotParagraph(
    getRobotStageDescription(),
    ui.bottomMid.x + 16 + textShift,
    ui.bottomMid.y + 40,
    ui.bottomMid.w - 32 - textShift,
    44,
    14,
    20,
    CENTER,
    color(110)
  );

push();
fill(110);
noStroke();
textAlign(LEFT, TOP);
textSize(14);
text("다음 물건으로 넘어가거나 처음부터 다시 시작할 수 있어요.", ui.bottomRight.x + 90, ui.bottomRight.y + 50);
pop();

  const buttons = getRobotButtons(ui);
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const hover = robotPointInCenterBox(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h);
    drawRobotActionButton(btn, hover);
  }

  push();
  textAlign(CENTER, CENTER);
  noStroke();
  fill(41, 72, 138);
  textSize(16);
  text(robotFeedback, ui.feedback.x + ui.feedback.w / 2, ui.feedback.y + ui.feedback.h / 2);
  pop();
}

function getRobotButtons(ui) {
  return [
    {
      id: "choiceTrash",
      label: "쓰레기통으로 보내기",
      x: ui.bottomLeft.x + ui.bottomLeft.w / 2,
      y: ui.bottomLeft.y + 92,
      w: 192,
      h: 36,
      disabled: robotAnswered || robotFinished,
      selected: false,
      onClick: () => handleRobotChoice("trash")
    },
    {
      id: "choiceTool",
      label: "책상 위에 두기",
      x: ui.bottomLeft.x + ui.bottomLeft.w / 2,
      y: ui.bottomLeft.y + 130,
      w: 192,
      h: 36,
      disabled: robotAnswered || robotFinished,
      selected: false,
      onClick: () => handleRobotChoice("tool")
    },
    {
      id: "stage1",
      label: "1단계 학습",
      x: ui.bottomMid.x + ui.bottomMid.w / 2 - 54,
      y: ui.bottomMid.y + 118,
      w: 102,
      h: 36,
      disabled: false,
      selected: robotStage === 1,
      onClick: () => setRobotStage(1)
    },
    {
      id: "stage2",
      label: "2단계 학습",
      x: ui.bottomMid.x + ui.bottomMid.w / 2 + 54,
      y: ui.bottomMid.y + 118,
      w: 102,
      h: 36,
      disabled: false,
      selected: robotStage === 2,
      onClick: () => setRobotStage(2)
    },
    {
      id: "reset",
      label: "처음부터",
      x: ui.bottomRight.x + ui.bottomRight.w / 2 - 72,
      y: ui.bottomRight.y + 118,
      w: 120,
      h: 36,
      disabled: false,
      selected: false,
      onClick: () => initRobotGame()
    },
    {
      id: "next",
      label: "다음 물건",
      x: ui.bottomRight.x + ui.bottomRight.w / 2 + 72,
      y: ui.bottomRight.y + 118,
      w: 120,
      h: 36,
      disabled: robotFinished,
      selected: false,
      onClick: () => goRobotNextRound()
    }
  ];
}

function drawRobotActionButton(btn, hover) {
  let fillColor = color(255);
  let strokeColor = color(190);
  let textColor = color(35);

  if (btn.disabled) {
    fillColor = color(238);
    strokeColor = color(210);
    textColor = color(145);
  } else if (btn.selected) {
    if (btn.id === "stage2") {
      fillColor = color(227, 247, 233);
      strokeColor = color(90, 170, 110);
      textColor = color(30, 110, 60);
    } else {
      fillColor = color(230, 240, 255);
      strokeColor = color(90, 140, 220);
      textColor = color(30, 80, 145);
    }
  } else if (hover) {
    fillColor = color(248);
    strokeColor = color(120);
  }

  push();
  rectMode(CENTER);
  noStroke();
  fill(0, 14);
  rect(btn.x, btn.y + 4, btn.w, btn.h, 12);

  stroke(strokeColor);
  strokeWeight(2);
  fill(fillColor);
  rect(btn.x, btn.y, btn.w, btn.h, 12);

  noStroke();
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(btn.label, btn.x, btn.y);
  pop();
}

function drawRobotTopButton(x, y, w, h, label) {
  const hover = robotPointInCenterBox(mouseX, mouseY, x, y, w, h);

  push();
  rectMode(CENTER);
  noStroke();
  fill(0, 14);
  rect(x, y + 4, w, h, 12);

  stroke(120);
  strokeWeight(2);
  fill(hover ? 248 : 255);
  rect(x, y, w, h, 12);

  noStroke();
  fill(40);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(label, x, y);
  pop();
}

function drawRobotInfoCard(x, y, w, h, title, content, contentColor, contentSize) {
  push();
  rectMode(CORNER);
  stroke(220);
  strokeWeight(2);
  fill(246, 248, 252);
  rect(x, y, w, h, 18);

  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(18);
  text(title, x + 14, y + 10);

  fill(contentColor);
  textSize(contentSize);
  text(content, x + 14, y + 38, w - 28, h - 46);
  pop();
}

function drawRobotText(str, x, y, w, h, size, alignMode, fillColorValue) {
  push();
  noStroke();
  fill(fillColorValue || color(110));
  textAlign(alignMode, TOP);
  textSize(size);
  text(str, x, y, w, h);
  pop();
}

function drawRobotParagraph(str, x, y, w, h, size, leadingValue, alignMode, fillColorValue) {
  push();
  noStroke();
  fill(fillColorValue || color(110));
  textAlign(alignMode, TOP);
  textSize(size);
  textLeading(leadingValue);
  text(str, x, y, w, h);
  pop();
}

function handleRobotPageClick() {
  if (robotPointInCenterBox(mouseX, mouseY, 92, 42, 116, 40)) {
    page = 1;
    return;
  }

  const buttons = getRobotButtons(getRobotLayout());
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    if (!btn.disabled && robotPointInCenterBox(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h)) {
      btn.onClick();
      return;
    }
  }
}

function handleRobotChoice(choice) {
  if (robotFinished || robotAnswered || !robotCurrentItem) return;

  const correct = choice === robotCurrentItem.type;
  const robotPrediction = robotClassify(robotCurrentItem);
  robotGuessLabel = robotPrediction === "trash" ? "쓰레기" : "학용품";

  if (correct) {
    robotScore += 1;
    robotLearnedData += 1;
  }

  const userText = correct ? "정답입니다." : "조금 아쉬워요.";
  const robotText =
    robotPrediction === robotCurrentItem.type
      ? ` 로봇도 '${robotGuessLabel}'으로 맞혔어요.`
      : ` 로봇은 '${robotGuessLabel}'으로 예측해서 헷갈렸어요.`;

  robotFeedback = userText + robotText;
  robotAnswered = true;

  if (robotRound === robotMaxRounds) {
    robotFinished = true;
    robotFeedback += " 마지막 문제였습니다. 처음부터를 눌러 다시 시작할 수 있어요.";
  }
}

function goRobotNextRound() {
  if (robotFinished) return;

  if (robotRound >= robotMaxRounds) {
    robotFinished = true;
    robotFeedback = "모든 라운드가 끝났습니다. 처음부터를 눌러 다시 시작하세요.";
    return;
  }

  robotRound += 1;
  robotCurrentItem = random(robotItems);
  robotAnswered = false;
  robotGuessLabel = "아직 예측 전";
  robotFeedback = "새 물건이 나왔습니다. 이번에는 어디로 보내야 할까요?";
}

function setRobotStage(nextStage) {
  robotStage = nextStage;
  robotGuessLabel = "아직 예측 전";

  if (robotStage === 1) {
    robotFeedback = "1단계 학습입니다. 로봇이 색과 겉모양만 보고 자주 헷갈려요.";
  } else {
    robotLearnedData = max(robotLearnedData, 12);
    robotFeedback = "2단계 학습입니다. 로봇이 물건의 특징을 충분히 배워 거의 정확하게 구분해요.";
  }
}

function robotClassify(item) {
  if (robotStage === 2) return item.type;

  if (item.visual === "paperTrash" || item.visual === "wrapper" || item.visual === "eraserDust") {
    return random() < 0.72 ? "trash" : "tool";
  }

  if (item.visual === "pencil") {
    return random() < 0.45 ? "trash" : "tool";
  }

  if (item.visual === "notebook") {
    return random() < 0.38 ? "trash" : "tool";
  }

  return random() < 0.18 ? "trash" : "tool";
}

function getRobotStageDescription() {
  if (robotStage === 1) {
    return "현재 1단계\n색과 겉모양만 보고\n자주 틀립니다.";
  }
  return "현재 2단계\n물건 특징을 배워\n정확하게 구분합니다.";
}

function robotPointInCenterBox(px, py, cx, cy, w, h) {
  return (
    px >= cx - w / 2 &&
    px <= cx + w / 2 &&
    py >= cy - h / 2 &&
    py <= cy + h / 2
  );
}

function drawRobotDeskGraphic(x, y, size) {
  push();
  rectMode(CENTER);
  translate(x, y);

  fill(224, 194, 146);
  stroke(180, 135, 80);
  strokeWeight(2);
  rect(0, 0, size, size * 0.14, 8);
  rect(-size * 0.3, size * 0.3, size * 0.1, size * 0.46, 8);
  rect(size * 0.3, size * 0.3, size * 0.1, size * 0.46, 8);
  pop();
}

function drawRobotItemVisual(item, cx, cy, size) {
  push();
  translate(cx, cy);
  rectMode(CENTER);
  noStroke();

  if (item.visual === "paperTrash") {
    fill(220);
    ellipse(-size * 0.16, -size * 0.04, size * 0.28, size * 0.24);
    ellipse(size * 0.02, -size * 0.08, size * 0.26, size * 0.22);
    ellipse(size * 0.18, size * 0.06, size * 0.24, size * 0.22);
    ellipse(-size * 0.02, size * 0.14, size * 0.26, size * 0.22);
  }

  if (item.visual === "wrapper") {
    fill(255, 205, 96);
    rect(0, 0, size * 0.54, size * 0.2, 6);
    triangle(-size * 0.27, 0, -size * 0.41, -size * 0.08, -size * 0.41, size * 0.08);
    triangle(size * 0.27, 0, size * 0.41, -size * 0.08, size * 0.41, size * 0.08);
  }

  if (item.visual === "eraserDust") {
    fill(215);
    const dots = [
      [-0.22, -0.08], [-0.11, 0.08], [0.0, -0.03], [0.13, 0.09],
      [0.22, -0.05], [0.03, 0.15], [-0.16, 0.14], [0.16, -0.14]
    ];
    for (let i = 0; i < dots.length; i++) {
      ellipse(dots[i][0] * size, dots[i][1] * size, size * 0.09, size * 0.09);
    }
  }

  if (item.visual === "pencil") {
    fill(244, 211, 94);
    rect(0, 0, size * 0.64, size * 0.12, 6);
    fill(242, 132, 130);
    rect(size * 0.22, 0, size * 0.1, size * 0.12, 2);
    fill(248, 237, 226);
    triangle(size * 0.32, -size * 0.06, size * 0.46, 0, size * 0.32, size * 0.06);
    fill(50);
    triangle(size * 0.46, 0, size * 0.52, -size * 0.02, size * 0.52, size * 0.02);
  }

  if (item.visual === "pencilCase") {
    fill(123, 211, 137);
    rect(0, 0, size * 0.5, size * 0.24, 12);
    fill(255);
    rect(0, 0, size * 0.38, size * 0.04, 3);
  }

  if (item.visual === "notebook") {
    fill(116, 192, 252);
    rect(0, 0, size * 0.34, size * 0.52, 8);
    fill(255);
    rect(0, 0, size * 0.14, size * 0.34, 4);
    stroke(180);
    strokeWeight(2);
    line(-size * 0.05, -size * 0.17, -size * 0.05, size * 0.17);
    noStroke();
  }

  if (item.visual === "book") {
    fill(239, 130, 167);
    rect(0, 0, size * 0.42, size * 0.56, 10);
    fill(245);
    rect(0, 0, size * 0.18, size * 0.32, 4);
    fill(223);
    rect(-size * 0.13, 0, size * 0.06, size * 0.56, 10);
  }

  pop();
}


// ======================================================
// 버튼 / 유틸
// ======================================================

// ======================================================
// 5. 경제 용어 카드 페이지
// ======================================================
function initEconomyCards() {
  if (econRawTerms.length === 0) {
    econRawTerms = [
      { term: "인플레이션", dictionary: "물가가 전반적으로 계속 오르는 현상이다.", easy: "같은 돈으로 살 수 있는 물건이 점점 줄어드는 상태예요.", category: "기초경제" },
      { term: "디플레이션", dictionary: "물가가 전반적으로 계속 하락하는 현상이다.", easy: "물건값이 계속 내려가서 사람들이 소비를 미루게 되는 상태예요.", category: "기초경제" },
      { term: "금리", dictionary: "돈을 빌리거나 맡길 때 적용되는 이자 비율이다.", easy: "돈 사용료의 비율이라고 생각하면 쉬워요.", category: "금융" },
      { term: "기준금리", dictionary: "중앙은행이 정하는 대표 금리로 시중 금리에 영향을 준다.", easy: "나라의 기본 금리 버튼 같은 거예요.", category: "금융" },
      { term: "환율", dictionary: "서로 다른 나라 돈을 바꿀 때 적용되는 교환 비율이다.", easy: "외국 돈의 가격이라고 보면 돼요.", category: "무역과세계" },
      { term: "수요", dictionary: "소비자가 어떤 재화나 서비스를 사고자 하는 욕구와 양이다.", easy: "사고 싶어 하는 사람들의 양이에요.", category: "기초경제" },
      { term: "공급", dictionary: "생산자가 시장에 내놓는 재화나 서비스의 양이다.", easy: "팔기 위해 준비된 물건의 양이에요.", category: "기초경제" },
      { term: "시장", dictionary: "재화와 서비스가 거래되는 장소나 구조를 뜻한다.", easy: "사고파는 일이 이루어지는 공간이에요.", category: "기초경제" },
      { term: "가격", dictionary: "재화나 서비스의 가치를 돈으로 나타낸 것이다.", easy: "물건값 또는 서비스값이에요.", category: "기초경제" },
      { term: "소비", dictionary: "재화나 서비스를 사용하거나 이용하는 경제 활동이다.", easy: "물건을 사서 쓰는 행동이에요.", category: "소비생활" },
      { term: "저축", dictionary: "미래를 위해 현재의 소득 일부를 남겨 두는 것이다.", easy: "지금 다 쓰지 않고 모아 두는 돈이에요.", category: "금융" },
      { term: "투자", dictionary: "미래의 이익을 기대하며 돈이나 자원을 투입하는 것이다.", easy: "나중에 더 큰 가치를 기대하고 미리 넣는 돈이에요.", category: "투자" },
      { term: "예산", dictionary: "일정 기간의 수입과 지출을 미리 계획한 것이다.", easy: "돈을 어떻게 쓸지 미리 짜는 계획표예요.", category: "소비생활" },
      { term: "수입", dictionary: "개인이나 기업이 벌어들이는 돈이다.", easy: "들어오는 돈이에요.", category: "소비생활" },
      { term: "지출", dictionary: "물건 구매나 서비스 이용 등으로 돈이 나가는 것이다.", easy: "나가는 돈이에요.", category: "소비생활" },
      { term: "이익", dictionary: "수입에서 비용을 뺀 뒤 남는 금액이다.", easy: "벌어들인 돈에서 쓴 돈을 빼고 남은 돈이에요.", category: "기업과창업" },
      { term: "손해", dictionary: "비용이나 손실이 수입보다 커서 잃게 되는 것이다.", easy: "쓴 돈이 더 많아서 마이너스가 된 상태예요.", category: "기업과창업" },
      { term: "자산", dictionary: "경제적 가치가 있어 소유하고 있는 모든 것이다.", easy: "내가 가진 돈, 건물, 물건 같은 재산이에요.", category: "금융" },
      { term: "부채", dictionary: "남에게 갚아야 할 돈이나 의무이다.", easy: "빌려서 나중에 갚아야 하는 돈이에요.", category: "금융" },
      { term: "신용", dictionary: "돈을 갚을 능력과 의지가 있다고 믿게 하는 정도이다.", easy: "약속을 잘 지킬 사람인지에 대한 믿음이에요.", category: "금융" },
      { term: "대출", dictionary: "은행 등에서 돈을 빌리는 것이다.", easy: "필요한 돈을 먼저 빌려 쓰는 거예요.", category: "금융" },
      { term: "원금", dictionary: "이자를 제외한 처음의 돈이다.", easy: "처음 빌리거나 맡긴 기본 돈이에요.", category: "금융" },
      { term: "이자", dictionary: "돈을 빌리거나 맡긴 대가로 주고받는 돈이다.", easy: "돈 사용료예요.", category: "금융" },
      { term: "세금", dictionary: "국가나 지방자치단체가 공공서비스를 위해 걷는 돈이다.", easy: "나라를 운영하는 데 필요한 공동 부담금이에요.", category: "정부와세금" },
      { term: "부가가치세", dictionary: "물건이나 서비스를 팔 때 생기는 가치에 붙는 세금이다.", easy: "물건값에 함께 붙어 있는 세금이에요.", category: "정부와세금" },
      { term: "소득세", dictionary: "개인이나 법인의 소득에 대해 부과되는 세금이다.", easy: "번 돈에 대해 내는 세금이에요.", category: "정부와세금" },
      { term: "물가", dictionary: "여러 상품과 서비스의 가격 수준 전반을 말한다.", easy: "전체적인 물건값 분위기예요.", category: "기초경제" },
      { term: "실업", dictionary: "일할 능력과 의사가 있는데도 일자리가 없는 상태이다.", easy: "일하고 싶지만 일을 못 구한 상태예요.", category: "기초경제" },
      { term: "취업", dictionary: "직업을 얻어 일을 시작하는 것이다.", easy: "일자리를 구해 일하게 되는 거예요.", category: "기초경제" },
      { term: "기업", dictionary: "이윤을 얻기 위해 재화나 서비스를 생산·판매하는 조직이다.", easy: "물건이나 서비스를 만들어 파는 회사예요.", category: "기업과창업" },
      { term: "창업", dictionary: "새로운 사업이나 회사를 시작하는 것이다.", easy: "내 사업을 새로 시작하는 거예요.", category: "기업과창업" },
      { term: "주식", dictionary: "회사의 소유권 일부를 나타내는 증권이다.", easy: "회사의 작은 조각을 사는 거예요.", category: "투자" },
      { term: "채권", dictionary: "돈을 빌려준 사실을 증명하는 유가증권이다.", easy: "정부나 회사에 돈을 빌려주고 나중에 돌려받는 약속표예요.", category: "투자" },
      { term: "배당", dictionary: "회사가 벌어들인 이익 일부를 주주에게 나누는 것이다.", easy: "회사가 잘 벌었을 때 주식 가진 사람에게 나눠주는 돈이에요.", category: "투자" },
      { term: "펀드", dictionary: "여러 사람의 돈을 모아 전문가가 운용하는 금융상품이다.", easy: "돈을 함께 모아 대신 굴려주는 상품이에요.", category: "투자" },
      { term: "예금", dictionary: "은행에 돈을 맡기는 금융 거래이다.", easy: "은행에 돈을 넣어 두는 거예요.", category: "금융" },
      { term: "적금", dictionary: "일정 금액을 정기적으로 저축하는 금융상품이다.", easy: "매달 조금씩 꾸준히 모으는 통장이에요.", category: "금융" },
      { term: "보험", dictionary: "예기치 못한 사고나 손해에 대비해 가입하는 제도이다.", easy: "큰일이 생겼을 때 도움받기 위해 미리 준비하는 안전장치예요.", category: "금융" },
      { term: "연금", dictionary: "일정 나이 이후 정기적으로 받는 돈이다.", easy: "오래 일한 뒤 생활비처럼 받는 돈이에요.", category: "금융" },
      { term: "GDP", dictionary: "한 나라 안에서 일정 기간 생산된 재화와 서비스의 총가치이다.", easy: "나라가 얼마나 많이 만들고 일했는지 보여 주는 점수판이에요.", category: "기초경제" },
      { term: "경기침체", dictionary: "생산, 소비, 투자 등이 줄어 경제활동이 둔화된 상태이다.", easy: "나라의 경제가 힘이 빠진 상태예요.", category: "기초경제" },
      { term: "경기회복", dictionary: "침체된 경제가 다시 살아나는 현상이다.", easy: "경제가 다시 활발해지는 거예요.", category: "기초경제" },
      { term: "독점", dictionary: "한 기업이 시장을 거의 혼자 차지하는 상태이다.", easy: "한 회사가 거의 혼자 다 파는 상황이에요.", category: "기업과창업" },
      { term: "경쟁", dictionary: "여러 기업이나 개인이 더 좋은 결과를 위해 겨루는 것이다.", easy: "더 잘 팔고 더 잘하려고 서로 겨루는 거예요.", category: "기업과창업" },
      { term: "무역", dictionary: "나라와 나라 사이에 상품과 서비스를 사고파는 활동이다.", easy: "다른 나라와 물건을 주고받는 거래예요.", category: "무역과세계" },
      { term: "수출", dictionary: "국내 생산품을 외국에 파는 것이다.", easy: "우리나라 물건을 다른 나라에 파는 거예요.", category: "무역과세계" },
      { term: "수입", dictionary: "외국의 상품이나 서비스를 국내로 들여오는 것이다.", easy: "다른 나라 물건을 우리나라로 사 오는 거예요.", category: "무역과세계" },
      { term: "관세", dictionary: "수입품에 부과하는 세금이다.", easy: "외국 물건이 들어올 때 붙는 세금이에요.", category: "정부와세금" },
      { term: "공공재", dictionary: "누구나 함께 이용할 수 있고 특정인을 배제하기 어려운 재화이다.", easy: "도로, 가로등처럼 모두가 함께 쓰는 물건이에요.", category: "정부와세금" },
      { term: "기회비용", dictionary: "어떤 선택을 할 때 포기한 것 중 가장 큰 가치이다.", easy: "하나를 고르면서 놓친 다른 좋은 기회의 값이에요.", category: "기초경제" },
      { term: "희소성", dictionary: "원하는 만큼 충분하지 않아 선택이 필요한 상태이다.", easy: "갖고 싶은 것보다 수가 적은 상태예요.", category: "기초경제" },
      { term: "효율성", dictionary: "적은 자원으로 더 큰 성과를 내는 정도이다.", easy: "적게 쓰고 많이 얻는 능력이에요.", category: "기초경제" },
      { term: "생산", dictionary: "재화나 서비스를 만들어 내는 활동이다.", easy: "물건이나 서비스를 만드는 일이에요.", category: "기초경제" },
      { term: "생산성", dictionary: "투입한 자원에 비해 얼마나 많이 생산했는지를 나타낸다.", easy: "같은 시간에 얼마나 잘 만들어냈는지예요.", category: "기초경제" },
      { term: "유통", dictionary: "생산된 상품이 소비자에게 전달되는 과정이다.", easy: "만든 물건이 가게와 사람에게 가는 길이에요.", category: "기업과창업" },
      { term: "마케팅", dictionary: "상품과 서비스를 알리고 판매를 촉진하는 활동이다.", easy: "사람들이 사고 싶게 알리고 소개하는 일이에요.", category: "기업과창업" },
      { term: "브랜드", dictionary: "상품이나 기업을 구별하게 하는 이름과 이미지이다.", easy: "사람들이 떠올리는 회사나 제품의 얼굴이에요.", category: "기업과창업" },
      { term: "소비자", dictionary: "상품이나 서비스를 사서 사용하는 사람이다.", easy: "물건을 사서 쓰는 사람이에요.", category: "소비생활" },
      { term: "생산자", dictionary: "상품이나 서비스를 만들어 공급하는 사람이나 기업이다.", easy: "물건을 만들거나 파는 쪽이에요.", category: "기업과창업" },
      { term: "플랫폼", dictionary: "여러 이용자와 공급자를 연결하는 기반 서비스이다.", easy: "사람과 사람, 판매자와 구매자를 이어 주는 장터 같은 서비스예요.", category: "기업과창업" },
      { term: "전자상거래", dictionary: "인터넷을 통해 상품이나 서비스를 사고파는 거래이다.", easy: "온라인 쇼핑처럼 인터넷에서 사고파는 일이에요.", category: "기업과창업" },
      { term: "재정", dictionary: "정부의 수입과 지출을 관리하는 활동이다.", easy: "나라 살림을 꾸리는 돈 관리예요.", category: "정부와세금" },
      { term: "국가채무", dictionary: "정부가 갚아야 할 빚의 총액이다.", easy: "나라가 빌린 돈이에요.", category: "정부와세금" },
      { term: "예산안", dictionary: "정부나 기관이 편성한 예산의 계획안이다.", easy: "어디에 얼마를 쓸지 정리한 공식 계획표예요.", category: "정부와세금" },
      { term: "적자", dictionary: "지출이 수입보다 많은 상태이다.", easy: "쓴 돈이 번 돈보다 많은 상태예요.", category: "기업과창업" },
      { term: "흑자", dictionary: "수입이 지출보다 많은 상태이다.", easy: "번 돈이 쓴 돈보다 많은 상태예요.", category: "기업과창업" },
      { term: "중앙은행", dictionary: "통화 발행과 통화정책을 맡는 국가의 은행이다.", easy: "나라 돈과 금리를 관리하는 큰 은행이에요.", category: "정부와세금" },
      { term: "통화", dictionary: "거래에 사용하는 돈의 총칭이다.", easy: "사고팔 때 쓰는 돈 전체를 말해요.", category: "금융" },
      { term: "화폐", dictionary: "교환의 수단으로 쓰이는 돈이다.", easy: "물건을 살 때 주는 돈이에요.", category: "금융" },
      { term: "신용카드", dictionary: "나중에 결제하는 방식의 카드이다.", easy: "지금 사고 나중에 한꺼번에 돈을 내는 카드예요.", category: "소비생활" },
      { term: "체크카드", dictionary: "결제 즉시 예금계좌에서 돈이 빠져나가는 카드이다.", easy: "쓰는 순간 통장에서 바로 돈이 나가는 카드예요.", category: "소비생활" },
      { term: "포인트", dictionary: "구매나 활동에 따라 적립되어 사용할 수 있는 혜택이다.", easy: "모아 두었다가 돈처럼 쓰는 보너스예요.", category: "소비생활" },
      { term: "쿠폰", dictionary: "일정 금액 할인이나 혜택을 받을 수 있는 증표이다.", easy: "값을 깎아 주거나 혜택을 주는 이용권이에요.", category: "소비생활" },
      { term: "할인", dictionary: "정해진 가격보다 낮춰 판매하는 것이다.", easy: "원래 가격보다 싸게 파는 거예요.", category: "소비생활" },
      { term: "세일", dictionary: "상품을 할인하여 판매하는 행사이다.", easy: "가격을 낮춰 파는 기간 행사예요.", category: "소비생활" },
      { term: "구독경제", dictionary: "정기 요금을 내고 상품이나 서비스를 계속 이용하는 방식이다.", easy: "매달 내고 계속 쓰는 이용 방식이에요.", category: "소비생활" },
      { term: "공유경제", dictionary: "물건이나 공간을 함께 사용해 효율을 높이는 경제 방식이다.", easy: "혼자 사지 않고 함께 빌려 쓰는 경제예요.", category: "환경과미래" },
      { term: "ESG", dictionary: "환경, 사회, 지배구조를 고려하는 기업 경영 기준이다.", easy: "회사가 돈만이 아니라 환경과 사람, 운영 방식도 챙기는 거예요.", category: "환경과미래" },
      { term: "탄소세", dictionary: "탄소 배출에 대해 부과하는 세금이다.", easy: "오염을 줄이기 위해 탄소를 많이 내면 더 내는 세금이에요.", category: "환경과미래" },
      { term: "최저임금", dictionary: "법으로 정한 시간당 또는 일당의 최소 임금 수준이다.", easy: "일하면 적어도 이만큼은 받아야 한다는 기준이에요.", category: "정부와세금" },
      { term: "임금", dictionary: "노동의 대가로 받는 돈이다.", easy: "일한 만큼 받는 돈이에요.", category: "기초경제" },
      { term: "노동", dictionary: "사람이 일을 통해 가치를 만들어 내는 활동이다.", easy: "몸이나 머리를 써서 일하는 거예요.", category: "기초경제" },
      { term: "노동시간", dictionary: "일하는 데 쓰는 시간이다.", easy: "실제로 일한 시간이에요.", category: "기초경제" },
      { term: "복리", dictionary: "원금뿐 아니라 이자에도 다시 이자가 붙는 방식이다.", easy: "이자에 또 이자가 붙어 돈이 더 빨리 불어나는 방식이에요.", category: "금융" },
      { term: "단리", dictionary: "원금에만 이자가 붙는 방식이다.", easy: "처음 돈에만 이자가 붙는 방식이에요.", category: "금융" },
      { term: "매출", dictionary: "상품이나 서비스를 팔아 얻은 총수입이다.", easy: "판 금액을 모두 합친 돈이에요.", category: "기업과창업" },
      { term: "순이익", dictionary: "매출에서 모든 비용을 뺀 뒤 실제로 남는 이익이다.", easy: "다 빼고 마지막에 진짜 남은 돈이에요.", category: "기업과창업" },
      { term: "고정비", dictionary: "판매량과 관계없이 일정하게 드는 비용이다.", easy: "많이 팔아도 적게 팔아도 비슷하게 드는 돈이에요.", category: "기업과창업" },
      { term: "변동비", dictionary: "생산량이나 판매량에 따라 달라지는 비용이다.", easy: "많이 만들수록 더 늘어나는 비용이에요.", category: "기업과창업" },
      { term: "손익분기점", dictionary: "이익도 손해도 나지 않는 매출 수준이다.", easy: "딱 본전이 되는 지점이에요.", category: "기업과창업" },
      { term: "스타트업", dictionary: "빠른 성장 가능성을 가진 신생 기업이다.", easy: "새롭게 시작해 크게 성장하려는 회사예요.", category: "기업과창업" },
      { term: "벤처기업", dictionary: "기술성과 성장성이 높아 혁신을 추구하는 기업이다.", easy: "새로운 기술이나 아이디어로 도전하는 회사예요.", category: "기업과창업" },
      { term: "리스크", dictionary: "미래에 손실이 발생할 가능성이다.", easy: "손해가 날 수 있는 위험이에요.", category: "투자" },
      { term: "분산투자", dictionary: "위험을 줄이기 위해 여러 자산에 나누어 투자하는 것이다.", easy: "한 곳에 몰지 않고 여러 곳에 나눠 넣는 거예요.", category: "투자" },
      { term: "금융사기", dictionary: "돈이나 금융상품을 이용해 속여 빼앗는 범죄이다.", easy: "돈을 노리고 속이는 나쁜 행동이에요.", category: "금융" },
      { term: "개인정보", dictionary: "개인을 알아볼 수 있는 이름, 연락처, 계좌정보 등이다.", easy: "나를 특정할 수 있는 중요한 정보예요.", category: "금융" },
      { term: "명목소득", dictionary: "물가 변화를 반영하지 않은 금액 그대로의 소득이다.", easy: "겉으로 보이는 숫자 그대로의 소득이에요.", category: "기초경제" },
      { term: "실질소득", dictionary: "물가 변화를 반영한 실제 구매력 기준의 소득이다.", easy: "실제로 무엇을 얼마나 살 수 있는지를 따진 소득이에요.", category: "기초경제" },
      { term: "소비자물가지수", dictionary: "가계가 자주 사는 상품과 서비스 가격 변동을 지수로 나타낸 것이다.", easy: "자주 사는 물건값이 얼마나 올랐는지 보여 주는 숫자예요.", category: "기초경제" },
      { term: "예금자보호", dictionary: "금융회사가 문제가 생겨도 일정 한도까지 예금을 보호해 주는 제도이다.", easy: "은행에 문제가 생겨도 일정 금액까지는 지켜 주는 안전장치예요.", category: "금융" }
    ];

    const fillers = [
      ["가격탄력성", "가격이 바뀌었을 때 수요나 공급이 얼마나 민감하게 변하는지를 뜻한다.", "값이 바뀌면 사람들이 얼마나 많이 움직이는지 보는 개념이에요.", "기초경제"],
      ["한계비용", "재화 한 단위를 추가로 생산할 때 드는 비용이다.", "물건 하나를 더 만들 때 추가로 드는 돈이에요.", "기업과창업"],
      ["한계효용", "재화 한 단위를 더 소비할 때 얻는 만족의 증가분이다.", "하나를 더 가질 때 늘어나는 만족감이에요.", "기초경제"],
      ["자본", "생산에 사용되는 기계, 설비, 자금 등의 자원을 말한다.", "물건을 만들 때 쓰는 중요한 준비물이에요.", "기업과창업"],
      ["노동력", "생산 활동에 투입되는 사람의 능력과 노력이다.", "사람이 일할 수 있는 힘과 능력이에요.", "기초경제"],
      ["토지", "생산에 활용되는 자연 자원과 공간을 뜻한다.", "농지나 땅처럼 생산에 쓰이는 공간이에요.", "기초경제"],
      ["창업자금", "사업을 시작할 때 필요한 초기 자금이다.", "가게나 회사를 처음 시작할 때 필요한 돈이에요.", "기업과창업"],
      ["매입", "필요한 물건이나 원재료를 사들이는 것이다.", "팔거나 만들기 위해 먼저 사 오는 거예요.", "기업과창업"],
      ["매입가", "물건을 사들인 가격이다.", "내가 물건을 사 온 원래 가격이에요.", "기업과창업"],
      ["판매가", "소비자에게 판매하는 가격이다.", "손님에게 파는 가격이에요.", "기업과창업"],
      ["재고", "창고나 매장에 남아 있는 상품의 수량이다.", "아직 팔리지 않고 남아 있는 물건이에요.", "기업과창업"],
      ["원가", "상품을 만들거나 들여오는 데 들어간 비용이다.", "제품 하나가 나오기까지 실제로 들어간 돈이에요.", "기업과창업"],
      ["현금흐름", "돈이 들어오고 나가는 흐름을 말한다.", "돈이 어떻게 오가고 있는지 보여 주는 흐름이에요.", "금융"],
      ["가계", "개인이나 가족 단위의 경제 주체를 뜻한다.", "집에서 돈을 벌고 쓰는 단위를 말해요.", "소비생활"],
      ["기업가정신", "새로운 기회를 찾아 도전하고 가치를 만드는 태도이다.", "새로운 아이디어로 도전하려는 마음가짐이에요.", "기업과창업"],
      ["소득공제", "세금을 계산할 때 일정 금액을 빼 주는 제도이다.", "세금을 조금 덜 내게 도와주는 장치예요.", "정부와세금"],
      ["납세", "법에 따라 세금을 내는 일이다.", "정해진 세금을 내는 행동이에요.", "정부와세금"],
      ["환전", "한 나라의 돈을 다른 나라 돈으로 바꾸는 것이다.", "한국 돈을 외국 돈으로 바꾸는 일이에요.", "무역과세계"],
      ["무역흑자", "수출이 수입보다 많은 상태이다.", "다른 나라에 판 것이 더 많은 상태예요.", "무역과세계"],
      ["무역적자", "수입이 수출보다 많은 상태이다.", "다른 나라에서 사 온 것이 더 많은 상태예요.", "무역과세계"]
    ];

    for (let i = 0; i < fillers.length; i++) {
      if (econRawTerms.length >= 100) break;
      econRawTerms.push({ term: fillers[i][0], dictionary: fillers[i][1], easy: fillers[i][2], category: fillers[i][3] });
    }

    let autoNum = 1;
    const autoCategories = ["기초경제", "소비생활", "금융", "투자", "기업과창업", "정부와세금", "무역과세계", "환경과미래"];
    while (econRawTerms.length < 100) {
      const cat = autoCategories[econRawTerms.length % autoCategories.length];
      econRawTerms.push({
        term: `경제 개념 ${autoNum}`,
        dictionary: "경제 활동을 이해하는 데 도움이 되는 확장 학습용 개념 카드이다.",
        easy: "경제를 배울 때 같이 알아 두면 좋은 추가 개념 카드예요.",
        category: cat
      });
      autoNum += 1;
    }
  }

  econTerms = econRawTerms.slice(0, 100);
  econApplyCategory(econActiveCategory || "전체", true);
}

function econShuffledCopy(arr) {
  let copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function econApplyCategory(category, keepPosition) {
  econActiveCategory = category;
  let source = category === "전체" ? econTerms : econTerms.filter(item => item.category === category);
  econCards = econShuffledCopy(source);
  econCurrentIndex = keepPosition ? 0 : 0;
  econFlipProgress = 0;
  econFlipTarget = 0;
}

function getEconomyLayout() {
  let cardW = min(760, width - 120);
  let cardH = min(470, height * 0.52);
  let cardX = width / 2;
  let cardY = height * 0.52;
  return {
    cardX,
    cardY,
    cardW,
    cardH,
    topY: 46,
    headerY: 82,
    categoryStartY: 126,
    bottomY: height - 70
  };
}

function drawEconomyPage() {
  let layout = getEconomyLayout();
  let current = econCards[econCurrentIndex] || null;

  fill(35);
  textSize(clampText(28, 34));
  text("경제 용어 카드", width / 2, layout.topY + 6);

  fill(92);
  textSize(clampText(15, 17));
  text("카드를 눌러 앞뒤를 뒤집고, 좌우 버튼으로 다음 용어를 공부하세요", width / 2, layout.headerY);

  drawButton(80, 42, 120, 42, "뒤로가기");
  drawButton(width - 150, 42, 120, 42, "랜덤");
  drawButton(width - 285, 42, 120, 42, "다시섞기");

  drawEconomyCategoryButtons(layout);

  if (!current) {
    fill(120);
    textSize(20);
    text("표시할 카드가 없습니다.", width / 2, height / 2);
    return;
  }

  drawEconomyFlashcard(current, layout.cardX, layout.cardY, layout.cardW, layout.cardH);
  drawEconomyBottomNav(layout, current);
}

function drawEconomyCategoryButtons(layout) {
  let buttons = getEconomyCategoryButtons(layout);
  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    let active = btn.label === econActiveCategory;
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 10);
    rect(btn.x, btn.y + 3, btn.w, btn.h, 12);
    stroke(active ? color(74, 112, 191) : color(185));
    strokeWeight(active ? 3 : 2);
    fill(active ? color(228, 238, 255) : 255);
    rect(btn.x, btn.y, btn.w, btn.h, 12);
    noStroke();
    fill(active ? color(42, 74, 140) : color(60));
    textSize(14);
    text(btn.label, btn.x, btn.y);
    pop();
  }
}

function getEconomyCategoryButtons(layout) {
  let buttons = [];
  let cols = 4;
  let btnW = min(150, (width - 120) / cols - 10);
  let btnH = 38;
  let gapX = 10;
  let gapY = 10;
  let totalW = cols * btnW + (cols - 1) * gapX;
  let startX = width / 2 - totalW / 2 + btnW / 2;

  for (let i = 0; i < econCategories.length; i++) {
    let row = floor(i / cols);
    let col = i % cols;
    buttons.push({
      label: econCategories[i],
      x: startX + col * (btnW + gapX),
      y: layout.categoryStartY + row * (btnH + gapY),
      w: btnW,
      h: btnH
    });
  }
  return buttons;
}

function drawEconomyFlashcard(card, x, y, w, h) {
  let scaleXValue = max(0.06, abs(cos(econFlipProgress * PI)));
  let showBack = econFlipProgress >= 0.5;

  push();
  translate(x, y);
  scale(scaleXValue, 1);
  rectMode(CENTER);

  noStroke();
  fill(0, 18);
  rect(10, 12, w, h, 28);

  stroke(185);
  strokeWeight(2);
  if (!showBack) {
    fill(255);
    rect(0, 0, w, h, 28);

    noStroke();
    fill(232, 241, 255);
    rect(0, -h * 0.34, w - 44, 56, 18);

    fill(56, 88, 158);
    textSize(clampText(16, 18));
    text(card.category, 0, -h * 0.34);

    fill(35);
    textSize(clampText(34, 54));
    text(card.term, 0, -8);

    fill(110);
    textSize(clampText(15, 17));
    text("카드를 눌러 설명 보기", 0, h * 0.30);
  } else {
    fill(248, 251, 255);
    rect(0, 0, w, h, 28);

    noStroke();
    fill(35);
    textSize(clampText(24, 32));
    text(card.term, 0, -h * 0.39);

    drawEconomyInfoBox(-w * 0.36, -h * 0.24, w * 0.72, 120, "일반 설명", card.dictionary, color(66, 104, 177));
    drawEconomyInfoBox(-w * 0.36, h * 0.02, w * 0.72, 140, "쉬운 설명", card.easy, color(46, 130, 101));

    fill(110);
    textSize(clampText(14, 16));
    text("한 번 더 누르면 앞면으로 돌아갑니다", 0, h * 0.39);
  }
  pop();
}

function drawEconomyInfoBox(x, y, w, h, title, body, titleColor) {
  push();
  rectMode(CORNER);
  stroke(218);
  strokeWeight(2);
  fill(255);
  rect(x, y, w, h, 18);

  noStroke();
  fill(titleColor);
  textAlign(LEFT, TOP);
  textSize(16);
  text(title, x + 18, y + 14);

  fill(55);
  textSize(16);
  textLeading(25);
  text(body, x + 18, y + 44, w - 36, h - 58);
  pop();
}

function drawEconomyBottomNav(layout, current) {
  let bottom = getEconomyBottomButtons(layout);

  drawButton(bottom.prev.x, bottom.prev.y, bottom.prev.w, bottom.prev.h, "◀ 이전");
  drawButton(bottom.flip.x, bottom.flip.y, bottom.flip.w, bottom.flip.h, econFlipTarget < 0.5 ? "카드 뒤집기" : "앞면 보기");
  drawButton(bottom.next.x, bottom.next.y, bottom.next.w, bottom.next.h, "다음 ▶");

  push();
  rectMode(CENTER);
  noStroke();
  fill(255);
  rect(width / 2, layout.bottomY, 150, 46, 18);
  fill(40);
  textSize(20);
  text(`${econCurrentIndex + 1} / ${econCards.length}`, width / 2, layout.bottomY);
  pop();

  fill(100);
  textSize(14);
  text(`현재 카테고리: ${current.category}`, width / 2, layout.bottomY - 40);
}

function getEconomyBottomButtons(layout) {
  return {
    prev: { x: width / 2 - 230, y: layout.bottomY, w: 120, h: 42 },
    flip: { x: width / 2, y: layout.bottomY + 56, w: 140, h: 42 },
    next: { x: width / 2 + 230, y: layout.bottomY, w: 120, h: 42 }
  };
}

function updateEconomyFlip() {
  econFlipProgress = lerp(econFlipProgress, econFlipTarget, 0.18);
  if (abs(econFlipProgress - econFlipTarget) < 0.01) {
    econFlipProgress = econFlipTarget;
  }
}

function handleEconomyPageClick() {
  let layout = getEconomyLayout();
  let bottom = getEconomyBottomButtons(layout);

  if (isInsideRect(mouseX, mouseY, 80, 42, 120, 42)) {
    page = 1;
    return;
  }

  if (isInsideRect(mouseX, mouseY, width - 150, 42, 120, 42)) {
    econGoRandom();
    return;
  }

  if (isInsideRect(mouseX, mouseY, width - 285, 42, 120, 42)) {
    econApplyCategory(econActiveCategory, false);
    return;
  }

  let categoryButtons = getEconomyCategoryButtons(layout);
  for (let i = 0; i < categoryButtons.length; i++) {
    let btn = categoryButtons[i];
    if (isInsideRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h)) {
      econApplyCategory(btn.label, false);
      return;
    }
  }

  if (isInsideRect(mouseX, mouseY, bottom.prev.x, bottom.prev.y, bottom.prev.w, bottom.prev.h)) {
    econPrev();
    return;
  }

  if (isInsideRect(mouseX, mouseY, bottom.next.x, bottom.next.y, bottom.next.w, bottom.next.h)) {
    econNext();
    return;
  }

  if (isInsideRect(mouseX, mouseY, bottom.flip.x, bottom.flip.y, bottom.flip.w, bottom.flip.h)) {
    econToggleFlip();
    return;
  }

  if (isInsideRect(mouseX, mouseY, layout.cardX, layout.cardY, layout.cardW, layout.cardH)) {
    econToggleFlip();
  }
}

function econToggleFlip() {
  econFlipTarget = econFlipTarget < 0.5 ? 1 : 0;
}

function econNext() {
  if (!econCards.length) return;
  econCurrentIndex = (econCurrentIndex + 1) % econCards.length;
  econFlipProgress = 0;
  econFlipTarget = 0;
}

function econPrev() {
  if (!econCards.length) return;
  econCurrentIndex = (econCurrentIndex - 1 + econCards.length) % econCards.length;
  econFlipProgress = 0;
  econFlipTarget = 0;
}

function econGoRandom() {
  if (!econCards.length) return;
  let nextIndex = econCurrentIndex;
  while (econCards.length > 1 && nextIndex === econCurrentIndex) {
    nextIndex = floor(random(econCards.length));
  }
  econCurrentIndex = nextIndex;
  econFlipProgress = 0;
  econFlipTarget = 0;
}

function drawButton(x, y, w, h, label) {
  let hover = isInsideRect(mouseX, mouseY, x, y, w, h);

  noStroke();
  fill(0, 14);
  rect(x, y + 5, w, h, 12);

  stroke(120);
  strokeWeight(2);
  fill(hover ? 248 : 255);
  rect(x, y, w, h, 12);

  noStroke();
  fill(40);
  textSize(17);
  text(label, x, y);
}

function isInsideRect(px, py, cx, cy, w, h) {
  return (
    px > cx - w / 2 &&
    px < cx + w / 2 &&
    py > cy - h / 2 &&
    py < cy + h / 2
  );
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function clampText(minV, maxV) {
  return constrain(width * 0.018, minV, maxV);
}
