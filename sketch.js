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
  robotItems = createRobotItems();
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

function createRobotItems() {
  return [
    { name: "종이 쓰레기", type: "trash", visual: "paperTrash", hint: "구겨진 종이라 모양이 일정하지 않아요." },
    { name: "과자봉지", type: "trash", visual: "wrapper", hint: "먹고 남은 포장지예요." },
    { name: "지우개 가루", type: "trash", visual: "eraserDust", hint: "작고 흩어진 쓰레기예요." },
    { name: "연필", type: "tool", visual: "pencil", hint: "글씨를 쓰는 학용품이에요." },
    { name: "필통", type: "tool", visual: "pencilCase", hint: "학용품을 담는 통이에요." },
    { name: "공책", type: "tool", visual: "notebook", hint: "얇게 넘길 수 있는 학용품이에요." },
    { name: "책", type: "tool", visual: "book", hint: "두껍고 오래 쓰는 물건이에요." }
  ];
}

function getRobotLayout() {
  let contentW = min(width - 100, 1120);
  let leftEdge = width / 2 - contentW / 2;
  let gap = 24;

  let leftW = 250;
  let centerW = 430;
  let rightW = contentW - leftW - centerW - gap * 2;

  if (rightW < 290) {
    rightW = 290;
    centerW = contentW - leftW - rightW - gap * 2;
  }

  let topTop = 150;
  let topH = constrain(height * 0.42, 340, 390);
  let topRowY = topTop + topH / 2;

  let leftX = leftEdge + leftW / 2;
  let centerX = leftEdge + leftW + gap + centerW / 2;
  let rightX = leftEdge + leftW + gap + centerW + gap + rightW / 2;

  let bottomTop = topTop + topH + 40;
  let bottomH = 170;
  let bottomY = bottomTop + bottomH / 2;

  let leftBottomW = 285;
  let midBottomW = 285;
  let rightBottomW = contentW - leftBottomW - midBottomW - gap * 2;

  let bottomLeftX = leftEdge + leftBottomW / 2;
  let bottomMidX = leftEdge + leftBottomW + gap + midBottomW / 2;
  let bottomRightX = leftEdge + leftBottomW + gap + midBottomW + gap + rightBottomW / 2;

  let feedbackTop = bottomTop + bottomH + 22;
  let feedbackH = 48;
  let feedbackY = feedbackTop + feedbackH / 2;

  return {
    contentW,
    gap,

    topTop,
    topH,
    topRowY,

    leftX,
    centerX,
    rightX,
    leftW,
    centerW,
    rightW,

    bottomTop,
    bottomH,
    bottomY,

    bottomLeftX,
    bottomMidX,
    bottomRightX,
    leftBottomW,
    midBottomW,
    rightBottomW,

    feedbackTop,
    feedbackH,
    feedbackY
  };
}

function drawRobotPage() {
  if (!robotItems.length || !robotCurrentItem) {
    initRobotGame();
  }

  let layout = getRobotLayout();

  fill(35);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(clampText(28, 34));
  text("우리 반 청소로봇 AI 체험", width / 2, 52);

  fill(92);
  textSize(clampText(15, 17));
  text("첫 화면의 세 번째 아이콘에서 들어온 청소로봇 분류 체험입니다", width / 2, 88);

  drawButton(86, 42, 120, 42, "뒤로가기");

  drawRobotTopPanels(layout);
  drawRobotBottomPanels(layout);
}

function drawRobotTopPanels(layout) {
  drawRobotSoftPanel(layout.leftX, layout.topRowY, layout.leftW, layout.topH, 24);
  drawRobotSoftPanel(layout.centerX, layout.topRowY, layout.centerW, layout.topH, 24);
  drawRobotSoftPanel(layout.rightX, layout.topRowY, layout.rightW, layout.topH, 24);

  drawRobotLeftPanel(layout);
  drawRobotCenterPanel(layout);
  drawRobotRightPanel(layout);
}

