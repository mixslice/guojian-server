import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
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

function refreshToken() {
  const appId = process.env.APPID;
  const appSecret = process.env.APPSECRET;
  const accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  return fetch(accessTokenUrl)
  .then(response => response.json())
  .then(data => data.access_token)
  .catch(e => console.log(e));
}


app.post('/upload', (req, res) => {
  // mobile, name, serverId
  const { serverId } = req.body;
  refreshToken()
  .then((accessToken) => {
    const weixinApi = 'http://file.api.weixin.qq.com/cgi-bin/media/get';
    const imageUrl = `${weixinApi}?access_token=${accessToken}&media_id=${serverId}`;
    return downloadImage(imageUrl);
  })
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
