const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, '../public');
console.log(publicDir);

app.use(express.static(publicDir));

// app.get('/', (req, res) => {
//     res.send('heeello');
// })

//app.listen(3000);
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})