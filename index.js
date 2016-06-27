const FB = require('fb')
const fs = require('fs')
const express = require('express');
const app = express();
const url = require('url');
const CLIENT_ID = null;
const CLIENT_SECRET = null;
app.listen(3000);

//copy this from https://developers.facebook.com/tools/explorer/
//(or you can wait for facebook to approve your app and use oauth 😣 )
//make sure to request `publish_actions` permission
var accessToken = 'EAACEdEose0cBALujVpSwtdhWh9QO1PdlidtCYt6kMhp9KQCzWqXOHGfk91zuqfMm2vcNjahMOqrqZA8eA4rWkEwafXgSi8ziNHWzDtGmGXKVZC4ZC4TCqnLVb9L56RcyKJ3Q0YDy94bG49P4viZAaAePAZAIjd1dJrgZA6zc5L3QZDZD';
if(accessToken){
  return upload(accessToken)
}

app.get('/login', function(req, res){
  var redirectUrl = FB.getLoginUrl({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/fbOauth',
    response_type: 'code'
  });
  console.log(redirectUrl);
  res.send('<html><head><title>Send photo</title></head><body><a href="'+redirectUrl+'">Upload a photo</a></body></html>');
})
app.get('/fbOauth', function(req, res){
  if(accessToken){
    res.send({});
  } else {
    getToken(req.query.code, function(){
      res.send({});
    });
  }
})

function getToken(code, done){
  console.log('getToken')
  FB.api('oauth/access_token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/fbOauth',
    code: code
  }, function(res){
    if(!res || res.error){
      return console.log('error', res.error);
    }
    console.log(res);
    accessToken = res.access_token;
    upload(accessToken);
    done();
  });
}



function upload(accessToken){
  console.log(accessToken);

  var params = {
    message: 'testing photosphere upload',
    allow_spherical_photo: true,
    source: fs.createReadStream('IMG_6207.JPG'),
    access_token: accessToken,
    privacy: {
      value: 'SELF'
    }
  }
  FB.api('me/photos', 'post', params, function(res) {
    if(!res || res.error){
      console.log(!res ? 'error' : res.error);
      return;
    }
    console.log('post id: ' + res.id);
  });
}
