import { convertFileToArray } from "../../Utils";

type SymbolInfo = {
  row: number;
  col: number;
  adjacentToNumbers?: number[];
};

type Symbols = Record<string, SymbolInfo[]>;

type Position = { row: number; columns: number[] };

type GameObjectInfo = {
  id: number;
  isAdjacentToSymbols: string[];
  position: Position;
};

type GameObject = Record<number, GameObjectInfo[]>;

const testData = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  //"617*598.25", // for testing edge cases
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

const generate2DSchematic = (data: string[]): string[][] => {
  return data.map((e: string) => e.split(""));
};

// const data = generate2DSchematic(testData);

const data = generate2DSchematic(convertFileToArray("src/Day3/day-3-data.txt"));

// Example objects

// const gameObject: GameObject = {
//   467: {
//     isAdjacentToSymbols: true,
//     positions: [     // account for repeating numbers
//       {
//         row: 0,
//         col: [0, 1, 2]
//       }
//     ]
//   etc...
// };

// const symbols: Symbols = {
//   "*": [
//     {
//       row: 1,
//       col: 3,
//       adjacentToNumbers: [467, 35],
//     },
//     {
//       row: 4,
//       col: 3,
//       adjacentToNumbers: [617],
//     },
//     {
//       row: 8,
//       col: 5,
//       adjacentToNumbers: [755, 598],
//     },
//   ],
//   "#": [
//     {
//       row: 3,
//       col: 6,
//       adjacentToNumbers: [633],
//     },
//   ],
//   "+": [
//     {
//       row: 5,
//       col: 5,
//       adjacentToNumbers: [592],
//     },
//   ],
//   $: [
//     {
//       row: 8,
//       col: 3,
//       adjacentToNumbers: [664],
//     },
//   ],
// };
const gameObject: GameObject = {};
const symbols: Symbols = {};

// ------------ Helper Functions ------------

const stringContainsNumbers = (inputString: string): boolean => {
  return /[\d]/.test(inputString);
};

const stringContainsSymbols = (inputString: string): boolean => {
  return /^[^0-9.]+$/.test(inputString);
};

const populateSymbolPositions = (symbol: string, row: number, col: number) => {
  if (!symbols[symbol]) {
    symbols[symbol] = [];
  }
  symbols[symbol].push({
    row,
    col,
  });
};

let idCounter = 1;

const populateNumberPositions = (
  number: string,
  row: number,
  columns: number[]
): void => {
  const numKey = parseInt(number);

  if (!gameObject[numKey]) {
    gameObject[numKey] = [];
  }

  gameObject[numKey].push({
    id: idCounter++,
    position: { row, columns },
    isAdjacentToSymbols: [],
  });
};

// ------------ Populate numbers and symbol positions ------------
const populatePositions = (data: string[][]): GameObject => {
  for (let row = 0; row < data.length; row++) {
    let currentNumber = "";
    let currentNumberColumns: number[] = [];

    for (let col = 0; col < data[row].length; col++) {
      // Check if there is a number, if there is, add to current number
      const highlightedCharacter: string = data[row][col];
      if (stringContainsNumbers(highlightedCharacter)) {
        currentNumber += highlightedCharacter;
        currentNumberColumns.push(col);
      } else {
        if (currentNumber.length) {
          // Add completed numbers and positions to gameObject
          populateNumberPositions(currentNumber, row, currentNumberColumns);
          currentNumber = "";
          currentNumberColumns = [];
        }

        if (stringContainsSymbols(highlightedCharacter)) {
          populateSymbolPositions(highlightedCharacter, row, col);
        }
      }
    }

    // Check if there's a number at the end of the row
    if (currentNumber.length) {
      populateNumberPositions(currentNumber, row, currentNumberColumns);
    }
  }
  return gameObject;
};
const populateAdjacency = () => {
  const directions = [
    // up, down, left, right
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    // diagonals: up-left, up-right, down-left, down-right
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  const findFullNumber = (row: number, col: number): string | undefined => {
    return Object.keys(gameObject).find((numberKey) => {
      // Ensure that we are accessing an array of GameObjectInfo objects
      const gameObjects = gameObject[parseInt(numberKey)];
      if (!Array.isArray(gameObjects)) {
        return false;
      }

      // Check if any of the GameObjectInfo objects have a matching position
      return gameObjects.some((gameObjectInfo) => {
        return (
          gameObjectInfo.position.row === row &&
          gameObjectInfo.position.columns.includes(col)
        );
      });
    });
  };

  const checkAndUpdateAdjacents = (
    row: number,
    col: number,
    symbol: string
  ) => {
    directions.forEach(([dx, dy]) => {
      const adjacentRow = row + dx;
      const adjacentCol = col + dy;

      if (
        adjacentRow >= 0 &&
        adjacentRow < data.length &&
        adjacentCol >= 0 &&
        adjacentCol < data[0].length &&
        stringContainsNumbers(data[adjacentRow][adjacentCol])
      ) {
        const fullNumber = findFullNumber(adjacentRow, adjacentCol);
        if (fullNumber && fullNumber in gameObject) {
          //@ts-ignore
          gameObject[fullNumber].forEach((gameObjectEntry) => {
            // Check if the position matches
            if (
              gameObjectEntry.position.row === adjacentRow &&
              gameObjectEntry.position.columns.includes(adjacentCol) &&
              !gameObjectEntry.isAdjacentToSymbols.includes(symbol)
            ) {
              gameObjectEntry.isAdjacentToSymbols.push(symbol);
            }
          });

          // Update symbols
          const symbolEntry = symbols[symbol].find(
            (entry) => entry.row === row && entry.col === col
          );
          if (symbolEntry) {
            if (!symbolEntry.adjacentToNumbers) {
              symbolEntry.adjacentToNumbers = [];
            }
            const fullNumberInt = parseInt(fullNumber);
            if (!symbolEntry.adjacentToNumbers.includes(fullNumberInt)) {
              symbolEntry.adjacentToNumbers.push(fullNumberInt);
            }
          }
        }
      }
    });
  };

  Object.keys(symbols).forEach((symbol) => {
    symbols[symbol].forEach(({ row, col }) => {
      checkAndUpdateAdjacents(row, col, symbol);
    });
  });
};

const part1Answer = (): number => {
  populatePositions(data);
  populateAdjacency();

  console.log(JSON.stringify(gameObject, null, 2), "gameObject");
  let sum = 0;
  Object.keys(gameObject).forEach((key: string) => {
    const numKey = parseInt(key);

    // Iterate over each instance of the number
    gameObject[numKey].forEach((info) => {
      // If the instance is adjacent to any symbol, add the number to the sum
      if (info.isAdjacentToSymbols.length > 0) {
        sum += numKey;
      }
    });
  });

  return sum;
};

const part2Answer = (): number => {
  populatePositions(data);
  populateAdjacency();

  let sumOfGearRatios = 0;

  symbols["*"].forEach((instance) => {
    if (instance.adjacentToNumbers?.length === 2) {
      sumOfGearRatios += instance.adjacentToNumbers.reduce((a, b) => a * b);
    }
  });

  return sumOfGearRatios;
};

// console.log(JSON.stringify(symbols, null, 2), "Symbols");
// console.log(JSON.stringify(gameObject, null, 2), "gameObject");
console.log(part1Answer());
console.log(part2Answer());
// Step 2: Record numbers adjacent to each symbol. (Flip adjacent flag on number if recorded)
