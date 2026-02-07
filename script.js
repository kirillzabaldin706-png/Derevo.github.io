const start = document.getElementById("start");
const content = document.getElementById("content");
const canvas = document.getElementById("tree");
const ctx = canvas.getContext("2d");

let hearts = [];
let animationComplete = false;

// Устанавливаем размеры холста после отображения контента
function setupCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

start.addEventListener("click", () => {
  start.style.display = "none";
  content.classList.remove("hidden");
  setupCanvas();
  setTimeout(() => {
    animateTreeGrowth();
  }, 300);
  startTimer();
});

// Анимация роста дерева
function animateTreeGrowth() {
  const centerX = canvas.width / 2;
  const bottomY = canvas.height;
  const trunkHeight = 220;
  const trunkWidth = 8; // Тонкий ствол
  let currentHeight = 0;
  
  // Рисуем землю
  drawGround();
  
  // Анимация роста ствола
  const trunkInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    
    currentHeight += 4;
    if (currentHeight > trunkHeight) {
      currentHeight = trunkHeight;
      clearInterval(trunkInterval);
      
      // После роста ствола начинаем рисовать ветки
      setTimeout(() => {
        animateBranches(centerX, bottomY - trunkHeight, trunkWidth);
      }, 200);
      return;
    }
    
    // Рисуем растущий ствол с градиентом
    drawTrunk(centerX, bottomY, currentHeight, trunkWidth);
    
    // Добавляем эффект роста
    drawGrowthEffect(centerX, bottomY - currentHeight);
  }, 25);
}

// Рисуем землю
function drawGround() {
  const gradient = ctx.createLinearGradient(0, canvas.height * 0.85, 0, canvas.height);
  gradient.addColorStop(0, "#8B4513");
  gradient.addColorStop(0.3, "#A0522D");
  gradient.addColorStop(1, "#CD853F");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
  
  // Трава
  ctx.fillStyle = "#4CAF50";
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    const width = 1 + Math.random() * 2;
    const height = 8 + Math.random() * 12;
    const y = canvas.height * 0.85 - height + Math.random() * 5;
    ctx.fillRect(x, y, width, height);
  }
  
  // Цветочки на траве
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * 0.85 - 5;
    drawSmallFlower(x, y);
  }
}

// Маленькие цветочки на траве
function drawSmallFlower(x, y) {
  // Стебель
  ctx.strokeStyle = "#4CAF50";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 15);
  ctx.stroke();
  
  // Цветок
  const colors = ['#FF69B4', '#FF1493', '#FFB6C1'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y - 18, 3, 0, Math.PI * 2);
  ctx.fill();
}

// Рисуем ствол с текстурой
function drawTrunk(centerX, bottomY, height, width) {
  // Градиент для ствола
  const gradient = ctx.createLinearGradient(
    centerX - width/2, bottomY - height,
    centerX + width/2, bottomY
  );
  gradient.addColorStop(0, "#654321");
  gradient.addColorStop(0.5, "#8B4513");
  gradient.addColorStop(1, "#A0522D");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(centerX - width/2, bottomY - height, width, height);
  
  // Текстура коры
  ctx.strokeStyle = "rgba(50, 30, 20, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const x1 = centerX - width/2 + Math.random() * 2;
    const x2 = centerX + width/2 - Math.random() * 2;
    const y1 = bottomY - height + Math.random() * height;
    const y2 = y1 + 10 + Math.random() * 20;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

// Эффект роста
function drawGrowthEffect(x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  for (let i = 0; i < 15; i++) {
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = -5 - Math.random() * 10;
    const size = 1 + Math.random() * 2;
    const opacity = 0.3 + Math.random() * 0.7;
    
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Анимация веток
function animateBranches(centerX, startY, trunkWidth) {
  const branches = [
    { angle: -Math.PI/4, length: 90, x: centerX, y: startY, level: 1 },
    { angle: Math.PI/4, length: 90, x: centerX, y: startY, level: 1 },
    { angle: -Math.PI/6, length: 110, x: centerX, y: startY - 40, level: 1 },
    { angle: Math.PI/6, length: 110, x: centerX, y: startY - 40, level: 1 },
    { angle: -Math.PI/3, length: 80, x: centerX, y: startY - 80, level: 1 },
    { angle: Math.PI/3, length: 80, x: centerX, y: startY - 80, level: 1 }
  ];
  
  let branchIndex = 0;
  
  function drawBranch(branch, progress) {
    const lineWidth = branch.level === 1 ? 3 : 2;
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = lineWidth - progress * (lineWidth - 1);
    ctx.lineCap = "round";
    
    ctx.beginPath();
    ctx.moveTo(branch.x, branch.y);
    const endX = branch.x + Math.cos(branch.angle) * branch.length * progress;
    const endY = branch.y + Math.sin(branch.angle) * branch.length * progress;
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    return { x: endX, y: endY };
  }
  
  function animateNextBranch() {
    if (branchIndex >= branches.length) {
      // Начинаем анимацию цветов
      setTimeout(() => {
        animateFlowers();
      }, 300);
      return;
    }
    
    const branch = branches[branchIndex];
    let progress = 0;
    
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGround();
      
      // Рисуем ствол
      drawTrunk(canvas.width/2, canvas.height, 220, 8);
      
      // Рисуем все предыдущие ветки полностью
      for (let i = 0; i < branchIndex; i++) {
        drawBranch(branches[i], 1);
      }
      
      // Рисуем текущую ветку с прогрессом
      drawBranch(branch, progress);
      
      progress += 0.04;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
        branchIndex++;
        setTimeout(animateNextBranch, 50);
      }
    }, 30);
  }
  
  animateNextBranch();
}

