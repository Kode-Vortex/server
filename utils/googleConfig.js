import {google} from "googleapis"
import dotenv from "dotenv"

dotenv.config({path : "../.env"})

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLINET_SECRET = process.env.GOOGLE_CLINET_SECRET;





export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLINET_SECRET,
    'postmessage'
)