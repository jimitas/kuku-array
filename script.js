(function () {
  "use strict";

  // 設定オブジェクトで管理
  const CONFIG = {
    GRID_SIZE: 9,
    SOUND_ENABLED: true,
    ANIMATION_DURATION: 120,
    INITIAL_MULTIPLICAND: 1,
    INITIAL_MULTIPLIER: 1,
    COLORS: {
      PRIMARY: '#2563eb',
      SECONDARY: '#ec4899'
    }
  };

  // 効果音のオーディオオブジェクトを作成
  const piSound = new Audio("sounds/pi.mp3");
  const pi2Sound = new Audio("sounds/pi2.mp3");

  // アプリケーションの状態管理
  const state = {
    currentMultiplicand: CONFIG.INITIAL_MULTIPLICAND,
    currentMultiplier: CONFIG.INITIAL_MULTIPLIER,
    hasInteracted: true,
    showAnswer: true
  };

  // ユーティリティ関数
  function queryAll(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function playSound(audio, fallbackMessage = "効果音の再生に失敗しました") {
    if (!CONFIG.SOUND_ENABLED) return;
    
    try {
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.warn(`${fallbackMessage}:`, e);
      });
    } catch (e) {
      console.warn(`${fallbackMessage}:`, e);
    }
  }

  // 計算式の更新
  function updateEquation() {
    const el = document.getElementById("equationDisplay");
    if (!el) return;
    
    const { currentMultiplicand: a, currentMultiplier: b, showAnswer } = state;
    const c = a * b;
    
    if (showAnswer) {
      el.innerHTML = `<span class="first-number">${a}</span> × <span class="second-number">${b}</span> = <span class="result">${c}</span>`;
    } else {
      el.innerHTML = `<span class="first-number">${a}</span> × <span class="second-number">${b}</span> = <span class="result">?</span>`;
    }
  }

  // トグルボタンの設定
  function setupToggleButton() {
    const btn = document.getElementById("toggleAnswerBtn");
    if (!btn) return;
    
    const syncButtonState = () => {
      btn.setAttribute("aria-pressed", String(state.showAnswer));
      btn.textContent = state.showAnswer ? "答えをかくす" : "答えをみせる";
    };
    
    syncButtonState();
    
    btn.addEventListener("click", () => {
      state.showAnswer = !state.showAnswer;
      syncButtonState();
      updateEquation();
      playSound(pi2Sound, "効果音「pi2」の再生に失敗しました");
    });
  }

  // ボタン生成の共通処理
  function createButton(config) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(config.value);
    button.setAttribute("data-value", String(config.value));
    button.setAttribute("aria-label", config.ariaLabel);
    button.setAttribute("aria-pressed", String(config.isSelected));
    
    if (config.isSelected) {
      button.classList.add("selected");
    }
    
    button.addEventListener("click", config.onClick);
    return button;
  }

  // 上段コントロールの構築
  function buildTopControls() {
    const topControls = document.getElementById("topControls");
    if (!topControls) return;

    for (let value = 1; value <= CONFIG.GRID_SIZE; value += 1) {
      const isSelected = value === state.currentMultiplier;
      const button = createButton({
        value,
        ariaLabel: `${value}（かける数）`,
        isSelected,
        onClick: () => onTopButtonClick(value)
      });
      
      topControls.appendChild(button);
    }
  }

  // 左側コントロールの構築
  function buildLeftControls() {
    const leftControls = document.getElementById("leftControls");
    if (!leftControls) return;

    for (let value = 1; value <= CONFIG.GRID_SIZE; value += 1) {
      const isSelected = value === state.currentMultiplicand;
      const button = createButton({
        value,
        ariaLabel: `${value}（かけられる数）`,
        isSelected,
        onClick: () => onLeftButtonClick(value)
      });
      
      leftControls.appendChild(button);
    }
  }

  // コントロールの構築
  function buildControls() {
    buildTopControls();
    buildLeftControls();
  }

  // グリッドの構築
  function buildGrid() {
    const grid = document.getElementById("arrayGrid");
    if (!grid) return;
    
    grid.innerHTML = "";

    for (let rowIndex = 1; rowIndex <= CONFIG.GRID_SIZE; rowIndex += 1) {
      for (let colIndex = 1; colIndex <= CONFIG.GRID_SIZE; colIndex += 1) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.setAttribute("data-row", String(rowIndex));
        dot.setAttribute("data-col", String(colIndex));
        grid.appendChild(dot);
      }
    }
  }

  // 選択状態のボタン更新
  function updateSelectedButtons() {
    const topButtons = queryAll("#topControls button");
    const leftButtons = queryAll("#leftControls button");

    topButtons.forEach((btn) => {
      const value = Number(btn.getAttribute("data-value"));
      const selected = value === state.currentMultiplier;
      btn.classList.toggle("selected", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });

    leftButtons.forEach((btn) => {
      const value = Number(btn.getAttribute("data-value"));
      const selected = value === state.currentMultiplicand;
      btn.classList.toggle("selected", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
  }

  // アレイの点灯処理
  function lightArray() {
    const dots = queryAll("#arrayGrid .dot");
    if (!dots.length) return;

    // 一旦全て消灯
    dots.forEach((dot) => dot.classList.remove("lit"));

    // 初回クリック前は何も点灯しない
    if (!state.hasInteracted) return;

    // currentMultiplicand 行 × currentMultiplier 列 の矩形を点灯
    for (let row = 1; row <= state.currentMultiplicand; row += 1) {
      for (let col = 1; col <= state.currentMultiplier; col += 1) {
        const selector = `.dot[data-row="${row}"][data-col="${col}"]`;
        const dot = document.querySelector(selector);
        if (dot) dot.classList.add("lit");
      }
    }
  }

  // 上段ボタンクリック時の処理
  function onTopButtonClick(value) {
    state.currentMultiplier = value;
    state.hasInteracted = true;
    updateSelectedButtons();
    lightArray();
    updateEquation();
    playSound(piSound, "効果音「pi」の再生に失敗しました");
  }

  // 左側ボタンクリック時の処理
  function onLeftButtonClick(value) {
    state.currentMultiplicand = value;
    state.hasInteracted = true;
    updateSelectedButtons();
    lightArray();
    updateEquation();
    playSound(piSound, "効果音「pi」の再生に失敗しました");
  }

  // アプリケーションの初期化
  function initializeApp() {
    buildControls();
    buildGrid();
    setupToggleButton();
    updateSelectedButtons();
    lightArray();
    updateEquation();
  }

  // DOMContentLoadedイベントで初期化
  window.addEventListener("DOMContentLoaded", initializeApp);

  // 必要に応じて外部からアクセス可能なメソッドを公開
  window.KukuArray = {
    // 現在の状態を取得
    getState: () => ({ ...state }),
    
    // 特定の計算式を設定
    setEquation: (multiplicand, multiplier) => {
      if (multiplicand >= 1 && multiplicand <= CONFIG.GRID_SIZE &&
          multiplier >= 1 && multiplier <= CONFIG.GRID_SIZE) {
        state.currentMultiplicand = multiplicand;
        state.currentMultiplier = multiplier;
        state.hasInteracted = true;
        updateSelectedButtons();
        lightArray();
        updateEquation();
      }
    },
    
    // 答えの表示/非表示を切り替え
    toggleAnswer: () => {
      state.showAnswer = !state.showAnswer;
      const btn = document.getElementById("toggleAnswerBtn");
      if (btn) {
        btn.setAttribute("aria-pressed", String(state.showAnswer));
        btn.textContent = state.showAnswer ? "答えをかくす" : "答えをみせる";
      }
      updateEquation();
    }
  };

})(); 