// Анимация распускания цветов
function animateFlowers() {
  hearts = [];
  
  // Создаем сердечки на концах веток
  const branchEnds = [
    { x: canvas.width/2 - 65, y: canvas.height - 280 },
    { x: canvas.width/2 + 65, y: canvas.height - 280 },
    { x: canvas.width/2 - 95, y: canvas.height - 300 },
    { x: canvas.width/2 + 95, y: canvas.height - 300 },
    { x: canvas.width/2 - 40, y: canvas.height - 320 },
    { x: canvas.width/2 + 40, y: canvas.height - 320 }
  ];
  
  // Основные цветы на концах веток
  branchEnds.forEach((end, index) => {
    hearts.push({
      x: end.x,
      y: end.y,
      size: 0,
      maxSize: 14 + Math.random() * 6,
      color: getRandomFlowerColor(),
      delay: index * 150,
      type: 'main'
    });
  });
  
  // Дополнительные цветы вокруг веток
  for (let i = 0; i < 150; i++) {
    const baseIndex = Math.floor(Math.random() * branchEnds.length);
    const base = branchEnds[baseIndex];
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 70;
    
    hearts.push({
      x: base.x + Math.cos(angle) * distance,
      y: base.y + Math.sin(angle) * distance,
      size: 0,
      maxSize: 8 + Math.random() * 8,
      color: getRandomFlowerColor(),
      delay: 1000 + Math.random() * 2000,
      type: 'secondary'
    });
  }
  
  // Цветы по стволу
  for (let i = 0; i < 50; i++) {
    const progress = i / 50;
    hearts.push({
      x: canvas.width/2 + (Math.random() - 0.5) * 20,
      y: canvas.height - 220 + (220 * progress),
      size: 0,
      maxSize: 6 + Math.random() * 6,
      color: getRandomFlowerColor(),
      delay: 2500 + Math.random() * 1500,
      type: 'trunk'
    });
  }
  
  // Анимируем распускание всех сердечек
  hearts.forEach((heart, index) => {
    setTimeout(() => {
      bloomHeart(heart);
    }, heart.delay);
  });
  
  // Добавляем мерцание
  setInterval(() => {
    if (animationComplete) {
      drawScene();
    }
  }, 100);
  
  // Звёзды на небе
  setInterval(drawStars, 100);
}

