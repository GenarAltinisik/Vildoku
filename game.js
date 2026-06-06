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
        this.mistakes = 0; // Hata sayısı 0'dan 3'e gidecek
        this.timerInterval = null;
        this.isPaused = true;

        this.init();
    }

    init() {
        this.setupEventListeners();
        if (!this.loadGame()) {
            this.showNewGameMenu(true); // Kayıt yoksa iptal edilemeyen yeni oyun menüsünü aç
        } else {
            this.resumeGame();
        }
    }

    setupEventListeners() {
        document.getElementById('pause-btn').onclick = () => this.showPauseMenu();
        document.getElementById('resume-btn').onclick = () => this.resumeGame();
        document.getElementById('show-new-game-btn').onclick = () => this.showNewGameMenu(false);
        document.getElementById('start-new-btn').onclick = () => this.startNewGame();
        document.getElementById('cancel-new-btn').onclick = () => this.showPauseMenu();
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
        document.documentElement.style.setProperty('--grid-size', this.size);
        document.body.setAttribute('data-size', this.size);
    }

    selectDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.diff-btn').forEach(b => {
            if(b.textContent.toLowerCase() === level) b.classList.add('active');
        });
    }

    startNewGame() {
        this.seconds = 0;
        this.mistakes = 0;
        this.board = Array(this.size * this.size).fill(0);
        
        document.getElementById('new-game-view').classList.add('hidden');
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
            
            document.getElementById('mode-display').textContent = `${this.size}x${this.size}`;
            document.getElementById('diff-display').textContent = this.difficulty.toUpperCase();
            this.updateLivesDisplay();
            this.saveGame();
            this.render();
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
            this.mistakes++;
            this.updateLivesDisplay();
            if (this.mistakes >= 3) {
                setTimeout(() => {
                    alert("Game Over! 3/3 mistakes made. Let's try again.");
                    this.showNewGameMenu(true);
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
            difficulty: this.difficulty, mode: this.mode, seconds: this.seconds, mistakes: this.mistakes,
            size: this.size, sqrt: this.sqrt
        };
        localStorage.setItem('vildoku_v5_save', JSON.stringify(state));
    }

    loadGame() {
        const saved = localStorage.getItem('vildoku_v5_save');
        if (!saved) return false;
        const data = JSON.parse(saved);
        this.board = data.board;
        this.solution = data.solution;
        this.fixedIndices = new Set(data.fixedIndices);
        this.difficulty = data.difficulty;
        this.mode = data.mode || 'classic';
        this.seconds = data.seconds;
        this.mistakes = data.mistakes || 0;
        this.size = data.size || 9;
        this.sqrt = data.sqrt || 3;
        
        this.selectMode(this.mode);
        document.getElementById('mode-display').textContent = `${this.size}x${this.size}`;
        document.getElementById('diff-display').textContent = this.difficulty.toUpperCase();
        this.updateLivesDisplay();
        this.render();
        return true;
    }

    updateLivesDisplay() {
        document.getElementById('lives-container').textContent = `Mistakes: ${this.mistakes}/3`;
    }

    showPauseMenu() {
        this.isPaused = true;
        document.getElementById('modal-title').textContent = "PAUSED";
        document.getElementById('pause-view').classList.remove('hidden');
        document.getElementById('new-game-view').classList.add('hidden');
        document.getElementById('overlay').classList.remove('hidden');
    }

    showNewGameMenu(forceNew = false) {
        document.getElementById('modal-title').textContent = "NEW GAME";
        document.getElementById('pause-view').classList.add('hidden');
        document.getElementById('new-game-view').classList.remove('hidden');
        
        // Eğer zorunluysa (oyun başı veya can bitişi) iptal etme butonunu gizle
        if(forceNew) {
            document.getElementById('cancel-new-btn').classList.add('hidden');
        } else {
            document.getElementById('cancel-new-btn').classList.remove('hidden');
        }

        this.selectMode(this.mode);
        this.selectDifficulty(this.difficulty);
    }

    resumeGame() {
        this.isPaused = false;
        document.getElementById('overlay').classList.add('hidden');
        this.startTimer();
    }

    checkWin() {
        if(!this.board.includes(0) && !this.board.some((v, i) => v !== this.solution[i])) {
            setTimeout(() => {
                alert(`Congratulations Vildan! You solved it!`);
                localStorage.removeItem('vildoku_v5_save');
                this.showNewGameMenu(true);
            }, 100);
        }
    }
}

let game;
document.addEventListener('DOMContentLoaded', () => { game = new Vildoku(); });