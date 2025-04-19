import axios from "axios";

export async function addFriends(user1: string, user2: string) {
    const response = await axios.get("https://jkrxhvqegh.execute-api.eu-central-1.amazonaws.com/default/bdays-add-friends", {params: {user1, user2}});
    return response.data;
}