class SudokuGame {
    constructor() {
        this.board = Array(81).fill(0);
        this.solution = Array(81).fill(0);
        this.selectedCell = null;
        this.isXSudoku = false; // "Zor Varyant" - Köşegen kontrolü
        this.difficulty = 'hard'; // 'easy', 'medium', 'hard'

        this.init();
    }

    init() {
        this.loadGame() || this.createNewGame();
        this.setupEventListeners();
        this.render();
    }

    // --- MANTIK KATMANI (Sudoku Algoritması) ---

    isValid(board, index, num) {
        const row = Math.floor(index / 9);
        const col = index % 9;

        // Satır ve Sütun Kontrolü
        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num) return false;
            if (board[i * 9 + col] === num) return false;
        }

        // 3x3 Kutu Kontrolü
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[(startRow + i) * 9 + (startCol + j)] === num) return false;
            }
        }

        // X-SUDOKU VARYANTI: Köşegen Kontrolü
        if (this.isXSudoku) {
            // Ana Köşegen (Sol üst -> Sağ alt)
            if (row === col) {
                for (let i = 0; i < 9; i++) {
                    if (board[i * 9 + i] === num) return false;
                }
            }
            // Ters Köşegen (Sağ üst -> Sol alt)
            if (row + col === 8) {
                for (let i = 0; i < 9; i++) {
                    if (board[i * 9 + (8 - i)] === num) return false;
                }
            }
        }

        return true;
    }

    solve(board) {
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                for (let num of nums) {
                    if (this.isValid(board, i, num)) {
                        board[i] = num;
                        if (this.solve(board)) return true;
                        board[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    createNewGame() {
        this.board = Array(81).fill(0);
        this.solve(this.board);
        this.solution = [...this.board];

        // Zorluk seviyesine göre hücreleri sil (Hard: 55+ hücre silinir)
        let attempts = this.difficulty === 'hard' ? 55 : 40;
        while (attempts > 0) {
            let idx = Math.floor(Math.random() * 81);
            if (this.board[idx] !== 0) {
                this.board[idx] = 0;
                attempts--;
            }
        }
        this.saveGame();
        this.render();
    }

    // --- UI KATMANI ---

    render() {
        const boardEl = document.getElementById('sudoku-board');
        boardEl.innerHTML = '';

        this.board.forEach((val, i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (val !== 0) cell.textContent = val;
            if (this.selectedCell === i) cell.classList.add('selected');
            
            // X-Sudoku görsel ipucu (Köşegenleri hafif renklendir)
            if (this.isXSudoku && (i % 10 === 0 || i % 8 === 0 && i > 0 && i < 80)) {
                cell.style.backgroundColor = '#1d1d1d';
            }

            cell.onclick = () => {
                this.selectedCell = i;
                this.render();
            };
            boardEl.appendChild(cell);
        });
    }

    handleInput(num) {
        if (this.selectedCell === null) return;
        // Eğer hücre orijinal çözümün bir parçasıysa (opsiyonel kısıt eklenebilir)
        this.board[this.selectedCell] = num;
        this.saveGame();
        this.render();
        this.checkWin();
    }

    checkWin() {
        if (!this.board.includes(0)) {
            if (JSON.stringify(this.board) === JSON.stringify(this.solution)) {
                alert("Mükemmel! Hepsini doğru yaptın.");
            } else {
                alert("Bazı hatalar var gibi görünüyor...");
            }
        }
    }

    // --- SİSTEM ---

    saveGame() {
        localStorage.setItem('sudoku_save', JSON.stringify({
            board: this.board,
            solution: this.solution,
            isXSudoku: this.isXSudoku
        }));
    }

    loadGame() {
        const saved = localStorage.getItem('sudoku_save');
        if (saved) {
            const data = JSON.parse(saved);
            this.board = data.board;
            this.solution = data.solution;
            this.isXSudoku = data.isXSudoku;
            return true;
        }
        return false;
    }

    setupEventListeners() {
        // Sayı butonları
        document.querySelectorAll('.num').forEach(btn => {
            btn.onclick = () => this.handleInput(parseInt(btn.textContent));
        });

        document.getElementById('delete').onclick = () => this.handleInput(0);
        document.getElementById('new-game').onclick = () => {
            if(confirm("Yeni oyuna geçilsin mi?")) this.createNewGame();
        };
    }
}

// Oyunu Başlat
window.onload = () => new SudokuGame();