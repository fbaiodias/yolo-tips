var config = {};

config.pushbullet = {
  token: process.env.YOLOFLIGHT_PB_ACCESSTOKEN,
  clientId: process.env.YOLOFLIGHT_PB_CLIENTID,
  clientSecret: process.env.YOLOFLIGHT_PB_CLIENTSECRET,
}

module.exports = config;