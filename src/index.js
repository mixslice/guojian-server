import path from 'path';
import { openImage } from './utils';


const imagePath = path.join(__dirname, '../upload', 'image.jpg');
const logoPath = path.join(__dirname, 'logo.png');

Promise.all([openImage(imagePath), openImage(logoPath)])
.then(([image, logo]) => {
  image.batch()
  .rotate(90, 'white')
  .crop(200, 200)
  .paste(0, 0, logo)
  .writeFile(path.join(__dirname, '../output', 'image.jpg'), (e) => {
    if (e) {
      console.log(e);
    }
  });
});

