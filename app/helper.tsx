export const refreshToken = async () => {
    try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token/refresh`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            refresh: localStorage.getItem("refresh_token")
            })
        });

        if (!refreshRes.ok) {
            // If refresh token is invalid or expired, redirect to login
            console.log("Refresh token invalid or expired");
            // Optionally, you can clear localStorage here
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("profile_obj");
            localStorage.removeItem("permissions_obj");

            // Clear Cookies
            document.cookie = "token=; refresh_token=; path=/; max-age=0;";

            return false;
        }

        const refreshData = await refreshRes.json();
        localStorage.setItem("token", refreshData.access);
        localStorage.setItem("refresh_token", refreshData.refresh);

        // Retry fetching products with new token and sleep 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Token refreshed successfully");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const saveLoginData = async (data: any) => {
    if (data.access && data.refresh) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Decode Base64 and store the profile object
        localStorage.setItem("profile_obj", Buffer.from(data.profile, "base64").toString("utf-8"));

        // Decode Base64 and store the permissions object
        localStorage.setItem("permissions_obj", Buffer.from(data.permissions, "base64").toString("utf-8"));

        console.log("Profile Object:", localStorage.getItem("profile_obj"));
        console.log("Permissions Object:", localStorage.getItem("permissions_obj"));

        document.cookie = `token=${data.access}; refresh_token=${data.refresh}; path=/; max-age=259200;`;

        console.log("Login successful!");

        return true;
    } else {
    console.error("Token not found in response.");
    return false;
    }
};

export default { refreshToken, saveLoginData };