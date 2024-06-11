const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let expression = '';
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('dark') || button.classList.contains('btn-zero')) {
            handleNumber(value);
        } else if (button.classList.contains('orange') && button.id !== 'equals') {
            handleOperator(value);
        } else if (button.id === 'all-clear') {
            handleAllClear();
        } else if (button.id === 'equals') {
            handleEquals();
        } else if (value === '.') {
            handleDecimal();
        }
    });
});

function handleNumber(num) {
    if (shouldResetDisplay) {
        expression = num;
        shouldResetDisplay = false;
    } else {
        expression += num;
    }
    updateDisplay(expression);
}

function handleOperator(op) {
    if (shouldResetDisplay && /[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1) + op;
    } else {
        if (expression === '') {
            expression = '0' + op;
        } else {
            expression += op;
        }
        shouldResetDisplay = false;
    }
    updateDisplay(expression);
}

function handleEquals() {
    try {
        let result = calculateExpression(expression);
        expression = result.toString();
        shouldResetDisplay = true;
        updateDisplay(expression);
    } catch (error) {
        expression = '';
        updateDisplay('Error');
    }
}

function handleAllClear() {
    expression = '';
    shouldResetDisplay = false;
    updateDisplay('');
}

function handleDecimal() {
    if (shouldResetDisplay) {
        expression = '0.';
        shouldResetDisplay = false;
    } else {
        const lastSegment = expression.split(/[+\-*/]/).pop();
        if (!lastSegment.includes('.')) {
            expression += '.';
        }
    }
    updateDisplay(expression);
}

function calculateExpression(expr) {
    let tokens = expr.split(/([+\-*/])/).filter(Boolean);
    let stack = [];
    let operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
    };

    let currentOperator = null;

    tokens.forEach(token => {
        if (operators[token]) {
            currentOperator = token;
        } else {
            if (currentOperator) {
                let b = parseFloat(token);
                let a = stack.pop();
                stack.push(operators[currentOperator](a, b));
                currentOperator = null;
            } else {
                stack.push(parseFloat(token));
            }
        }
    });

    return stack[0];
}

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay('');
});

function updateDisplay(value) {
    display.textContent = value;
}


