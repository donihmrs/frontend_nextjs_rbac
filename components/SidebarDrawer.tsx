"use client";

import { Drawer, Menu } from "antd";
import { useRouter } from "next/navigation";
import { DesktopOutlined, UserOutlined, ShoppingOutlined, MailOutlined } from '@ant-design/icons';
import Logout from "./Logout";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  collapsed?: boolean;
  onClose: () => void;
}

export default function SidebarDrawer({ open, collapsed, onClose }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  
  
  useEffect(() => {
    const checkObjPermission = localStorage.getItem("permissions_obj");
    if (checkObjPermission) {
      const permission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");

      const items = Object.keys(permission)
        .filter(key => permission[key].read)
        .map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon:
            key === "users" ? <UserOutlined /> :
            key === "products" ? <ShoppingOutlined /> :
            key === "orders" ? <DesktopOutlined /> :
            key === "invitations" ? <MailOutlined /> :
            <DesktopOutlined />,
          onClick: () => {
            router.push(`/dashboard/${key}`);
            onClose(); // tutup drawer setelah klik
          }
        }));

      setItems(items);
    }
  }, [])

  

  return (
    <Drawer
      title="Menu"
      placement="left"
      onClose={onClose}
      open={open}
    >
      <Menu theme="light" mode="inline" items={items} />

      <Logout collapsed={collapsed} />
    </Drawer>
  );
}
