
const express = require("express");
const https = require("https");
const fs = require("fs");
const port = 8080;

const key = fs.readFileSync(__dirname + "/certs/selfsigned.key");
const cert = fs.readFileSync(__dirname + "/certs/selfsigned.crt");
const options = {
	key: key,
	cert: cert
};

app = express();
// app.get("/", (req, res) => {
// 	res.send('Now using https..');
// });
app.use(express.static(__dirname));

const server = https.createServer(options, app);

server.listen(port, () => {
	console.log("server starting on port: " + port)
});


// "End of file";