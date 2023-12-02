import { convertFileToArray } from "../../Utils";

const testData = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split("\n");

const maxBalls = {
  red: 12,
  green: 13,
  blue: 14,
};

interface GameObject {
  red: number;
  blue: number;
  green: number;
  isValid: boolean;
  // For part 2
  powerOfMinSetOfCubes: number;
}

// const parsedDataObjectExample = {
//      1: {
//         red: 5,
//         blue: 9,
//         green: 4,
//         isValid: true,
//         powerOfMinSetOfCubes: 180
//     },
//     2: {
//         /// etc...
//     }
// }

interface ParseDataResult {
  parsedDataObject: Record<string, GameObject>;
  sumOfPowers: number;
}

// Get string format into object format
const parseData = (data: string[]): ParseDataResult => {
  const parsedDataObject: Record<string, GameObject> = {};
  let sumOfPowers = 0;

  data.forEach((game) => {
    let modifiedGame = game.split(":");
    let numericKey = modifiedGame[0].match(/\d+/)?.[0] ?? modifiedGame[0];

    // Initialize lookup table
    parsedDataObject[numericKey] = {
      red: 0,
      blue: 0,
      green: 0,
      isValid: true, // Assume valid initially
      powerOfMinSetOfCubes: 0,
    };

    // Split by semicolon to get each set
    const sets = modifiedGame[1].trim().split(";");

    let minBalls = {
      red: 0,
      green: 0,
      blue: 0,
    };

    sets.forEach((set, idx) => {
      let setCount = { red: 0, blue: 0, green: 0 };

      set
        .trim()
        .split(",")
        .forEach((cubeGroup) => {
          const parts = cubeGroup.trim().split(" ");
          const color = parts[1] as keyof GameObject;
          const count: number = parseInt(parts[0], 10);

          if (
            !isNaN(count) &&
            color !== "isValid" &&
            color !== "powerOfMinSetOfCubes"
          ) {
            setCount[color] += count;
            if (setCount[color] > maxBalls[color]) {
              // Invalidate the game if any set is invalid
              parsedDataObject[numericKey].isValid = false;
            }
            if (setCount[color] > minBalls[color]) {
              minBalls[color] = setCount[color];
            }
          }
        });

      // Update the game data with set count
      if (parsedDataObject[numericKey].isValid) {
        Object.keys(setCount).forEach((colorKey) => {
          const color = colorKey as keyof GameObject;
          if (color !== "isValid" && color !== "powerOfMinSetOfCubes") {
            parsedDataObject[numericKey][color] += setCount[color];
          }
        });
      }
    });

    parsedDataObject[numericKey].powerOfMinSetOfCubes =
      minBalls["red"] * minBalls["blue"] * minBalls["green"];

    sumOfPowers += parsedDataObject[numericKey].powerOfMinSetOfCubes;

    // console.log(minBalls, `Minimum balls needed for Game ${numericKey}`);
  });

  return { parsedDataObject, sumOfPowers };
};

const cubeCountPart1 = (
  parsedDataObject: Record<string, GameObject>
): number => {
  let finalAnswer: number = 0;

  // check for results and add valid numerical game keys
  const objectLength = Object.keys(parsedDataObject).length;

  for (let i = 1; i <= objectLength; i++) {
    if (parsedDataObject[i].isValid) {
      finalAnswer += i;
    }
  }
  return finalAnswer;
};


console.log(
  cubeCountPart1(parseData(testData).parsedDataObject),
  "is the Part 1 Test Result"
);
console.log(
  cubeCountPart1(
    parseData(convertFileToArray("src/Day2/day-2-data.txt")).parsedDataObject
  ),
  "is the Part 1 Result"
);

console.log(parseData(testData).sumOfPowers, "is the Part 2 Test Result");

console.log(
  parseData(convertFileToArray("src/Day2/day-2-data.txt")).sumOfPowers,
  "is the Part 2 Result"
);
