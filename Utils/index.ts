import * as fs from "fs";

// Function to convert file content into an array of strings

export const convertFileToArray = (filePath: string): string[] => {
  const fileContent = fs.readFileSync(filePath, "utf8").trim().split("\n");

  return fileContent; // Split by new line
};
