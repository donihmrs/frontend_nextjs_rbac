"use client";

import { Layout, Menu, Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { DesktopOutlined, UserOutlined, ShoppingOutlined, MailOutlined, LogoutOutlined } from '@ant-design/icons';
import Logout from "./Logout";
import { useEffect, useState } from "react";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

export default function Sidebar({ collapsed }: { collapsed?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const checkObjPermission = localStorage.getItem("permissions_obj");
    if (checkObjPermission) {
      const permission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");

      // buat menu dari permission JSON
      const items: MenuItem[] = Object.keys(permission)
        .filter((key) => permission[key].read)  // hanya tampilkan menu yang ada akses 'read'
        .map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon:
            key === "users" ? <UserOutlined /> :
            key === "products" ? <ShoppingOutlined /> :
            key === "orders" ? <DesktopOutlined /> :
            key === "invitations" ? <MailOutlined /> :
            <DesktopOutlined />,
        }));


      setItems(items);
    }
  }, []);

  

  return (
    <>
     <div style={{ flex: 1, overflowY: "auto" }}>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[pathname.split("/")[2]]}
        items={items.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => router.push(`/dashboard/${item.key}`)
        }))}
      />
    </div>

    <Logout collapsed={collapsed} />
    </>
  );
}
