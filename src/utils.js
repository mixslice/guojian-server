import lwip from 'lwip';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import http from 'http';


function openImage(file) {
  return new Promise((resolve, reject) => {
    lwip.open(file, (err, image) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(image);
    });
  });
}

export function processImage({ name, filePath }) {
  const logoPath = path.join(__dirname, '../logo.png');
  const pad = 40;
  const spacing = 30;

  return new Promise((resolve, reject) => {
    Promise.all([openImage(filePath), openImage(logoPath)])
    .then(([image, logo]) => {
      const bottomPos = spacing + logo.height();
      const bottomPad = bottomPos + spacing;

      image.cover(960, 1440, (coverErr, croppedImage) => {
        croppedImage.writeFile(path.join(__dirname, '../output/crop', name), (e) => {
          if (e) {
            reject(e);
          }
        });

        croppedImage.extract(pad, pad, 960 - pad, 1440 - bottomPad, (extractErr, img) => {
          const outputPath = path.join(__dirname, '../output/frame', name);
          img.batch()
          .crop(960 - pad - pad, 1440 - pad - bottomPad)
          .pad(pad, pad, pad, bottomPad, 'white')
          .paste(960 - logo.width() - pad, 1440 - bottomPos, logo)
          .writeFile(outputPath, (e) => {
            if (e) {
              reject(e);
            }
            resolve(name);
          });
        });
      });
    })
    .catch(e => reject(e));
  });
}

export function downloadImage(url) {
  // TODO: download and save image
  const name = `${moment().format('MMMDD_HH-mm-ss')}.jpg`;
  const filePath = path.join(__dirname, '../upload', name);
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filePath);
    http.get(url, (response) => {
      response.pipe(file);
    }).on('close', () => {
      resolve({
        name,
        filePath,
      });
    });
  });
}
