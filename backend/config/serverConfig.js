import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../", ".env"),
});
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI
const JSON_WEB_TOKEN = process.env.JSON_WEB_TOKEN
const EMAIL_USER=process.env.EMAIL_USER
const EMAIL_PASS=process.env.EMAIL_PASS
export {PORT,MONGODB_URI,JSON_WEB_TOKEN,EMAIL_PASS,EMAIL_USER}