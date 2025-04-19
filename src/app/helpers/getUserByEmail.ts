import axios from "axios";

export async function getUserByEmail(email: string) {
    
    const response = await axios.get("https://3n3l9jzjlg.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user-by-email", {params: {email}});
    
    return response.data;
}