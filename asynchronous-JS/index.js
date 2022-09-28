const { rejects } = require("assert");
const fs = require("fs");
const { resolve } = require("path");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file ");
      resolve("success");
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed: ${result}`);
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((res) => {
    const { message } = res.body;
    console.log(message);
    return writeFilePro(`dog-image.txt`, message);
  })
  .then(() => {
    console.log("Random dog image saved to file ");
  })
  .catch((err) => {
    console.log(err.message);
  });
