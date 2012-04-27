var fs = require('fs');
var sys = require('util');
var QRCode = require('qrcode');

var stream = fs.createReadStream("users.csv");
var buffer = "";

function generateAndSaveQRCode( text, fileName ) {
  QRCode.save( fileName, text, function( err, message) {
    console.log( "saved" );
  });
}

stream.addListener('data', function(data){
  var contacts;
  buffer += data.toString();
  contacts = buffer.split('\r')
  //move the first contact off as this is the headers..."first name", "title"
  contacts.shift();
  
  for( var i=0, len=contacts.length; i<len; i++ ) {
    var info = contacts[i].split( "," );
    var obj = {};
    var url;
    var fileName;
    
    obj.firstName = info[0];
    obj.lastName = info[1];
    obj.company = info[2];
    obj.title = info[3];
    obj.email = info[4];
    
    fileName = "./output/" + info[0] + info[1] + ".jpg";
    
    obj = JSON.stringify( obj );
    
    generateAndSaveQRCode( obj, fileName );
  }
});

