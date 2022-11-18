var request=require('request');

var access_token='AQRLHzJA2coBcXDBiHANNtXRDjHQYzj_ZjGLcpIxk6RTCWRBeNf7FYZiRo1SGiVuX01MnfcZWuQC6_X8HVHcnaCOL8kJwlBGdL6x94KH9HTCC9zU4rkK56u-tdaXyq_DS2e37zJ1Xf0spbI-kV0TAvTCX70yz4b1NhBIEHHcE9-hE2siF6E4d3JICwQ-mWlJ2AHXHYlqoJVdP6sxbGc';

request.get({url:"https://api.linkedin.com/v2/me",headers:{"Authorization":"Bareer "+access_token}},function(err,res,responseBody){
    if(err){
        console.log(err)
        // done(err,null)
    }
    else{
        // done(null,JSON.parse(responseBody))
        console.log(JSON.parse(responseBody))
    }
})