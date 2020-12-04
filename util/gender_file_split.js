//requiring path and fs modules
const path = require('path');
const fs = require('fs');

const source = '../data/original/names'
const dest = '../data/clean/names/gender';
const sourcePath = path.join(__dirname, source);
const destPath = path.join(__dirname, dest);

var fileSizeInBytes_before = 0;
var fileSizeInBytes_after = 0;

fs.readdir(sourcePath, function(err, files) {
  if (err) return console.log('Unable to scan directory: ' + err);

  files.forEach(function(file) {

    const filePath = path.join(sourcePath, file);
    const destFileName = file.replace("yob", "");

    fileSizeInBytes_before += fs.statSync(filePath).size;

    fs.readFile(filePath, "utf8", function(err, contents) {

      if (err) return console.log('Unable to read file: ' + err);
      else {
        const males = {};
        const females = {};
        const contentsArray = contents.split("\r\n");

        contentsArray.forEach(function(line) {
          if (line.length > 0) {
            const data = line.split(",");

            const name = data[0].trim();
            const count = parseInt(data[2].trim());
            if (data[1].trim().toUpperCase() == "F") {
              females[name] = count;
            } else {
              males[name] = count;
            }
          }
        });

        const femalePath = path.join(destPath, destFileName.replace(".txt", "_F.json"));
        const malePath = path.join(destPath, destFileName.replace(".txt", "_M.json"));

        fs.writeFileSync(femalePath, JSON.stringify(females));
        fs.writeFileSync(malePath, JSON.stringify(males));
        fileSizeInBytes_after = fileSizeInBytes_after + fs.statSync(femalePath).size;
        fileSizeInBytes_after = fileSizeInBytes_after + fs.statSync(malePath).size;

        console.log("Total file size before:" + fileSizeInBytes_before / (1024 * 1024) + "Mb");
        console.log("Total file size after:" + fileSizeInBytes_after / (1024 * 1024) + "Mb");
        console.log("Difference in total file size:" + ((fileSizeInBytes_before - fileSizeInBytes_after) / (1024 * 1024)) + "Mb")

      }
    });

  });
});