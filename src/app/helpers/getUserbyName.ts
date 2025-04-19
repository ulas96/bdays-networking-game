import axios from "axios";

export async function getUserByName(name: string) {
    const response = await axios.get("https://waq6xksnbf.execute-api.eu-central-1.amazonaws.com/default/bdays-read-by-name", {params: {name}});
    return response.data;
}
    