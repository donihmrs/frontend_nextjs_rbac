// Same with users page.tsx but for invitations page.tsx
// Same Table, Modal, Form, Input, Button, Select, App imports and DeleteOutlined icon import

"use client";

import { useEffect, useState } from "react";
import { Table, Card, Spin, Row, Col, Typography, Modal, Form, Input, Button, Select, App } from "antd";
import { EditOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";
import { getInvitations, revokeInvitation, getInvitationById, createInvitation } from "@/services/invitationService";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | null>(null);
  const { message } = App.useApp();

  const [permission, setPermission] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    // ini baru jalan di client
    const storedPermission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");
    setPermission(storedPermission);

    if (!storedPermission?.invitations.read ) {
      router.push("/dashboard");
    }
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (error) {
      message.error("Failed to fetch invitations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // Handle Revoke Invitation
  const showRevokeModal = (id: number) => {
    setSelectedInvitationId(id);
    setIsRevokeModalOpen(true);
  };

  const handleCancelRevoke = () => {
    setIsRevokeModalOpen(false);
    setSelectedInvitationId(null);
  };

  const handleConfirmRevoke = async () => {
    if (selectedInvitationId === null) return;

    try {
      await revokeInvitation(selectedInvitationId);
      message.success("Invitation revoked successfully.");
      fetchInvitations();
    } catch (error) {
      message.error("Failed to revoke invitation.");
    } finally {
      setIsRevokeModalOpen(false);
      setSelectedInvitationId(null);
    }
  };

  // Handle Create Invitation , with object email and role
  const [form] = Form.useForm();
  
  const handleCreateInvitation = async () => {
    const values = await form.validateFields();
    try {
      await createInvitation(values);
      message.success("Invitation created successfully.");
      fetchInvitations();

      handleFormFinish();
    } catch (error) {
      message.error("Failed to create invitation.");
    }
  };

  const handleFormFinish = () => {
    form.resetFields();
  };

  // Handle show modal for create invitation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    handleFormFinish();
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
    handleFormFinish();
  };

  const handleOpenNewTab = (token: string) => {
    const url = "/accept?token=" + token;
    window.open(url, "_blank"); // buka di tab baru
  };

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Token", dataIndex: "token", key: "token" },
    // Button Status Proceed or Waiting

    { title: "Status", render: (_: any, record: any) => (record.is_used ? <Button type="primary" shape="round" size="small">Proceed</Button> : <Button type="default" shape="round" size="small">Waiting</Button>), key: "is_used" },

    // Created At and Expires Datetime Formatting
    { render : (_: any, record: any) => new Date(record.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) , title: "Created At", key: "created_at" },
    { render : (_: any, record: any) => new Date(record.expires_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) , title: "Expires At", key: "expires_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        // If record is_used is false, show Revoke button
        <>
        {permission?.invitations?.update && !record.is_used && (
          <>
            <Button
              type="text"
              icon={<StopOutlined />}
              danger
              onClick={() => showRevokeModal(record.id)}
            >
              Revoke
            </Button>

            <Button
              type="primary"
              size="small"
              onClick={() => handleOpenNewTab(record.token)}
              style={{ marginLeft: 8 }}
            >
              Accept
            </Button>
          </>
        )}
      </>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Title level={3}>Invitations</Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => showCreateModal()}>
            Add Invitation
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          dataSource={invitations}
          rowKey="id"
          columns={columns}
        />
      </Spin>

      <Modal
        title="Confirm Revocation"
        open={isRevokeModalOpen}
        onOk={handleConfirmRevoke}
        onCancel={handleCancelRevoke}
        okText="Revoke"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to revoke this invitation?</p>
      </Modal>

      {/* Create Invitation Modal */}
      <Modal
        title="Create Invitation"
        open={isCreateModalOpen}
        onOk={handleCreateInvitation}
        onCancel={handleCancelCreate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email address." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}