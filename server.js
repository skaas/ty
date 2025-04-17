const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/dist'))

app.get('/assets/**/:file', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'src/' + request.path));
});

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
})

app.listen(port, '0.0.0.0')
console.log("server started on port " + port);