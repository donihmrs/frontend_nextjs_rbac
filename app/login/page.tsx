"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Input, Button, Typography, message, Spin } from "antd";
import { login } from "@/services/authService";
import { saveLoginData } from "../helper";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const data = await login(values.username, values.password)

      if (data) {
        const saved = await saveLoginData(data);
        if (saved) {
          router.push("/dashboard");
        } else {
          throw new Error("Failed to save login data");
        }
      } else {
        message.error("Invalid login response");
      }
      
    
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: "1rem",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>
            Login
          </Title>
          <p style={{ color: "#888" }}>Please sign in to continue</p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
