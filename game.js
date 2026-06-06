class Vildoku {
    constructor() {
        this.size = 9;
        this.sqrt = 3;
        this.board = [];
        this.solution = [];
        this.fixedIndices = new Set();
        this.selectedIdx = null;
        this.difficulty = 'medium';
        this.mode = 'classic';
        this.seconds = 0;
        this.lives = 3; // Başlangıç canı (3/3)
        this.timerInterval = null;
        this.isPaused = true;

        this.init();
    }

    init() {
        this.setupEventListeners();
        if (!this.loadGame()) {
            this.showMenu();
        } else {
            this.resumeGame();
        }
    }

    setupEventListeners() {
        document.getElementById('pause-btn').onclick = () => this.pauseGame();
        document.getElementById('resume-btn').onclick = () => this.resumeGame();
        document.getElementById('new-game-btn').onclick = () => this.showMenu();
        document.getElementById('delete-btn').onclick = () => this.inputValue(0);
        
        document.getElementById('btn-classic').onclick = () => this.selectMode('classic');
        document.getElementById('btn-hex').onclick = () => this.selectMode('hex');
    }

    selectMode(mode) {
        this.mode = mode;
        this.size = mode === 'hex' ? 16 : 9;
        this.sqrt = Math.sqrt(this.size);
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${mode}`).classList.add('active');
        document.getElementById('mode-display').textContent = `${this.size}x${this.size}`;
        document.documentElement.style.setProperty('--grid-size', this.size);
    }

    selectDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        // Butonların içeriğine göre active class'ını ekle
        document.querySelectorAll('.diff-btn').forEach(b => {
            if(b.textContent.toLowerCase() === level) b.classList.add('active');
        });
        
        this.newGame();
        this.resumeGame();
    }

    newGame() {
        this.seconds = 0;
        this.lives = 3; // Yeni oyunda can sıfırlanır
        this.board = Array(this.size * this.size).fill(0);
        
        document.getElementById('modal-title').textContent = "Generating puzzle...";
        
        setTimeout(() => {
            this.generateFullSolution();
            this.solution = [...this.board];
            
            const rates = {
                'classic': { 'easy': 0.4, 'medium': 0.5, 'hard': 0.65 },
                'hex': { 'easy': 0.3, 'medium': 0.4, 'hard': 0.5 }
            };
            
            let toRemove = Math.floor(this.board.length * rates[this.mode][this.difficulty]);
            this.fixedIndices.clear();
            for(let i=0; i<this.board.length; i++) this.fixedIndices.add(i);

            while(toRemove > 0) {
                let idx = Math.floor(Math.random() * this.board.length);
                if(this.board[idx] !== 0) {
                    this.board[idx] = 0;
                    this.fixedIndices.delete(idx);
                    toRemove--;
                }
            }
            
            document.getElementById('diff-display').textContent = this.difficulty.toUpperCase();
            this.updateLivesDisplay();
            this.saveGame();
            this.render();
            this.startTimer();
            this.resumeGame();
        }, 50);
    }

    generateFullSolution() {
        const solve = (idx) => {
            if (idx === this.board.length) return true;
            let nums = [];
            for(let i=1; i<=this.size; i++) nums.push(i);
            nums.sort(() => Math.random() - 0.5);

            for (let n of nums) {
                if (this.isValidMove(this.board, idx, n)) {
                    this.board[idx] = n;
                    if (solve(idx + 1)) return true;
                    this.board[idx] = 0;
                }
            }
            return false;
        };
        solve(0);
    }

    isValidMove(board, idx, n) {
        let r = Math.floor(idx / this.size), c = idx % this.size;
        for (let i=0; i<this.size; i++) {
            if (board[r * this.size + i] === n || board[i * this.size + c] === n) return false;
        }
        let bR = Math.floor(r / this.sqrt) * this.sqrt, bC = Math.floor(c / this.sqrt) * this.sqrt;
        for (let i=0; i<this.sqrt; i++) {
            for (let j=0; j<this.sqrt; j++) {
                if (board[(bR + i) * this.size + (bC + j)] === n) return false;
            }
        }
        return true;
    }

    inputValue(n) {
        if (this.selectedIdx === null || this.fixedIndices.has(this.selectedIdx) || this.isPaused) return;

        if (n !== 0 && n !== this.solution[this.selectedIdx]) {
            this.lives--;
            this.updateLivesDisplay();
            if (this.lives <= 0) {
                setTimeout(() => {
                    alert("Game Over! No more chances left. Let's start a new game.");
                    this.showMenu();
                }, 100);
                return;
            }
        }

        this.board[this.selectedIdx] = n;
        this.saveGame();
        this.render();
        this.checkWin();
    }

    render() {
        const boardEl = document.getElementById('sudoku-board');
        boardEl.innerHTML = '';
        const selVal = this.board[this.selectedIdx];

        this.board.forEach((val, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const r = Math.floor(i / this.size), c = i % this.size;
            
            if ((c + 1) % this.sqrt === 0 && c !== this.size - 1) cell.classList.add('thick-right');
            if ((r + 1) % this.sqrt === 0 && r !== this.size - 1) cell.classList.add('thick-bottom');

            if (val !== 0) {
                cell.textContent = this.valToChar(val);
                cell.classList.add(this.fixedIndices.has(i) ? 'fixed' : 'user-val');
                if (val !== this.solution[i]) cell.classList.add('error');
            }
            if (this.selectedIdx === i) cell.classList.add('selected');
            if (val !== 0 && val === selVal) cell.classList.add('highlighted');
            
            cell.onclick = () => { this.selectedIdx = i; this.render(); };
            boardEl.appendChild(cell);
        });
        this.updateNumpad();
    }

    valToChar(v) {
        if (v <= 9) return v;
        return String.fromCharCode(55 + v);
    }

    updateNumpad() {
        const pad = document.getElementById('numpad');
        pad.innerHTML = '';
        const counts = Array(this.size + 1).fill(0);
        this.board.forEach((v, i) => { if(v !== 0 && v === this.solution[i]) counts[v]++; });

        for(let i=1; i<=this.size; i++) {
            const btn = document.createElement('button');
            btn.className = `num-btn ${counts[i] >= this.size ? 'done' : ''}`;
            btn.innerHTML = `<span>${this.valToChar(i)}</span><sub>${this.size - counts[i]}</sub>`;
            btn.onclick = () => this.inputValue(i);
            pad.appendChild(btn);
        }
    }

    startTimer() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if(!this.isPaused) {
                this.seconds++;
                const m = Math.floor(this.seconds/60).toString().padStart(2,'0');
                const s = (this.seconds%60).toString().padStart(2,'0');
                document.getElementById('timer').textContent = `${m}:${s}`;
            }
        }, 1000);
    }

    saveGame() {
        const state = {
            board: this.board, solution: this.solution, fixedIndices: Array.from(this.fixedIndices),
            difficulty: this.difficulty, mode: this.mode, seconds: this.seconds, lives: this.lives,
            size: this.size, sqrt: this.sqrt
        };
        localStorage.setItem('vildoku_en_save', JSON.stringify(state));
    }

    loadGame() {
        const saved = localStorage.getItem('vildoku_en_save');
        if (!saved) return false;
        const data = JSON.parse(saved);
        this.board = data.board;
        this.solution = data.solution;
        this.fixedIndices = new Set(data.fixedIndices);
        this.difficulty = data.difficulty;
        this.mode = data.mode || 'classic';
        this.seconds = data.seconds;
        this.lives = data.lives;
        this.size = data.size || 9;
        this.sqrt = data.sqrt || 3;
        
        this.selectMode(this.mode);
        document.getElementById('diff-display').textContent = this.difficulty.toUpperCase();
        this.updateLivesDisplay();
        this.render();
        return true;
    }

    updateLivesDisplay() {
        // Can 3/3 ten 0/3'e doğru sayacak
        document.getElementById('lives-container').textContent = `Mistakes Left: ${this.lives}/3`;
    }

    pauseGame() {
        this.isPaused = true;
        document.getElementById('modal-title').textContent = "Paused";
        document.getElementById('resume-btn').classList.remove('hidden');
        document.getElementById('overlay').classList.remove('hidden');
    }

    resumeGame() {
        this.isPaused = false;
        document.getElementById('overlay').classList.add('hidden');
        this.startTimer();
    }

    showMenu() {
        this.pauseGame();
        document.getElementById('modal-title').textContent = "Game Menu";
        document.getElementById('resume-btn').classList.add('hidden');
        this.selectMode(this.mode);
        
        document.querySelectorAll('.diff-btn').forEach(b => {
            if(b.textContent.toLowerCase() === this.difficulty) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    checkWin() {
        if(!this.board.includes(0) && !this.board.some((v, i) => v !== this.solution[i])) {
            setTimeout(() => {
                alert(`Congratulations Vildan! You've solved the ${this.size}x${this.size} puzzle.`);
                localStorage.removeItem('vildoku_en_save');
                this.showMenu();
            }, 100);
        }
    }
}

let game;
document.addEventListener('DOMContentLoaded', () => { game = new Vildoku(); });