// Получаем случайный цвет для цветка
function getRandomFlowerColor() {
  const colors = [
    '#FF69B4', // Hot Pink
    '#FF1493', // Deep Pink
    '#FFB6C1', // Light Pink
    '#FFC0CB', // Pink
    '#DB7093', // Pale Violet Red
    '#FF69B4', // Hot Pink
    '#C71585', // Medium Violet Red
    '#E91E63', // Pink (Material)
    '#F44336', // Red (Material)
    '#FF5252', // Red Accent (Material)
    '#FF80AB', // Pink 200
    '#F06292'  // Pink 300
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Анимация распускания сердца
function bloomHeart(heart) {
  const bloomInterval = setInterval(() => {
    heart.size += 0.6;
    if (heart.size >= heart.maxSize) {
      heart.size = heart.maxSize;
      clearInterval(bloomInterval);
      
      // Добавляем легкое мерцание после распускания
      heart.pulse = true;
      heart.pulseOffset = Math.random() * Math.PI * 2;
      
      // Помечаем что все цветы распустились
      const allBloomed = hearts.every(h => h.size >= h.maxSize);
      if (allBloomed) {
        animationComplete = true;
        drawScene();
      }
      
      return;
    }
    if (animationComplete) drawScene();
  }, 25);
}

// Рисуем всю сцену
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround();
  
  // Ствол
  drawTrunk(canvas.width/2, canvas.height, 220, 8);
  
  // Ветки
  ctx.strokeStyle = "#8B4513";
  ctx.lineCap = "round";
  
  const branches = [
    { angle: -Math.PI/4, length: 90, x: canvas.width/2, y: canvas.height - 220 },
    { angle: Math.PI/4, length: 90, x: canvas.width/2, y: canvas.height - 220 },
    { angle: -Math.PI/6, length: 110, x: canvas.width/2, y: canvas.height - 260 },
    { angle: Math.PI/6, length: 110, x: canvas.width/2, y: canvas.height - 260 },
    { angle: -Math.PI/3, length: 80, x: canvas.width/2, y: canvas.height - 300 },
    { angle: Math.PI/3, length: 80, x: canvas.width/2, y: canvas.height - 300 }
  ];
  
  branches.forEach(branch => {
    ctx.lineWidth = branch === branches[0] || branch === branches[1] ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(branch.x, branch.y);
    ctx.lineTo(
      branch.x + Math.cos(branch.angle) * branch.length,
      branch.y + Math.sin(branch.angle) * branch.length
    );
    ctx.stroke();
  });
  
  // Сердечки
  hearts.forEach(heart => {
    if (heart.pulse) {
      const pulseSize = heart.maxSize + Math.sin(Date.now() / 300 + heart.pulseOffset) * 0.8;
      drawHeart(heart.x, heart.y, pulseSize, heart.color);
    } else {
      drawHeart(heart.x, heart.y, heart.size, heart.color);
    }
  });
}

// Рисуем сердце
function drawHeart(x, y, size, color) {
  if (size <= 0) return;
  
  // Тень
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Основное сердце
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, shadeColor(color, -20));
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.5);
  ctx.bezierCurveTo(
    x - size * 0.5, y - size * 0.2,
    x - size, y + size * 0.5,
    x, y + size * 1.5
  );
  ctx.bezierCurveTo(
    x + size, y + size * 0.5,
    x + size * 0.5, y - size * 0.2,
    x, y + size * 0.5
  );
  ctx.fill();
  
  // Блик
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.ellipse(x - size * 0.2, y - size * 0.1, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Убираем тень
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// Функция для затемнения цвета
function shadeColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

// Рисуем мерцающие звёзды
function drawStars() {
  if (!animationComplete) return;
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.7;
    const size = 0.5 + Math.random() * 1.5;
    const opacity = 0.2 + Math.random() * 0.8;
    
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function startTimer() {
  const startDate = new Date("2024-02-14T00:00:00");
  const timeElement = document.getElementById("time");
  
  const timer = setInterval(() => {
    const now = new Date();
    const diffMs = now - startDate;
    
    if (diffMs < 0) {
      timeElement.innerText = "0 días 00 horas 00 minutos 00 segundos";
      clearInterval(timer);
      return;
    }

    let diff = Math.floor(diffMs / 1000);
    const days = Math.floor(diff / 86400);
    diff %= 86400;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    timeElement.innerText = 
      `${days} día${days !== 1 ? 's' : ''} ` +
      `${hours.toString().padStart(2, '0')} hora${hours !== 1 ? 's' : ''} ` +
      `${minutes.toString().padStart(2, '0')} minuto${minutes !== 1 ? 's' : ''} ` +
      `${seconds.toString().padStart(2, '0')} segundo${seconds !== 1 ? 's' : ''}`;
  }, 1000);
}м