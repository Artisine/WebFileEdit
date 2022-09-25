
const express = require("express");
const https = require("https");
const fs = require("fs");
const port = 8080;

var key = fs.readFileSync(__dirname + "/certs/selfsigned.key");
var cert = fs.readFileSync(__dirname + "/certs/selfsigned.crt");
var options = {
	key: key,
	cert: cert
};

app = express()
app.get("/", (req, res) => {
	res.send('Now using https..');
});

const server = https.createServer(options, app);

server.listen(port, () => {
	console.log("server starting on port: " + port)
});


// "End of file";