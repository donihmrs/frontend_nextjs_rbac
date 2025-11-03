import { Button } from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from "@/services/authService";

async function handleLogout() {
  // Call api logout di backend , add body refresh , add then remove token dari localStorage dan cookie
  await logout(localStorage.getItem("refresh_token") || "").then(() => {
      // hapus token dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("profile_obj");
      localStorage.removeItem("permissions_obj");

      // hapus cookie
      document.cookie = "token=; refresh_token=; path=/; max-age=0;";

      // redirect ke halaman login
      window.location.href = "/login";
  }).catch((err) => {
    console.error("Logout API error:", err);
  });
}

export default function Logout({ collapsed }: { collapsed?: boolean }) {
    return(
        <div style={{ padding: "1rem", borderTop: "1px solid #f0f0f0" }}>
            <Button
                type="default"
                icon={<LogoutOutlined />}
                danger
                block
                onClick={handleLogout}
            >
                {!collapsed ? "Logout" : ""}
            </Button>
        </div>
    );
}