function drawRobotBottomPanels(layout) {
  drawRobotSoftPanel(layout.bottomLeftX, layout.bottomY, layout.leftBottomW, layout.bottomH, 24);
  drawRobotSoftPanel(layout.bottomMidX, layout.bottomY, layout.midBottomW, layout.bottomH, 24);
  drawRobotSoftPanel(layout.bottomRightX, layout.bottomY, layout.rightBottomW, layout.bottomH, 24);
  drawRobotSoftPanel(width / 2, layout.feedbackY, layout.contentW, layout.feedbackH, 18);

  let leftTop = layout.bottomTop;
  let midTop = layout.bottomTop;
  let rightTop = layout.bottomTop;

  // 제목
  fill(35);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text("학생 선택", layout.bottomLeftX, leftTop + 18);
  text("로봇 학습 단계", layout.bottomMidX, midTop + 18);
  text("진행", layout.bottomRightX, rightTop + 18);

  // 설명
  fill(110);
  textSize(14);
  textAlign(CENTER, TOP);
  text("먼저 물건이 어디로 가야 하는지 골라 보세요.", layout.bottomLeftX, leftTop + 50);
  text(getRobotStageDescription(), layout.bottomMidX, midTop + 48);
  text("다음 물건으로 넘어가거나 처음부터 다시 시작할 수 있어요.", layout.bottomRightX, rightTop + 50);

  let btns = getRobotButtons(layout);
  for (let btn of btns) {
    let hover = isInsideRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h);
    drawRobotActionButton(btn, hover);
  }

  fill(41, 72, 138);
  noStroke();
  textSize(17);
  textAlign(CENTER, CENTER);
  text(robotFeedback, width / 2, layout.feedbackY + 1);
}

function drawRobotLeftPanel(layout) {
  let panelLeft = layout.leftX - layout.leftW / 2;
  let panelTop = layout.topTop;
  let panelBottom = panelTop + layout.topH;

  fill(35);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text("청소 구역", layout.leftX, panelTop + 18);

  let binX = layout.leftX;
  let binY = panelTop + 150;
  let binW = 100;
  let binH = 142;

  stroke(239, 168, 53);
  strokeWeight(2);
  fill(252, 247, 238);
  rect(binX, binY, binW, binH, 22);

  noStroke();
  fill(130);
  rect(binX, binY + 10, 46, 84, 12);
  rect(binX, binY - 42, 58, 16, 10);

  fill(101, 69, 35);
  textSize(20);
  textAlign(CENTER, TOP);
  text("쓰레기통", binX, binY + 86);

  fill(110);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textLeading(22);
  text(
    "청소로봇은 교실 바닥의 물건을 보고,\n쓰레기통으로 보낼지\n책상 위에 둘지 정합니다.",
    panelLeft + 22,
    panelBottom - 108,
    layout.leftW - 44,
    72
  );

  textAlign(CENTER, CENTER);
}

function drawRobotCenterPanel(layout) {
  let panelLeft = layout.centerX - layout.centerW / 2;
  let panelTop = layout.topTop;
  let panelBottom = panelTop + layout.topH;

  fill(35);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text("현재 물건", layout.centerX, panelTop + 18);

  let cardW = layout.centerW - 52;
  let cardH = 216;
  let cardX = layout.centerX;
  let cardY = panelTop + 140;

  stroke(220);
  strokeWeight(2);
  fill(248, 250, 253);
  rect(cardX, cardY, cardW, cardH, 26);

  fill(35);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(26);
  text(robotCurrentItem.name, cardX, cardY - 82);

  drawRobotItemVisual(robotCurrentItem, cardX, cardY - 6, 60);

  fill(105);
  textSize(16);
  textAlign(CENTER, TOP);
  text("이 물건은 어디로 가야 할까요?", cardX, cardY + 50);

  fill(80);
  textSize(15);
  textAlign(LEFT, TOP);
  text("물건 설명", panelLeft + 24, panelBottom - 92);

  fill(110);
  textSize(14);
  textLeading(22);
  text(
    robotCurrentItem.hint,
    panelLeft + 24,
    panelBottom - 64,
    layout.centerW - 170,
    48
  );

  drawRobotDeskGraphic(panelLeft + layout.centerW - 82, panelBottom - 46, 66);

  textAlign(CENTER, CENTER);
}

