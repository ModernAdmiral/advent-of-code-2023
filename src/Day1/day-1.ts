import { convertFileToArray } from "../../Utils";

// --------------------------- Part 1 ---------------------------

const lettersSet: { [key: string]: boolean } = {};
const letters: string = "abcdefghijklmnopqrstuvwxyz";

// Populate the hash set with letters for O(1) lookup
for (const letter of letters) {
  lettersSet[letter] = true;
}

const removeLettersAndAddEm = (
  inputArray: string[],
  lettersSet: { [key: string]: boolean }
) => {
  return (
    inputArray
      .map((value) => {
        const removedLetters = value
          .split("")
          .filter((char) => !lettersSet[char])
          .join("");
        // only return first and last number
        return parseInt(
          `${removedLetters[0]}${removedLetters[removedLetters.length - 1]}`
        );
      })
      // Add the numbers together
      .reduce((a, b) => a + b)
  );
};
const calibration = async () => {
  const testInputPart1: string[] = [
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet",
  ];
  const realArray = await convertFileToArray("src/Day1/day-1-data.txt");

  // Process both testInput and realArray
  const processedTestInput = removeLettersAndAddEm(testInputPart1, lettersSet);
  const processedRealArray = removeLettersAndAddEm(realArray, lettersSet);

  return { processedTestInput, processedRealArray };
};

calibration().then((answer) => console.log(answer, "Dis is the answer"));

// --------------------------- Part 2 ---------------------------

const convertLettersToNumbers = async (inputString: string) => {
  // create lookup table
  const digitLetters: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  let result = "";
  let i = 0;

  while (i < inputString.length) {
    let found = false;

    for (const word in digitLetters) {
      if (inputString.startsWith(word, i)) {
        result += digitLetters[word].toString();
        found = true;
        break;
      }
    }

    if (!found) {
      result += inputString[i];
    }

    i++;
  }

  return result;
};

const calibrationPart2 = async () => {
  let finalResult;
  let testResult;
  const realArray = await convertFileToArray("src/Day1/day-1-data.txt");
  const testInputPart2 = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen",
  ];

  const processedTestInputPromise = await Promise.all(
    testInputPart2.map(convertLettersToNumbers)
  );
  const processedRealInputPromise = await Promise.all(
    realArray.map(convertLettersToNumbers)
  );
  testResult = removeLettersAndAddEm(processedTestInputPromise, lettersSet);
  finalResult = removeLettersAndAddEm(processedRealInputPromise, lettersSet);

  return { finalResult, testResult };
};

// O(N)
const output = () =>
  calibrationPart2().then((answer) => console.log(answer, "Dis is the answer"));

output();
