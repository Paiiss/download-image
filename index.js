import fetch from "node-fetch";
import chalk from "chalk";
console.log(chalk.bgYellow("Starting..."));
import xlsx from "node-xlsx";
import fs from "fs";

function readXlsx() {
  const workSheetsFromFile = xlsx.parse(`./data.xlsx`, {
    type: "buffer",
    header: null,
  });
  return workSheetsFromFile[0].data;
}

function checkUrl(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

let data = await readXlsx();
console.log(`Data downloaded: ${chalk.red(data.length)} rows`);

const config = {
  image: "Foto",
  id: "NIP",
};

for (let i = 0; i < data.length; i++) {
  if (!data[i][config.id]) {
    console.log(chalk.bgRed(`Row ${i + 1} has no NIP`));
    continue;
  }

  if (!data[i][config.image]) {
    console.log(chalk.bgRed(`Row ${i + 1} has no image`));
    continue;
  }

  if (!checkUrl(data[i][config.image])) {
    console.log(chalk.bgRed(`Row ${i + 1} has invalid image url`));
    continue;
  }

  const url = data[i][config.image];
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(`./images/${data[i][config.id]}.jpg`, Buffer.from(buffer));
  console.log(chalk.bgGreen(`Row ${i + 1} image downloaded`));
}

console.log(chalk.bgYellow("Done!"));
