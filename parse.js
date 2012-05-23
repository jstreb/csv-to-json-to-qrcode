var fs = require('fs');
var sys = require('util');
var QRCode = require('qrcode');

var csvFile = process.argv[2] || "users.csv";

if( csvFile.substring( csvFile.length - 3, csvFile.length) !== "csv" ) {
  console.log( "The script only accepts a csv file a valid source file.");
  return;  
}

var stream = fs.createReadStream( csvFile );
var buffer = "";

function generateAndSaveQRCode( text, fileName ) {
  QRCode.save( fileName, text, function( err, message) {
    console.log( "saved" );
  });
}

stream.addListener('data', function(data){
  var contacts;
  var topics;
  
  buffer += data.toString();
  contacts = buffer.split('\r')
  
  //Get the top level categories
  topics = contacts[0].split( "," );
  
  //move the first contact off as this is the headers..."first name", "title"
  contacts.shift();
  
  for( var i=0, len=contacts.length; i<len; i++ ) {
    var info = contacts[i].split( "," );
    var obj = {};
    var url;
    var fileName;
    
    for( var j=0; j<topics.length; j++) {
      if( info[j] === undefined || topics[j] === "" ) {
        break;
      }
      obj[topics[j]] = info[j].replace( "\n", "" );
    }
    
    fileName = "./output/" + info[0].replace( "\n", "" ) + ".jpg";
    
    obj = JSON.stringify( obj );
    
    generateAndSaveQRCode( obj, fileName );
  }
});

