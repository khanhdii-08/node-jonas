const fs = require("fs");
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

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed : ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const { message } = res.body;
    console.log(message);

    await writeFilePro(`dog-image.txt`, message);
    console.log("Random dog image saved to file");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "2. READY";
};

(async () => {
  try {
    console.log("1. Will get dog pics");
    const x = await getDogPic();
    console.log(x);
    console.log("3. Done getting dog pics");
  } catch (err) {
    console.log("ERROR 😜");
  }
})();

/*
console.log("1. Will get dog pics");

getDogPic()
  .then((x) => {
    console.log(x);
    console.log("3. Done getting dog pics");
  })
  .catch((err) => {
    console.log("ERR");
  });
*/

/*
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
    console.log(err);
  });
 */
