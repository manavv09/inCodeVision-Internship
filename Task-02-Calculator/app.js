document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const formulaLine = document.getElementById('formulaLine');
  const resultLine = document.getElementById('resultLine');
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
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

  // Initialize History Panel view
  updateHistoryUI();

  // History Toggle click
  historyToggleBtn.addEventListener('click', () => {
    appContainer.classList.toggle('history-open');
  });

  // Clear History
  clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('incode_calc_history');
    updateHistoryUI();
  });

  // Setup Button Click Event Handlers
  keys.forEach(key => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-value');
      const action = key.getAttribute('data-action');

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

      // Perform action
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
    // If we just pressed equals or set an operator, reset display on next number click
    if (shouldResetDisplay) {
      currentInput = '';
      shouldResetDisplay = false;
    }

    // Limit length to prevent layout breaks
    if (currentInput.replace('.', '').length >= 15) return;

    // Prevent duplicate decimal points
    if (num === '.' && currentInput.includes('.')) return;

    // Fix leading zeros
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

    // Round to avoid float point issues (e.g. 0.1 + 0.2 = 0.30000004)
    result = parseFloat(result.toFixed(10));

    // Save calculation formula for display
    const formulaStr = `${previousInput} ${getOperatorSymbol(activeOperation)} ${currentInput}`;
    
    // Save to history list
    const historyItem = { formula: formulaStr, result: String(result) };
    history.unshift(historyItem);
    
    // Cap history size to 30 items
    if (history.length > 30) history.pop();
    
    localStorage.setItem('incode_calc_history', JSON.stringify(history));

    currentInput = String(result);
    previousInput = '';
    activeOperation = null;
    shouldResetDisplay = true;

    // Update displays
    formulaLine.textContent = formulaStr + ' =';
    resultLine.textContent = formatOutput(currentInput);
    
    updateHistoryUI();
  }

  // Update Display Elements
  function updateDisplay() {
    // Current ongoing formula line
    if (activeOperation) {
      formulaLine.textContent = `${previousInput} ${getOperatorSymbol(activeOperation)}`;
    } else {
      formulaLine.textContent = '';
    }

    // Current entry line
    resultLine.textContent = formatOutput(currentInput);
  }

  // Helper formatting for screen output
  function formatOutput(numStr) {
    if (numStr === 'Error: Div by 0') return numStr;
    
    // Add comma grouping for large numbers
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // Format integer grouping
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

      // Loading formula from history item on click
      historyItem.addEventListener('click', () => {
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
});
