let wordList = [];

document
  .querySelector("#word-length")
  .addEventListener("input", updateCorrectLetters);
document.addEventListener("DOMContentLoaded", updateCorrectLetters);

document.getElementById("open-info").addEventListener("click", openInfo);
document.getElementById("close-info").addEventListener("click", closeInfo);

function openInfo() {
  document.getElementById("info").style.display = "block";
}
function closeInfo() {
  document.getElementById("info").style.display = "none";
}

function updateCorrectLetters() {
  let wordLength = document.getElementById("word-length").value;
  let correctLettersDiv = document.getElementById("correct-letters-div");
  correctLettersDiv.innerHTML = "";

  for (let i = 0; i < wordLength; i++) {
    let newInput = document.createElement("input");
    newInput.id = i;
    newInput.className = "correct-letter inline";
    newInput.maxLength = 1;
    correctLettersDiv.appendChild(newInput);
  }

  //update included letters input boxes
  let includedLettersDiv = document.getElementById("included-letters-div");
  includedLettersDiv.innerHTML = "";

  for (let i = 0; i < wordLength; i++) {
    let newInput = document.createElement("input");
    newInput.id = i + "included";
    newInput.className = "included-letters inline";
    includedLettersDiv.appendChild(newInput);
  }
}

//get list of all words
fetch("https://random-word-api.herokuapp.com/all")
  .then((res) => res.json())
  .then((data) => (wordList = data))
  .catch((error) => console.log(error));

document
  .getElementById("find-words")
  .addEventListener("click", findPossibleWords);

function findPossibleWords() {
  let incorrectLetters = document.getElementById("incorrect-letters").value;
  let wordLength = document.getElementById("word-length").value;

  //get included letters
  let includedLetters = "";
  for (let i = 0; i < wordLength; i++) {
    includedLetters += document.getElementById(i + "included").value;
  }
  //get correct letters
  let correctLetters = "";
  for (let i = 0; i < wordLength; i++) {
    let input = document.getElementById(i).value;
    if (input != "") {
      correctLetters += input;
    } else {
      correctLetters += "_";
    }
  }

  let possibleWordsDiv = document.getElementById("possible-words");
  let possibleWords = wordList;
  //remove all words the wrong length
  possibleWords = possibleWords.filter(checkLength);
  function checkLength(word) {
    return word.length == wordLength;
  }

  //remove included and possible letters from incorrect letters
  incorrectLetters = incorrectLetters.split("").filter(filterIncorrectLetters);
  function filterIncorrectLetters(letter) {
    if (includedLetters.includes(letter) || correctLetters.includes(letter)) {
      //remove from incorrect letters input
      document.getElementById("incorrect-letters").value = document
        .getElementById("incorrect-letters")
        .value.replace(letter, "");
      return false;
    }
    return true;
  }

  //remove all words containing incorrect letters
  possibleWords = possibleWords.filter(checkIncorrectLetters);
  function checkIncorrectLetters(word) {
    for (let i = 0; i < incorrectLetters.length; i++) {
      if (word.includes(incorrectLetters[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  //remove all words not containing included letters
  possibleWords = possibleWords.filter(checkIncludedLetters);
  function checkIncludedLetters(word) {
    for (let i = 0; i < includedLetters.length; i++) {
      if (!word.includes(includedLetters[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  //remove all words not containing correct letters in their correct places
  possibleWords = possibleWords.filter(checkCorrectLetters);
  function checkCorrectLetters(word) {
    for (let i = 0; i < correctLetters.length; i++) {
      if (correctLetters[i] == "_") continue;
      if (correctLetters[i].toUpperCase() != word[i].toUpperCase())
        return false;
    }
    return true;
  }

  //remove all words containing included letters in incorrect places
  let includedLettersPositions = [];
  for (let i = 0; i < wordLength; i++) {
    includedLettersPositions.push(
      document.getElementById(i + "included").value.toUpperCase()
    );
  }

  possibleWords = possibleWords.filter(checkIncludedPositions);
  function checkIncludedPositions(word) {
    for (let i = 0; i < includedLettersPositions.length; i++) {
      if (includedLettersPositions[i].includes(word[i].toUpperCase())) {
        return false;
      }
    }
    return true;
  }

  //display results
  let text = possibleWords.length + ": possible words <br/>";
  for (let i = 0; i < possibleWords.length; i++) {
    text += possibleWords[i] + "<br/>";
  }

  possibleWordsDiv.innerHTML = text;
}
