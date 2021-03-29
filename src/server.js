const app = require('./app');
const port = process.env.PORT

app.listen(port,()=>{
    console.log(`API listening at http://localhost:${port}`)
})
