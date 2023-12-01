import * as fs from "fs";
import { promisify } from "util";

// Function to convert file content into an array of strings

const readFileAsync = promisify(fs.readFile);

export const convertFileToArray = async (
  filePath: string
): Promise<string[]> => {
  try {
    const fileContent = await readFileAsync(filePath, "utf8");

    return fileContent.split("\n"); // Split by new line
  } catch (err) {
    console.error(err);
    return [];
  }
};
