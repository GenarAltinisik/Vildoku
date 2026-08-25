import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { THEME } from '../constants/colors';
import { AllStats, CellCoord, CellData, Difficulty, GameMode } from '../types/game';
import { PuzzleGenerator } from '../engine/generator';
import { Header } from '../components/Header';
import { BoardGrid } from '../components/BoardGrid';
import { DynamicNumpad } from '../components/DynamicNumpad';
import { ActionToolbar } from '../components/ActionToolbar';
import { ModeSelectModal } from '../components/modals/ModeSelectModal';
import { PauseModal } from '../components/modals/PauseModal';
import { GameOverModal } from '../components/modals/GameOverModal';
import { VictoryModal } from '../components/modals/VictoryModal';
import { StatsModal } from '../components/modals/StatsModal';
import { HapticsService } from '../services/hapticsService';
import { AudioService } from '../services/audioService';
import { AdMobService } from '../services/adMobService';
import { StorageService } from '../services/storageService';

export const GameScreen: React.FC = () => {
  // Game Configuration & State
  const [mode, setMode] = useState<GameMode>('CAGE_9X9'); // Default: Vildoku Signature Mode
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [gridSize, setGridSize] = useState<9 | 16>(9);
  const [blockRows, setBlockRows] = useState<number>(3);
  const [blockCols, setBlockCols] = useState<number>(3);

  const [board, setBoard] = useState<CellData[][]>([]);
  const [solution, setSolution] = useState<string[][]>([]);
  const [cages, setCages] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);

  // Mechanics State
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const maxMistakes = 3;
  const [timer, setTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Undo / Redo History
  const [history, setHistory] = useState<CellData[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Modals & Settings State
  const [isModeSelectOpen, setIsModeSelectOpen] = useState<boolean>(false);
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [allStats, setAllStats] = useState<AllStats>({} as AllStats);

  // Timer Ref
  const timerRef = useRef<any>(null);

  // 1. Initial Load & Restore Settings / Stats
  useEffect(() => {
    async function init() {
      const settings = await StorageService.loadSettings();
      setSoundEnabled(settings.soundEnabled);
      setHapticsEnabled(settings.hapticsEnabled);
      AudioService.setEnabled(settings.soundEnabled);
      HapticsService.setEnabled(settings.hapticsEnabled);

      const stats = await StorageService.loadStats();
      setAllStats(stats);

      // Start initial game
      startNewGame('CAGE_9X9', 'MEDIUM');
    }
    init();
  }, []);

  // 2. Timer Loop
  useEffect(() => {
    if (!isPaused && !isGameOver && !isWon && board.length > 0) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isGameOver, isWon, board]);

  // 3. Start New Game
  const startNewGame = useCallback((newMode: GameMode, newDiff: Difficulty) => {
    const is16x16 = newMode === 'HEX_16X16' || newMode === 'CAGE_HEX_16X16';
    const size: 9 | 16 = is16x16 ? 16 : 9;
    const bRows = is16x16 ? 4 : 3;
    const bCols = is16x16 ? 4 : 3;

    const puzzle = PuzzleGenerator.createGame(newMode, newDiff);

    setMode(newMode);
    setDifficulty(newDiff);
    setGridSize(size);
    setBlockRows(bRows);
    setBlockCols(bCols);
    setBoard(puzzle.board);
    setSolution(puzzle.solution);
    setCages(puzzle.cages);

    // Initial selected cell
    setSelectedCell({ row: 0, col: 0 });
    setMistakes(0);
    setTimer(0);
    setIsPaused(false);
    setIsGameOver(false);
    setIsWon(false);
    setIsGameOverOpen(false);
    setIsVictoryOpen(false);
    setIsPauseOpen(false);
    setIsNotesMode(false);
    setHintsRemaining(3);
    setIsNewBest(false);

    // Reset history
    setHistory([cloneBoard(puzzle.board)]);
    setHistoryIndex(0);
  }, []);

  // Helper to deep clone board
  const cloneBoard = (b: CellData[][]): CellData[][] => {
    return b.map((row) =>
      row.map((cell) => ({
        ...cell,
        notes: [...cell.notes],
      }))
    );
  };

  // Push state to history
  const pushHistory = (newBoard: CellData[][]) => {
    const truncated = history.slice(0, historyIndex + 1);
    setHistory([...truncated, cloneBoard(newBoard)]);
    setHistoryIndex(truncated.length);
  };

  // 4. Instant Cell Selection with Toggle-to-Deselect
  const handleSelectCell = useCallback((row: number, col: number) => {
    setSelectedCell((prev) => {
      // If clicking the same already-selected cell, deselect it!
      if (prev && prev.row === row && prev.col === col) {
        setTimeout(() => {
          HapticsService.selection();
        }, 0);
        return null;
      }

      // If clicking a new cell, select it
      setTimeout(() => {
        HapticsService.selection();
        AudioService.playSelect();
      }, 0);
      return { row, col };
    });
  }, []);

  // 5. Input Number / Symbol
  const handleInputNumber = (symbol: string) => {
    if (!selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    const currentCell = board[row][col];

    // Cannot overwrite fixed prefilled cells or already correctly placed numbers
    if (currentCell.isFixed || currentCell.value === currentCell.solutionValue) {
      return;
    }

    const nextBoard = cloneBoard(board);
    const target = nextBoard[row][col];

    if (isNotesMode) {
      // Toggle candidate in notes
      if (target.notes.includes(symbol)) {
        target.notes = target.notes.filter((s) => s !== symbol);
      } else {
        target.notes = [...target.notes, symbol].sort();
      }
      setBoard(nextBoard);
      pushHistory(nextBoard);
      setTimeout(() => {
        HapticsService.toolAction();
        AudioService.playNote();
      }, 0);
      return;
    }

    // Direct Placement Check
    if (symbol === target.solutionValue) {
      // Correct!
      target.value = symbol;
      target.notes = [];
      target.isError = false;

      // Auto remove candidate notes in same row, col, block, cage
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const sameRow = r === row;
          const sameCol = c === col;
          const sameBlock =
            Math.floor(r / blockRows) === Math.floor(row / blockRows) &&
            Math.floor(c / blockCols) === Math.floor(col / blockCols);
          const sameCage =
            target.cageId !== undefined && nextBoard[r][c].cageId === target.cageId;

          if (sameRow || sameCol || sameBlock || sameCage) {
            nextBoard[r][c].notes = nextBoard[r][c].notes.filter((s) => s !== symbol);
          }
        }
      }

      setBoard(nextBoard);
      pushHistory(nextBoard);
      setTimeout(() => {
        HapticsService.numberPlaced();
        AudioService.playPlaceNumber();
      }, 0);

      // Check Victory Condition
      checkVictory(nextBoard);
    } else {
      // Mistake / Error!
      target.isError = true;
      setBoard(nextBoard);
      setTimeout(() => {
        HapticsService.mistake();
        AudioService.playMistake();
      }, 0);

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      // Flash reset after 400ms
      setTimeout(() => {
        setBoard((prev) => {
          if (!prev[row]?.[col]) return prev;
          const resetBoard = cloneBoard(prev);
          resetBoard[row][col].isError = false;
          return resetBoard;
        });
      }, 400);

      // Game Over Trigger
      if (newMistakes >= maxMistakes) {
        setIsGameOver(true);
        setIsGameOverOpen(true);
      }
    }
  };

  // 6. Check Victory Condition
  const checkVictory = async (currentBoard: CellData[][]) => {
    let completed = true;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (currentBoard[r][c].value !== currentBoard[r][c].solutionValue) {
          completed = false;
          break;
        }
      }
      if (!completed) break;
    }

    if (completed) {
      setIsWon(true);
      setTimeout(() => {
        HapticsService.victory();
        AudioService.playVictory();
      }, 0);

      // Record Stats
      const statsResult = await StorageService.recordGameResult(
        mode,
        difficulty,
        true,
        timer
      );
      const isRecord = statsResult.bestTime === timer;
      setIsNewBest(isRecord);
      setIsVictoryOpen(true);

      // Refresh cached stats
      const updatedStats = await StorageService.loadStats();
      setAllStats(updatedStats);

      // AdMob Interstitial trigger between games
      AdMobService.onGameFinished();
    }
  };

  // 7. Eraser
  const handleErase = () => {
    if (!selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    const cell = board[row][col];
    if (cell.isFixed || cell.value === cell.solutionValue) return;

    if (cell.value || cell.notes.length > 0) {
      const nextBoard = cloneBoard(board);
      nextBoard[row][col].value = '';
      nextBoard[row][col].notes = [];
      setBoard(nextBoard);
      pushHistory(nextBoard);
      HapticsService.toolAction();
    }
  };

  // 8. Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setBoard(cloneBoard(history[prevIndex]));
      setHistoryIndex(prevIndex);
      HapticsService.toolAction();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setBoard(cloneBoard(history[nextIndex]));
      setHistoryIndex(nextIndex);
      HapticsService.toolAction();
    }
  };

  // 9. Hint System (AdMob Rewarded Video Integration)
  const handleUseHint = () => {
    if (!selectedCell || isGameOver || isWon || isPaused) return;
    const { row, col } = selectedCell;
    const cell = board[row][col];
    if (cell.isFixed || cell.value === cell.solutionValue) return;

    const fillHintCell = () => {
      const nextBoard = cloneBoard(board);
      nextBoard[row][col].value = cell.solutionValue;
      nextBoard[row][col].notes = [];
      setBoard(nextBoard);
      pushHistory(nextBoard);
      HapticsService.numberPlaced();
      AudioService.playPlaceNumber();
      checkVictory(nextBoard);
    };

    if (hintsRemaining > 0) {
      setHintsRemaining((h) => h - 1);
      fillHintCell();
    } else {
      // Out of hints: watch Rewarded Video Ad to get an instant hint
      AdMobService.showRewardedAd('+1 Hint', () => {
        fillHintCell();
      });
    }
  };

  // 10. Rewarded Ad: Extra Life on Game Over
  const handleWatchAdExtraLife = () => {
    AdMobService.showRewardedAd('+1 Extra Life', () => {
      setMistakes(maxMistakes - 1); // restore 1 life
      setIsGameOver(false);
      setIsGameOverOpen(false);
    });
  };

  // 11. Settings Toggles
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    AudioService.setEnabled(next);
    StorageService.saveSettings({
      soundEnabled: next,
      hapticsEnabled,
      highlightMatching: true,
      highlightRelated: true,
      autoRemoveNotes: true,
    });
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    HapticsService.setEnabled(next);
    StorageService.saveSettings({
      soundEnabled,
      hapticsEnabled: next,
      highlightMatching: true,
      highlightRelated: true,
      autoRemoveNotes: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      <View style={styles.container}>
        {/* 1. Header fixed at Top */}
        <View style={styles.headerContainer}>
          <Header
            mode={mode}
            difficulty={difficulty}
            mistakes={mistakes}
            maxMistakes={maxMistakes}
            timer={timer}
            isPaused={isPaused}
            onTogglePause={() => {
              setIsPaused((p) => !p);
              setIsPauseOpen((p) => !p);
            }}
            onOpenModeSelect={() => setIsModeSelectOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
          />
        </View>

        {/* 2. Main Game Arena: Vertically centered on screen */}
        <View style={styles.gameArena}>
          {/* Sudoku Board */}
          <View style={styles.boardWrapper}>
            {board.length > 0 && (
              <BoardGrid
                board={board}
                cages={cages}
                gridSize={gridSize}
                blockRows={blockRows}
                blockCols={blockCols}
                selectedCell={selectedCell}
                onSelectCell={handleSelectCell}
              />
            )}
          </View>

          {/* Number Keys: Centered right below the board */}
          <View style={styles.numpadWrapper}>
            <DynamicNumpad
              gridSize={gridSize}
              board={board}
              onInputNumber={handleInputNumber}
              disabled={isGameOver || isWon || isPaused}
            />
          </View>

          {/* Action Toolbar: Sits right under the numpad */}
          <View style={styles.toolbarWrapper}>
            <ActionToolbar
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              isNotesMode={isNotesMode}
              hintsRemaining={hintsRemaining}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onErase={handleErase}
              onToggleNotes={() => {
                setIsNotesMode((n) => !n);
                HapticsService.toolAction();
              }}
              onUseHint={handleUseHint}
            />
          </View>
        </View>
      </View>

      {/* Modals */}
      <ModeSelectModal
        visible={isModeSelectOpen}
        currentMode={mode}
        currentDifficulty={difficulty}
        onClose={() => setIsModeSelectOpen(false)}
        onSelect={(newMode, newDiff) => startNewGame(newMode, newDiff)}
      />

      <PauseModal
        visible={isPauseOpen}
        soundEnabled={soundEnabled}
        hapticsEnabled={hapticsEnabled}
        onResume={() => {
          setIsPaused(false);
          setIsPauseOpen(false);
        }}
        onRestart={() => startNewGame(mode, difficulty)}
        onNewGame={() => {
          setIsPauseOpen(false);
          setIsModeSelectOpen(true);
        }}
        onToggleSound={handleToggleSound}
        onToggleHaptics={handleToggleHaptics}
      />

      <GameOverModal
        visible={isGameOverOpen}
        mistakes={mistakes}
        onWatchAdExtraLife={handleWatchAdExtraLife}
        onRestart={() => startNewGame(mode, difficulty)}
        onNewGame={() => {
          setIsGameOverOpen(false);
          setIsModeSelectOpen(true);
        }}
      />

      <VictoryModal
        visible={isVictoryOpen}
        mode={mode}
        difficulty={difficulty}
        timeSeconds={timer}
        isNewBest={isNewBest}
        onNextGame={() => startNewGame(mode, difficulty)}
        onHome={() => {
          setIsVictoryOpen(false);
          setIsModeSelectOpen(true);
        }}
      />

      <StatsModal
        visible={isStatsOpen}
        stats={allStats}
        onClose={() => setIsStatsOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: '100%',
    paddingTop: 2,
  },
  gameArena: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  numpadWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolbarWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
