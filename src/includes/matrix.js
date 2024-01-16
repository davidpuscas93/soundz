"use strict";

const fs = require("fs");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (inputStdin) {
  inputString += inputStdin;
});

process.stdin.on("end", function () {
  inputString = inputString.split("\n");

  main();
});

function readLine() {
  return inputString[currentLine++];
}

/*
 * Complete the 'roverMove' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER matrixSize
 *  2. STRING_ARRAY cmds
 */

export function roverMove(matrixSize, cmds) {
  let square = 0;
  for (let i = 0; i < cmds.length; i++) {
    switch (cmds[i]) {
      case "RIGHT":
        if ((square % matrixSize) + 1 < matrixSize) {
          square += 1;
        }
        break;
      case "LEFT":
        if ((square % matrixSize) - 1 >= 0) {
          square -= 1;
        }
        break;
      case "DOWN":
        if (square + matrixSize < matrixSize * matrixSize) {
          square += matrixSize;
        }
        break;
      case "UP":
        if (square - matrixSize >= 0) {
          square -= matrixSize;
        }
        break;
      default:
        break;
    }
  }
  return square;
}

function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const matrixSize = parseInt(readLine().trim(), 10);

  const cmdsCount = parseInt(readLine().trim(), 10);

  let cmds = [];

  for (let i = 0; i < cmdsCount; i++) {
    const cmdsItem = readLine();
    cmds.push(cmdsItem);
  }

  const result = roverMove(matrixSize, cmds);

  ws.write(result + "\n");

  ws.end();
}
