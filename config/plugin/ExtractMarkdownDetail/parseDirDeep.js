const fs = require("fs");
const path = require("path");
const readline = require("readline");

const MAX_LINE = 6;

function readdirPromise(pathName) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathName, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function statPromise(pathName) {
  return new Promise((resolve, reject) => {
    fs.stat(pathName, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function readFileByLine(fReadName, maxLine) {
  return new Promise((resolve, reject) => {
    try {
      const fRead = fs.createReadStream(fReadName);
      const rl = readline.createInterface({
        input: fRead,
      });
      const fileData = [];
      rl.on("line", (line) => {
        fileData.push(line);
        if (fileData.length >= maxLine) {
          fRead.close();
          rl.close();
        }
      });
      rl.on("close", () => {
        resolve([...fileData]);
      });
    } catch (err) {
      reject(err);
    }
  });
}

//  [ '<!--',
//   ' * @Author: chenwen11',
//   ' * @Date: 2020-06-28 14:48:42',
//   ' * @LastEditTime: 2020-06-28 16:20:35',
//   ' * @Description: ',
//   '--> ' ]
function parseFileContent(content) {
  if (content.length !== MAX_LINE) {
    return {
      date: "",
      lastEditTime: "",
      description: "",
    };
  } else {
    return {
      date: content[2].replace("* @Date:", "").trim(),
      lastEditTime: content[3].replace("* @LastEditTime:", "").trim(),
      description: content[4].replace("* @Description:", "").trim(),
    };
  }
}

const parseDirDeep = async function (pathName, rootPath) {
  rootPath = rootPath || pathName
  try {
    const files = await readdirPromise(pathName);
    const fileData = await Promise.all(
      files.map(async (file) => {
        const joinPath = path.join(pathName, file);
        const data = await statPromise(joinPath);
        if (data.isFile() && path.extname(file).toLowerCase() === ".md") {
          const absolutePath = path.join(pathName, file);
          const fileDetail = await readFileByLine(absolutePath, MAX_LINE);
          return Object.assign({ name: file, path: absolutePath.replace(rootPath, '').slice(0, -3) }, parseFileContent(fileDetail));
        } else if (data.isDirectory()) {
          return {
            [file]: await parseDirDeep(joinPath, rootPath),
          };
        }
      })
    );
    return fileData;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = parseDirDeep;
