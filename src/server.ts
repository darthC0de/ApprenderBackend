import { config as env } from "dotenv";
env();
import app from "./app";

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`API listening at http://localhost:${port}`)
})
