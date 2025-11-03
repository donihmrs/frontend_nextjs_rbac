"use client";

import { Layout, Grid, Button, ConfigProvider, App as AntdApp } from "antd";
import Sidebar from "@/components/Sidebar"; // untuk desktop
import SidebarDrawer from "@/components/SidebarDrawer"; // untuk mobile
import HeaderBar from "@/components/Header";
import FooterBar from "@/components/Footer";
import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ThemeConfig } from "antd/es/config-provider/context";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const themeConfig: ThemeConfig = {
  components: {
    Menu: {
      itemHoverColor: "#e6f4ff",
      itemHoverBg: "rgba(0, 100, 241, 1)",   
      itemSelectedBg: "rgba(0, 100, 241, 1)",
      itemSelectedColor: "#e6f4ff",
    },
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed} 
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
          }}
          >
            <Sidebar collapsed={collapsed} />
          </Sider>
        )}

        <Layout>
          <HeaderBar
            toggle={() => {
              if (isMobile) setDrawerOpen(true);
              else setCollapsed(!collapsed);
            }}
            collapsed={collapsed}
          />

          {/* Mobile Drawer Sidebar */}
          {isMobile && (
            <SidebarDrawer collapsed={collapsed} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          )}

          <Content style={{ margin: "16px" }}><AntdApp>{children}</AntdApp></Content>
          <FooterBar />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
