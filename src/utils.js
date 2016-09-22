import lwip from 'lwip';

export function openImage(file) {
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
