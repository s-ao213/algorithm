class SieveOfEratosthenes {
    constructor() {
        this.maxNumber = 30;
        this.numbers = [];
        this.currentStep = 0;
        this.currentPrime = 2;
        this.isRunning = false;
        this.isAutoRunning = false;
        this.speed = 800;
        this.primes = [];
        this.eliminated = [];
        
        this.initializeElements();
        this.bindEvents();
        this.setupGrid();
    }

    initializeElements() {
        this.maxNumberInput = document.getElementById('maxNumber');
        this.startBtn = document.getElementById('startBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.autoBtn = document.getElementById('autoBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.numberGrid = document.getElementById('numberGrid');
        this.stepDescription = document.getElementById('stepDescription');
        this.currentNumber = document.getElementById('currentNumber');
        this.primeCount = document.getElementById('primeCount');
        this.eliminatedCount = document.getElementById('eliminatedCount');
        this.primeNumbers = document.getElementById('primeNumbers');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stepBtn.addEventListener('click', () => this.nextStep());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.autoBtn.addEventListener('click', () => this.toggleAutoRun());
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
        });
        this.maxNumberInput.addEventListener('change', () => {
            this.maxNumber = parseInt(this.maxNumberInput.value);
            this.reset();
        });
    }

    setupGrid() {
        this.numberGrid.innerHTML = '';
        this.numbers = [];
        
        for (let i = 2; i <= this.maxNumber; i++) {
            this.numbers.push({
                value: i,
                status: 'available' // available, current, prime, eliminated, checking
            });
        }

        this.renderGrid();
    }

    renderGrid() {
        this.numberGrid.innerHTML = '';
        
        this.numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.className = `number-cell ${num.status}`;
            cell.textContent = num.value;
            cell.dataset.value = num.value;
            this.numberGrid.appendChild(cell);
        });
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentStep = 0;
        this.currentPrime = 2;
        // this.primes = [];
        // this.eliminated = [];
        
        this.startBtn.disabled = true;
        this.stepBtn.disabled = false;
        this.maxNumberInput.disabled = true;
        
        this.updateStats();
        this.updateStepDescription('アルゴリズムを開始します。最初の素数は2です。');
        
        // 最初のステップを実行
        this.nextStep();
    }

    nextStep() {
        if (!this.isRunning) return;

        const sqrtMax = Math.sqrt(this.maxNumber);
        
        if (this.currentPrime > sqrtMax|this.primes.length+this.eliminated.length == this.maxNumber-1) {
            this.finishAlgorithm();
            return;
        }

        // 現在の素数を見つける
        let found = false;
        for (let i = 0; i < this.numbers.length; i++) {
            if (this.numbers[i].value === this.currentPrime && this.numbers[i].status === 'available') {
                // 現在の数を素数としてマーク
                this.numbers[i].status = 'prime';
                this.primes.push(this.currentPrime);
                found = true;
                break;
            }
        }

        if (found) {
            this.eliminateMultiples(this.currentPrime);
            this.updateStepDescription(`${this.currentPrime}は素数です。${this.currentPrime}の倍数を除外しています。`);
        }

        // 次の素数を探す
        this.currentPrime = this.findNextPrime(this.currentPrime + 1);
        
        this.renderGrid();
        this.updateStats();
        this.updatePrimeList();
        
        if (this.isAutoRunning && this.isRunning) {
            setTimeout(() => this.nextStep(), this.speed);
        }
    }

    eliminateMultiples(prime) {
        for (let i = prime * prime; i <= this.maxNumber; i += prime) {
            const index = this.numbers.findIndex(num => num.value === i);
            if (index !== -1 && this.numbers[index].status === 'available') {
                this.numbers[index].status = 'eliminated';
                this.eliminated.push(i);
            }
        }
    }

    findNextPrime(start) {
        for (let i = start; i <= this.maxNumber; i++) {
            const number = this.numbers.find(num => num.value === i);
            if (number && number.status === 'available') {
                return i;
            }
        }
        return this.maxNumber + 1; // 見つからない場合
    }

    finishAlgorithm() {
        // 残りの利用可能な数を素数としてマーク
        this.numbers.forEach(num => {
            if (num.status === 'available') {
                num.status = 'prime';
                this.primes.push(num.value);
            }
        });
        
        this.isRunning = false;
        this.isAutoRunning = false;
        
        this.startBtn.disabled = false;
        this.stepBtn.disabled = true;
        this.maxNumberInput.disabled = false;
        this.autoBtn.textContent = '自動実行';
        
        this.renderGrid();
        this.updateStats();
        this.updatePrimeList();
        this.updateStepDescription('アルゴリズムが完了しました！すべての素数が見つかりました。');
    }

    toggleAutoRun() {
        if (!this.isRunning) {
            this.start();
            return; // start()メソッド内でnextStep()が呼ばれるので、ここで処理を終了
        }
        
        this.isAutoRunning = !this.isAutoRunning;
        this.autoBtn.textContent = this.isAutoRunning ? '停止' : '自動実行';
        
        if (this.isAutoRunning) {
            this.stepBtn.disabled = true;
            setTimeout(() => this.nextStep(), this.speed);
        } else {
            this.stepBtn.disabled = false;
        }
    }

    reset() {
        this.isRunning = false;
        this.isAutoRunning = false;
        this.currentStep = 0;
        this.currentPrime = 2;
        this.primes = [];
        this.eliminated = [];
        
        this.startBtn.disabled = false;
        this.stepBtn.disabled = true;
        this.maxNumberInput.disabled = false;
        this.autoBtn.textContent = '自動実行';
        
        this.maxNumber = parseInt(this.maxNumberInput.value);
        this.setupGrid();
        this.updateStats();
        this.updatePrimeList();
        this.updateStepDescription('「開始」ボタンを押してアルゴリズムを開始してください');
    }

    updateStats() {
        this.currentNumber.textContent = this.isRunning ? this.currentPrime : '-';
        this.primeCount.textContent = this.primes.length;
        this.eliminatedCount.textContent = this.eliminated.length;
    }

    updatePrimeList() {
        this.primeNumbers.innerHTML = '';
        this.primes.forEach(prime => {
            const primeElement = document.createElement('div');
            primeElement.className = 'prime-number';
            primeElement.textContent = prime;
            this.primeNumbers.appendChild(primeElement);
        });
    }

    updateStepDescription(text) {
        this.stepDescription.textContent = text;
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new SieveOfEratosthenes();
});

// 追加のユーティリティ関数
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function generatePrimesUpTo(n) {
    const primes = [];
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }
    
    for (let i = 2; i <= n; i++) {
        if (sieve[i]) primes.push(i);
    }
    
    return primes;
}
