import axios from "axios";

export async function setUser(name: string, email: string, phone: string, linkedin: string) {
    const response = await axios.post(
        "https://b34fgpro7k.execute-api.eu-central-1.amazonaws.com/default/bdays-write-user", 
        { name, email, phone, linkedin }
    );

    return response.data;   
} 