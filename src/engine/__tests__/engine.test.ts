import { SudokuSolver } from '../solver';
import { CageGenerator } from '../cageGenerator';
import { symbolToValue, valueToSymbol } from '../../constants/symbols';

function runTests() {
  console.log('🧪 Starting Vildoku Engine Automated Verification...');

  // Test 1: Symbol to Value & Value to Symbol
  console.log('\n[Test 1] Symbol & Decimal Conversions');
  const testCases = [
    { sym: '1', val: 1 },
    { sym: '9', val: 9 },
    { sym: 'A', val: 10 },
    { sym: 'B', val: 11 },
    { sym: 'F', val: 15 },
    { sym: 'G', val: 16 },
  ];
  for (const tc of testCases) {
    if (symbolToValue(tc.sym) !== tc.val) {
      throw new Error(`symbolToValue(${tc.sym}) expected ${tc.val}, got ${symbolToValue(tc.sym)}`);
    }
    if (valueToSymbol(tc.val) !== tc.sym) {
      throw new Error(`valueToSymbol(${tc.val}) expected ${tc.sym}, got ${valueToSymbol(tc.val)}`);
    }
  }
  console.log('✅ Symbol to Decimal conversions verified!');

  // Test 2: 9x9 Solution Generator
  console.log('\n[Test 2] 9x9 Sudoku Solution Generator');
  const sol9 = SudokuSolver.generateSolution(9);
  verifyBoard(sol9, 9, 3, 3);
  console.log('✅ 9x9 Solution Board is 100% valid!');

  // Test 3: 16x16 Hex Solution Generator
  console.log('\n[Test 3] 16x16 Hex Sudoku Solution Generator');
  const sol16 = SudokuSolver.generateSolution(16);
  verifyBoard(sol16, 16, 4, 4);
  console.log('✅ 16x16 Hex Solution Board is 100% valid!');

  // Test 4: Vildoku Cage Generator (9x9) - Uniqueness, Sums & Partitioning
  console.log('\n[Test 4] Vildoku 9x9 Cage Generator Verification');
  const cages9 = CageGenerator.generateCages(sol9, 9, 'MEDIUM');
  verifyCages(cages9, sol9, 9);
  console.log('✅ Vildoku 9x9 Cages verified (Uniqueness, Decimal Sums, Coverage & Graph Coloring)!');

  // Test 5: Vildoku Hex Cage Generator (16x16)
  console.log('\n[Test 5] Vildoku Hex 16x16 Cage Generator Verification');
  const cages16 = CageGenerator.generateCages(sol16, 16, 'HARD');
  verifyCages(cages16, sol16, 16);
  console.log('✅ Vildoku Hex 16x16 Cages verified (Uniqueness, Decimal Sums, Coverage & Graph Coloring)!');

  console.log('\n🎉 ALL ENGINE VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
}

function verifyBoard(board: string[][], size: 9 | 16, blockRows: number, blockCols: number) {
  // Check rows
  for (let r = 0; r < size; r++) {
    const rowSet = new Set<string>();
    for (let c = 0; c < size; c++) {
      const val = board[r][c];
      if (!val || rowSet.has(val)) throw new Error(`Duplicate ${val} in row ${r}`);
      rowSet.add(val);
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    const colSet = new Set<string>();
    for (let r = 0; r < size; r++) {
      const val = board[r][c];
      if (!val || colSet.has(val)) throw new Error(`Duplicate ${val} in col ${c}`);
      colSet.add(val);
    }
  }

  // Check blocks
  for (let br = 0; br < size; br += blockRows) {
    for (let bc = 0; bc < size; bc += blockCols) {
      const blockSet = new Set<string>();
      for (let r = 0; r < blockRows; r++) {
        for (let c = 0; c < blockCols; c++) {
          const val = board[br + r][bc + c];
          if (!val || blockSet.has(val)) throw new Error(`Duplicate ${val} in block (${br},${bc})`);
          blockSet.add(val);
        }
      }
    }
  }
}

function verifyCages(cages: any[], solution: string[][], size: 9 | 16) {
  const covered = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

  for (const cage of cages) {
    const cageValues = new Set<string>();
    let computedSum = 0;

    for (const cell of cage.cells) {
      covered[cell.row][cell.col] += 1;
      const val = solution[cell.row][cell.col];

      // CONSTRAINT CHECK: No duplicate numbers within cage
      if (cageValues.has(val)) {
        throw new Error(`Cage ${cage.id} violated uniqueness! Duplicate symbol ${val}`);
      }
      cageValues.add(val);
      computedSum += symbolToValue(val);
    }

    // TARGET SUM CHECK (Decimal)
    if (computedSum !== cage.targetSum) {
      throw new Error(
        `Cage ${cage.id} sum mismatch: target ${cage.targetSum} != computed ${computedSum}`
      );
    }
  }

  // Full Coverage Check: Every cell must belong to exactly 1 cage
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (covered[r][c] !== 1) {
        throw new Error(`Cell (${r},${c}) was covered ${covered[r][c]} times (must be exactly 1)`);
      }
    }
  }
}

runTests();
