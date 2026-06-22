document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const formulaLine = document.getElementById('formulaLine');
  const resultLine = document.getElementById('resultLine');
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const muteToggleBtn = document.getElementById('muteToggleBtn');
  const historyPanel = document.getElementById('historyPanel');
  const historyList = document.getElementById('historyList');
  const appContainer = document.querySelector('.app-container');
  const keys = document.querySelectorAll('.key');

  // App State
  let currentInput = '0';
  let previousInput = '';
  let activeOperation = null;
  let shouldResetDisplay = false;
  let history = JSON.parse(localStorage.getItem('incode_calc_history')) || [];
  
  // Audio state
  let audioCtx = null;
  let isMuted = JSON.parse(localStorage.getItem('incode_calc_muted')) !== false; // default to muted (true)

  // Initialize
  updateHistoryUI();
  updateMuteUI();

  // History Toggle click
  historyToggleBtn.addEventListener('click', () => {
    appContainer.classList.toggle('history-open');
    playClickSound(700, 0.04);
  });

  // Clear History
  clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('incode_calc_history');
    updateHistoryUI();
    playClickSound(400, 0.08);
  });

  // Mute/Unmute Toggle click
  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('incode_calc_muted', JSON.stringify(isMuted));
      updateMuteUI();
      if (!isMuted) {
        // Play quick pleasant sound to confirm audio active
        playClickSound(800, 0.06);
      }
    });
  }

  // Setup Button Click Event Handlers
  keys.forEach(key => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-value');
      const action = key.getAttribute('data-action');

      // Click sound synthesis
      if (action === 'calculate') {
        playClickSound(880, 0.08);
      } else if (action === 'all-clear' || action === 'delete') {
        playClickSound(450, 0.06);
      } else {
        playClickSound(600, 0.03);
      }

      if (val !== null) {
        handleValueInput(val);
      } else if (action !== null) {
        handleActionInput(action);
      }
    });
  });

  // Setup Keyboard Input Event Listeners
  window.addEventListener('keydown', (e) => {
    let keyChar = e.key;
    
    // Normalize keys
    if (keyChar === 'Enter') {
      e.preventDefault();
      keyChar = '=';
    } else if (keyChar === 'Escape') {
      keyChar = 'AC';
    } else if (keyChar === 'Backspace') {
      keyChar = 'delete';
    }

    // Find the matching button on screen
    let targetButton = null;
    keys.forEach(btn => {
      const btnVal = btn.getAttribute('data-value');
      const btnAction = btn.getAttribute('data-action');

      if (btnVal === keyChar) {
        targetButton = btn;
      } else if (keyChar === 'AC' && btnAction === 'all-clear') {
        targetButton = btn;
      } else if (keyChar === 'delete' && btnAction === 'delete') {
        targetButton = btn;
      } else if (keyChar === '=' && btnAction === 'calculate') {
        targetButton = btn;
      }
    });

    if (targetButton) {
      // Trigger visually active press style
      targetButton.classList.add('key-press-effect');
      setTimeout(() => {
        targetButton.classList.remove('key-press-effect');
      }, 100);

      // Perform action (this will automatically trigger playClickSound inside the click handler)
      targetButton.click();
    }
  });

  // Core Value Input Handlers
  function handleValueInput(val) {
    if (['+', '-', '*', '/'].includes(val)) {
      setOperator(val);
    } else if (val === '%') {
      applyPercentage();
    } else {
      appendNumber(val);
    }
  }

  // Core Action Input Handlers
  function handleActionInput(action) {
    switch (action) {
      case 'all-clear':
        allClear();
        break;
      case 'delete':
        backspace();
        break;
      case 'negate':
        toggleSign();
        break;
      case 'calculate':
        calculate();
        break;
    }
  }

  // App functions
  function appendNumber(num) {
    if (shouldResetDisplay) {
      currentInput = '';
      shouldResetDisplay = false;
    }

    if (currentInput.replace('.', '').length >= 15) return;
    if (num === '.' && currentInput.includes('.')) return;

    if (currentInput === '0' && num !== '.') {
      currentInput = num;
    } else {
      currentInput += num;
    }

    updateDisplay();
  }

  function setOperator(operator) {
    if (activeOperation && !shouldResetDisplay) {
      calculate();
    }
    
    previousInput = currentInput;
    activeOperation = operator;
    shouldResetDisplay = true;
    
    updateDisplay();
  }

  function applyPercentage() {
    let value = parseFloat(currentInput);
    if (isNaN(value)) return;
    
    currentInput = String(parseFloat((value / 100).toFixed(10)));
    updateDisplay();
  }

  function toggleSign() {
    if (currentInput === '0') return;
    
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  }

  function allClear() {
    currentInput = '0';
    previousInput = '';
    activeOperation = null;
    shouldResetDisplay = false;
    updateDisplay();
  }

  function backspace() {
    if (shouldResetDisplay) return;
    
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateDisplay();
  }

  function calculate() {
    if (!activeOperation || previousInput === '') return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;

    let result = 0;
    switch (activeOperation) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '*':
        result = prev * curr;
        break;
      case '/':
        if (curr === 0) {
          resultLine.textContent = 'Error: Div by 0';
          currentInput = '0';
          previousInput = '';
          activeOperation = null;
          shouldResetDisplay = true;
          return;
        }
        result = prev / curr;
        break;
    }

    result = parseFloat(result.toFixed(10));
    const formulaStr = `${previousInput} ${getOperatorSymbol(activeOperation)} ${currentInput}`;
    
    const historyItem = { formula: formulaStr, result: String(result) };
    history.unshift(historyItem);
    
    if (history.length > 30) history.pop();
    
    localStorage.setItem('incode_calc_history', JSON.stringify(history));

    currentInput = String(result);
    previousInput = '';
    activeOperation = null;
    shouldResetDisplay = true;

    // Trigger visual neon burst
    triggerGlowBurst();

    // Update displays
    formulaLine.textContent = formulaStr + ' =';
    resultLine.textContent = formatOutput(currentInput);
    
    updateHistoryUI();
  }

  // Update Display Elements
  function updateDisplay() {
    if (activeOperation) {
      formulaLine.textContent = `${previousInput} ${getOperatorSymbol(activeOperation)}`;
    } else {
      formulaLine.textContent = '';
    }
    resultLine.textContent = formatOutput(currentInput);
  }

  // Helper formatting for screen output
  function formatOutput(numStr) {
    if (numStr === 'Error: Div by 0') return numStr;
    
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    const formattedInt = Number(integerPart).toLocaleString('en-US', {
      maximumFractionDigits: 0
    });
    
    return formattedInt + decimalPart;
  }

  function getOperatorSymbol(op) {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return '';
    }
  }

  // Render History UI List
  updateHistoryUI();

  function updateHistoryUI() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
      historyList.innerHTML = '<div class="empty-history-msg">No recent calculations</div>';
      return;
    }

    history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.setAttribute('data-index', index);
      historyItem.innerHTML = `
        <div class="history-item-expr">${item.formula}</div>
        <div class="history-item-res">${item.result}</div>
      `;

      historyItem.addEventListener('click', () => {
        playClickSound(750, 0.04);
        currentInput = item.result;
        previousInput = '';
        activeOperation = null;
        shouldResetDisplay = true;
        formulaLine.textContent = item.formula + ' =';
        resultLine.textContent = formatOutput(currentInput);
      });

      historyList.appendChild(historyItem);
    });
  }

  // Audio mute UI updater
  function updateMuteUI() {
    if (!muteToggleBtn) return;
    const icon = muteToggleBtn.querySelector('i');
    if (isMuted) {
      icon.className = 'fa-solid fa-volume-xmark';
      muteToggleBtn.classList.remove('active');
    } else {
      icon.className = 'fa-solid fa-volume-high';
      muteToggleBtn.classList.add('active');
    }
  }

  // Web Audio synth click player
  function playClickSound(freq = 600, duration = 0.05) {
    if (isMuted) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext blocked or failed: ", e);
    }
  }

  // Neon glow burst effect on calculate
  function triggerGlowBurst() {
    const display = document.querySelector('.calculator-display');
    if (display) {
      display.classList.remove('glow-burst');
      void display.offsetWidth; // Reflow
      display.classList.add('glow-burst');
    }
  }
});
