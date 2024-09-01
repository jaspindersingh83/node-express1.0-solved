const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const serverport = 3000;
server = express();
server.use(bodyparser.json());

server.listen(3000, () => {
  console.log(`server nirvan started at ${serverport}`);
});

///ToDO
const readmovieNames = () => {
  const contents = fs.readFileSync("movies.txt", "utf8");
  return contents.split("\n"); //arr
};

const allMovies = readmovieNames();
const movieIdx = Math.floor(Math.random(0, 1) * allMovies.length);
const movieToGuess = allMovies[movieIdx].toLowerCase();
console.log(movieToGuess);
const lettersSoFar = new Set();
let cnt = 0; // unsuccessful guess -- 9
console.log(cnt);

// api

server.get("/", (req, res) => {
  res.status(200).send("Hubuga");
});

// server.get("/guess", (req, res) => {
//   // should be giving the movie in _ _ _ _ a _
//   res.status(200).send("Hubuga1");
// });

const validateInput = (req, res, next) => {
  const { letter } = req.body;
  let flag = letter.length > 0 && letter.match(/[a-z]/i);
  if (!flag) {
    return res.status(400).send("please enter a valid letter Nirvan");
  }
  next();
};

server.post("/guess", validateInput, (req, res) => {
  const { letter } = req.body;
  for (let i = 0; i < movieToGuess.length; i++) {
    if (letter === movieToGuess.charAt(i)) {
      if (lettersSoFar.has(letter)) {
        return res
          .status(400)
          .send("Nirvan what is this you are sending already used letter");
      }
      lettersSoFar.add(letter);
      return res.status(200).send("success");
    }
  }
  cnt++;
  if (cnt == 9) {
    return res.status(200).send("buhuhu yu have lost");
  }
  return res.status(200).send("letter accepted but not in movies to guess");
});

server.get("/guess", (req, res) => {
  let guessedSoFar = "";
  for (let i = 0; i < movieToGuess.length; i++) {
    let ch = movieToGuess.charAt(i);
    if (lettersSoFar.has(ch)) {
      guessedSoFar += ch;
      guessedSoFar += " ";
    } else {
      guessedSoFar += "_ ";
    }
  }
  res.status(200).json({ guessedSoFar });
});
