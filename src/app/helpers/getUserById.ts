import axios from "axios";

export async function getUserById(id: string) {
    const response = await axios.get("https://manxq01vdd.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user", {params: {id}});
    return response.data;
}
