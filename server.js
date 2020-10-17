const path = require('path')

const express = require('express')
const app = express();
const PORT = 8000;
const portNumber = app.listen(PORT || 3000);

app.listen(portNumber, () => {
  console.log(`Server running on ${PORT}`);
})

app.use(express.static(path.join(__dirname, 'client', 'build')));


const publicPath = path.join(__dirname, 'client', 'build');

app.get('*', (req, res) => {    
     res.sendFile(path.join(publicPath, 'index.html')), function(err) {             
     if (err) {                 
          res.status(500).send(err) 
          }        
     };
});