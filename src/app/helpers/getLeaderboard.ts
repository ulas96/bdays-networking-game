import axios from "axios";

export async function getLeaderboard() {
    const response = await axios.get("https://h46glcx3dl.execute-api.eu-central-1.amazonaws.com/default/bdays-get-leaderboard");
    return response.data;
}
    