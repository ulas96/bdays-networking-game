import axios from "axios";

export async function setUser(name: string, email: string, phone: string, linkedin: string) {
    const response = await axios.get("https://b34fgpro7k.execute-api.eu-central-1.amazonaws.com/default/bdays-write-user", {params: {name, email, phone, linkedin}});
    return response.data;   
}

export async function getUserByEmail(email: string) {
    const response = await axios.get("https://3n3l9jzjlg.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user-by-email", {params: {email}});
    return response.data;
}

export async function getUserById(id: string) {
    const response = await axios.get("https://manxq01vdd.execute-api.eu-central-1.amazonaws.com/default/bdays-read-user", {params: {id}});
    return response.data;
}

export async function getUserByName(name: string) {
    const response = await axios.get("https://waq6xksnbf.execute-api.eu-central-1.amazonaws.com/default/bdays-read-by-name", {params: {name}});
    return response.data;
}

export async function addFriends(id1: string, id2: string) {
    const response = await axios.get("https://jkrxhvqegh.execute-api.eu-central-1.amazonaws.com/default/bdays-add-friends", {params: {id1, id2}});
    return response.data;
}

export async function getLeaderboard() {
    const response = await axios.get("https://h46glcx3dl.execute-api.eu-central-1.amazonaws.com/default/bdays-get-leaderboard");
    return response.data;
} 