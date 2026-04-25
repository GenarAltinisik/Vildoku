class Vildoku {
    constructor() {
        this.board = [];
        this.solution = [];
        this.fixedIndices = new Set();
        this.selectedIdx = null;
        this.difficulty = 'medium';
        this.seconds = 0;
        this.timerInterval = null;
        this.isPaused = true;

        this.init();
    }

    init() {
        this.setupEventListeners();
        // İlk açılışta menüyü göster
        document.getElementById('overlay').classList.remove('hidden');
    }

    setupEventListeners() {
        document.getElementById('pause-btn').onclick = () => this.pauseGame();
        document.getElementById('resume-btn').onclick = () => this.resumeGame();
        document.getElementById('new-game-btn').onclick = () => this.showMenu();
        document.getElementById('delete-btn').onclick = () => this.inputValue(0);
    }

    showMenu() {
        this.pauseGame();
        document.getElementById('modal-title').textContent = "Yeni Oyun";
        document.getElementById('resume-btn').classList.add('hidden');
    }

    setDifficulty(level) {
        this.difficulty = level;
        document.getElementById('difficulty-display').textContent = level.toUpperCase();
        this.newGame();
        this.resumeGame();
    }

    newGame() {
        this.seconds = 0;
        this.board = Array(81).fill(0);
        this.generateFullSolution();
        this.solution = [...this.board];
        
        const counts = { 'easy': 30, 'medium': 45, 'hard': 55 };
        let toRemove = counts[this.difficulty];
        this.fixedIndices.clear();
        for(let i=0; i<81; i++) this.fixedIndices.add(i);

        while(toRemove > 0) {
            let idx = Math.floor(Math.random()*81);
            if(this.board[idx] !== 0) {
                this.board[idx] = 0;
                this.fixedIndices.delete(idx);
                toRemove--;
            }
        }
        this.render();
        this.startTimer();
    }

    generateFullSolution() {
        const solve = (idx) => {
            if (idx === 81) return true;
            let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random()-0.5);
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
        let r = Math.floor(idx/9), c = idx%9;
        for (let i=0; i<9; i++) {
            if (board[r*9+i] === n || board[i*9+c] === n) return false;
        }
        let bR = Math.floor(r/3)*3, bC = Math.floor(c/3)*3;
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (board[(bR+i)*9+(bC+j)] === n) return false;
            }
        }
        return true;
    }

    inputValue(n) {
        if (this.selectedIdx === null || this.fixedIndices.has(this.selectedIdx) || this.isPaused) return;
        this.board[this.selectedIdx] = n;
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
            if (val !== 0) {
                cell.textContent = val;
                if (val !== this.solution[i]) cell.classList.add('error');
            }
            if (this.fixedIndices.has(i)) cell.classList.add('fixed');
            if (this.selectedIdx === i) cell.classList.add('selected');
            if (val !== 0 && val === selVal) cell.classList.add('highlighted');
            
            cell.onclick = () => { this.selectedIdx = i; this.render(); };
            boardEl.appendChild(cell);
        });
        this.updateNumpad();
    }

    updateNumpad() {
        const pad = document.getElementById('numpad');
        pad.innerHTML = '';
        const counts = Array(10).fill(0);
        this.board.forEach(v => { if(v!==0) counts[v]++; });

        for(let i=1; i<=9; i++) {
            const btn = document.createElement('button');
            btn.className = `num-btn ${counts[i] >= 9 ? 'done' : ''}`;
            btn.innerHTML = `<span>${i}</span><sub>${9 - counts[i]}</sub>`;
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

    pauseGame() {
        this.isPaused = true;
        document.getElementById('modal-title').textContent = "Duraklatıldı";
        document.getElementById('resume-btn').classList.remove('hidden');
        document.getElementById('overlay').classList.remove('hidden');
    }

    resumeGame() {
        this.isPaused = false;
        document.getElementById('overlay').classList.add('hidden');
    }

    checkWin() {
        if(!this.board.includes(0) && !this.board.some((v, i) => v !== this.solution[i])) {
            alert("Tebrikler Vildan! Hepsini çözdün.");
            this.showMenu();
        }
    }
}

let game;
document.addEventListener('DOMContentLoaded', () => { game = new Vildoku(); });