function drawRobotRightPanel(layout) {
  let panelLeft = layout.rightX - layout.rightW / 2;
  let panelTop = layout.topTop;
  let panelBottom = panelTop + layout.topH;

  fill(35);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text("청소로봇 판단", layout.rightX, panelTop + 18);

  fill(95);
  textSize(15);
  textAlign(LEFT, TOP);
  text(
    "로봇이 이 물건을 어떻게 판단하는지 확인해 보세요.",
    panelLeft + 22,
    panelTop + 58,
    layout.rightW - 44,
    42
  );

  let cardW = layout.rightW - 44;

  drawRobotInfoCardBox(
    panelLeft + 22,
    panelTop + 118,
    cardW,
    110,
    "로봇의 예측",
    robotGuessLabel,
    robotStage === 1 ? color(219, 80, 20) : color(30, 120, 70),
    20
  );

  drawRobotInfoCardBox(
    panelLeft + 22,
    panelTop + 245,
    cardW,
    128,
    "학습 정보",
    `라운드: ${robotRound} / ${robotMaxRounds}\n맞힌 개수: ${robotScore}\n학습 데이터: ${robotLearnedData}개`,
    color(80),
    15
  );

  fill(110);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text(
    robotStage === 1
      ? "1단계에서는 색이나 겉모양만 보고 판단해서 오답이 자주 납니다."
      : "2단계에서는 물건의 특징을 잘 배워 거의 정확하게 구분합니다.",
    panelLeft + 22,
    panelBottom - 68,
    layout.rightW - 44,
    48
  );

  textAlign(CENTER, CENTER);
}

function getRobotButtons(layout) {
  let leftTop = layout.bottomTop;
  let midTop = layout.bottomTop;
  let rightTop = layout.bottomTop;

  return [
    {
      id: "choiceTrash",
      label: "쓰레기통으로 보내기",
      x: layout.bottomLeftX,
      y: leftTop + 104,
      w: min(210, layout.leftBottomW * 0.76),
      h: 38,
      disabled: robotAnswered || robotFinished,
      selected: false,
      onClick: () => handleRobotChoice("trash")
    },
    {
      id: "choiceTool",
      label: "책상 위에 두기",
      x: layout.bottomLeftX,
      y: leftTop + 146,
      w: min(210, layout.leftBottomW * 0.76),
      h: 38,
      disabled: robotAnswered || robotFinished,
      selected: false,
      onClick: () => handleRobotChoice("tool")
    },
    {
      id: "stage1",
      label: "1단계 학습",
      x: layout.bottomMidX - 66,
      y: midTop + 126,
      w: 118,
      h: 40,
      disabled: false,
      selected: robotStage === 1,
      onClick: () => setRobotStage(1)
    },
    {
      id: "stage2",
      label: "2단계 학습",
      x: layout.bottomMidX + 66,
      y: midTop + 126,
      w: 118,
      h: 40,
      disabled: false,
      selected: robotStage === 2,
      onClick: () => setRobotStage(2)
    },
    {
      id: "reset",
      label: "처음부터",
      x: layout.bottomRightX - 78,
      y: rightTop + 126,
      w: 136,
      h: 40,
      disabled: false,
      selected: false,
      onClick: () => initRobotGame()
    },
    {
      id: "next",
      label: "다음 물건",
      x: layout.bottomRightX + 78,
      y: rightTop + 126,
      w: 136,
      h: 40,
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
  textSize(16);
  text(btn.label, btn.x, btn.y + 1);
}

function drawRobotSoftPanel(x, y, w, h, radiusValue) {
  noStroke();
  fill(0, 12);
  rect(x + 5, y + 7, w, h, radiusValue);

  stroke(220);
  strokeWeight(2);
  fill(255);
  rect(x, y, w, h, radiusValue);
}

function drawRobotInfoCardBox(left, top, w, h, title, content, contentColor, contentSize) {
  push();
  rectMode(CORNER);

  stroke(220);
  strokeWeight(2);
  fill(246, 248, 252);
  rect(left, top, w, h, 18);

  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(18);
  text(title, left + 16, top + 14);

  fill(contentColor);
  textSize(contentSize);
  text(content, left + 16, top + 48, w - 32, h - 58);

  pop();

  textAlign(CENTER, CENTER);
}

function handleRobotPageClick() {
  if (isInsideRect(mouseX, mouseY, 86, 42, 120, 42)) {
    page = 1;
    return;
  }

  let btns = getRobotButtons(getRobotLayout());
  for (let btn of btns) {
    if (!btn.disabled && isInsideRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h)) {
      btn.onClick();
      return;
    }
  }
}

function handleRobotChoice(choice) {
  if (robotFinished || robotAnswered || !robotCurrentItem) return;

  let correct = choice === robotCurrentItem.type;
  let robotPrediction = robotClassify(robotCurrentItem);
  robotGuessLabel = robotPrediction === "trash" ? "쓰레기" : "학용품";

  if (correct) {
    robotScore += 1;
    robotLearnedData += 1;
  }

  let userText = correct ? "정답입니다." : "조금 아쉬워요.";
  let robotText = robotPrediction === robotCurrentItem.type
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
    return "현재 1단계\n색이나 겉모양만 보고 판단해서 자주 틀립니다.";
  }
  return "현재 2단계\n물건의 특징을 잘 배워 거의 정확하게 구분합니다.";
}

