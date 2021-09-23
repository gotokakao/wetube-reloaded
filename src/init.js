import "dotenv/config";
import "regenerator-runtime";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comments";
import app from "./server";


const POST = process.env.PORT || 4000;

const handleListening = () => console.log(`Server listening on port http://localhost:${POST}👍`);

app.listen(POST, handleListening);