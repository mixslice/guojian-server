import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { processImage, downloadImage } from './utils';


/**
 * init app
 */
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

/**
 * provide root route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'hello',
  });
});

app.post('/upload', (req, res) => {
  // mobile, name, serverId
  const { serverId } = req.body;
  const accessToken = 'SiKDETwU2gSJ57PfWlACibP6h7QJXhFRlE2zk-tU_X8RNQbfew_LUvzShFzp-Z_Y8PJtoVjvR0e8me7lpyU2k8kBLFyDjFYQusyUknR-Bb0LRTfucES6hjxC1VFjGkaoYHWfAIAQZO';
  const weixinApi = 'http://file.api.weixin.qq.com/cgi-bin/media/get';
  const imageUrl = `${weixinApi}?access_token=${accessToken}&media_id=${serverId}`;
  downloadImage(imageUrl)
  .then(file => processImage(file))
  .then(imageName => res.json({
    image: `/image/${imageName}`,
  }))
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  });
});

app.get('/image/:uid', (req, res) => {
  const uid = req.params.uid;
  res.sendFile(uid, { root: path.join(__dirname, '../output/frame') });
});


/**
 * start app
 */
const server = app.listen(3001, () => {
  const port = server.address().port;
  console.log(`app listening on http://localhost:${port}`);
});

export default server;
