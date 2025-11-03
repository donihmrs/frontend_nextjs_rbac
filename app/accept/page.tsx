// Accept Invitation Page
// Get token from URL query params
// Show form to set password, username, first_name , last_name and accept invitation
// On form submit, call acceptInvitation API with token and form data
// Show success or error message based on API response
// Redirect to login page on success
// Page allows user to accept an invitation using a token provided in the URL.

'use client';

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { acceptInvitation } from "@/services/invitationService";
import { useSearchParams } from "next/navigation";

const { Title } = Typography;

function AcceptInvitationContent() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleAcceptInvitation = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await acceptInvitation(token, values);
      message.success("Invitation accepted successfully. Please log in.");
      router.push("/login");
    } catch (error: any) {
      message.error(error?.message || "Failed to accept invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Accept Invitation
      </Title>
      <Form form={form} layout="vertical" onFinish={handleAcceptInvitation}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Accept Invitation
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationContent />
    </Suspense>
  );
}