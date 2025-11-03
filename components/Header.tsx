"use client";

import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

interface HeaderProps {
  collapsed?: boolean;
  toggle?: () => void;
}

export default function HeaderBar({ collapsed, toggle }: HeaderProps) {
  return (
    <Header
      style={{
        padding: "0 16px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
      }}
    >
      {toggle && (
        <Button type="text" onClick={toggle} style={{ marginRight: 16 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>

      )}
      <h3>Dashboard</h3>
    </Header>
  );
}
