import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";


const POST = 4000;

const handleListening = () => console.log(`Server listening on port http://localhost:${POST}`);

app.listen(POST, handleListening);