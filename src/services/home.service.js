import api from "./api";
export async function getHomePageContent() {
    const response = await api.get("/home");
    return response.data.data;
}
