import * as fs from "fs";
import * as uuid from "uuid";
import { exec } from "child_process";

// Models
import { FileUploaderOptions } from "./models/file-uploader-options.model";
import { BreedScore } from "./models/breed-score.model";

const uploader = function(file: any, options: FileUploaderOptions) {
  if (!file) throw new Error("no file(s)");

  return _fileHandler(file, options);
};

const _fileHandler = function(file: any, options: FileUploaderOptions) {
  if (!file) throw new Error("no file");

  const originalName = file.hapi.filename;
  const fileName = `${uuid.v1()}-${originalName}`;
  const path = `${options.dest}${fileName}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on("error", function(err) {
      reject(err);
    });

    file.pipe(fileStream);

    file.on("end", function(err) {
      resolve(fileName);
    });
  });
};

const classifyImage = imagePath =>
  new Promise<BreedScore[]>((resolve, reject) => {
    exec(
      `
    python2 ./src/tensorflow/scripts/label_image.py \
      --graph=./src/tensorflow/retrained_graph.pb \
      --labels=./src/tensorflow/retrained_labels.txt \
      --image=${imagePath}
  `,
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject(stderr);
        }

        resolve(
          stdout
            .split("\n")
            .slice(3)
            .filter(labelResult => labelResult !== "")
            .map(labelResult => {
              const matches = labelResult.match(/([^\(]*) \(score=([^\)]*)/);
              if (matches) {
                const [, breed, score] = matches;

                return {
                  breed,
                  score: parseFloat(score)
                };
              }
            })
        );
      }
    );
  });

export { classifyImage, uploader };
