var default_value = require('../config.json');

var config = {
  instagram_user_id: default_value.instagram.User_ID,
  instagram_access_token: default_value.instagram.ACCESS_TOKEN,
  instagram_redirect_uri: default_value.instagram.REDIRECT_URI,
  instagram_client_id: default_value.instagram.CLIENT_ID,
  instagram_client_secret: default_value.instagram.CLIENT_SECRET
};

module.exports = config;