function drawRobotDeskGraphic(x, y, size) {
  push();
  translate(x, y);

  fill(224, 194, 146);
  stroke(180, 135, 80);
  strokeWeight(2);
  rect(0, 0, size * 1.05, size * 0.18, 8);
  rect(-size * 0.34, size * 0.34, size * 0.12, size * 0.54, 8);
  rect(size * 0.34, size * 0.34, size * 0.12, size * 0.54, 8);

  pop();
}

function drawRobotItemVisual(item, cx, cy, size) {
  push();
  translate(cx, cy);
  noStroke();

  if (item.visual === "paperTrash") {
    fill(220);
    ellipse(-size * 0.2, -size * 0.05, size * 0.36, size * 0.32);
    ellipse(size * 0.02, -size * 0.12, size * 0.34, size * 0.3);
    ellipse(size * 0.24, size * 0.08, size * 0.32, size * 0.28);
    ellipse(-size * 0.03, size * 0.18, size * 0.34, size * 0.26);
  }

  if (item.visual === "wrapper") {
    fill(255, 205, 96);
    rect(0, 0, size * 0.62, size * 0.24, 6);
    triangle(-size * 0.31, 0, -size * 0.48, -size * 0.1, -size * 0.48, size * 0.1);
    triangle(size * 0.31, 0, size * 0.48, -size * 0.1, size * 0.48, size * 0.1);
  }

  if (item.visual === "eraserDust") {
    fill(215);
    let dots = [[-0.26,-0.1],[-0.14,0.08],[-0.02,-0.03],[0.14,0.12],[0.25,-0.08],[0.04,0.18],[-0.2,0.18],[0.18,-0.18]];
    for (let d of dots) {
      ellipse(d[0] * size, d[1] * size, size * 0.11, size * 0.11);
    }
  }

  if (item.visual === "pencil") {
    fill(244, 211, 94);
    rect(-size * 0.1, 0, size * 0.92, size * 0.18, 6);
    fill(242, 132, 130);
    rect(size * 0.33, 0, size * 0.13, size * 0.18, 2);
    fill(248, 237, 226);
    triangle(size * 0.46, -size * 0.09, size * 0.67, 0, size * 0.46, size * 0.09);
    fill(50);
    triangle(size * 0.67, 0, size * 0.75, -size * 0.03, size * 0.75, size * 0.03);
  }

  if (item.visual === "pencilCase") {
    fill(123, 211, 137);
    rect(0, 0, size * 0.74, size * 0.38, 12);
    fill(255);
    rect(0, 0, size * 0.62, size * 0.06, 3);
  }

  if (item.visual === "notebook") {
    fill(116, 192, 252);
    rect(0, 0, size * 0.6, size * 0.82, 8);
    fill(255);
    rect(0, 0, size * 0.34, size * 0.58, 4);
    stroke(180);
    strokeWeight(2);
    line(-size * 0.09, -size * 0.29, -size * 0.09, size * 0.29);
    noStroke();
  }

  if (item.visual === "book") {
    fill(239, 130, 167);
    rect(0, 0, size * 0.68, size * 0.9, 10);
    fill(245);
    rect(0, 0, size * 0.32, size * 0.56, 4);
    fill(223);
    rect(-size * 0.25, 0, size * 0.1, size * 0.9, 10);
  }

  pop();
}

// ======================================================
// 버튼 / 유틸
// ======================================================
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
