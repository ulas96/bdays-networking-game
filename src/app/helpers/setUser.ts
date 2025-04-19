import axios from "axios";

export async function setUser(name: string, email: string, phone: string, linkedin: string) {

    const response = await axios.get("https://b34fgpro7k.execute-api.eu-central-1.amazonaws.com/default/bdays-write-user", {params: {name, email, phone, linkedin}});

    return response.data;   
}
