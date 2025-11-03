"use client";

import { useEffect, useState } from "react";
import { Table, Card, Spin, Row, Col, Typography, Modal, Form, Input, Button, Select, App, Badge } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getUsers, deleteUser, getUserByUsername, updateUser, createUser } from "@/services/userService";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserUsername, setSelectedUserUsername] = useState<string | null>(null);
  const { message } = App.useApp();

  const [permission, setPermission] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    // ini baru jalan di client
    const storedPermission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");
    setPermission(storedPermission);

    if (!storedPermission?.users.read ) {
      router.push("/dashboard");
    }
  }, []);
  

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Delete User
  const showDeleteModal = (username: string) => {
    setSelectedUserUsername(username);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserUsername(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserUsername === null) return;

    try {
      await deleteUser(selectedUserUsername);
      message.success("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUserUsername(null);
    }
  };

  // Handle Edit User

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserUsername, setEditUserUsername] = useState<string | null>(null);
  const [editForm] = Form.useForm();

  const showEditModal = (username: string) => {
    setEditUserUsername(username);

    getUserByUsername(username).then((userData) => {
      editForm.setFieldsValue({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
      });
      setIsEditModalOpen(true);
    }).catch(() => {
      message.error("Failed to fetch user data.");
    });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditUserUsername(null);
  };

  const handleConfirmEdit = async () => {
    if (editUserUsername === null) return;

    try {
      const values = await editForm.validateFields();

      updateUser(editUserUsername, values).then(() => {
        message.success("User edited successfully.");
        fetchUsers();
      }).catch(() => {
        message.error("Failed to edit user.");
      });
    } catch (error) {
      message.error("Failed to edit user.");
    } finally {
      setIsEditModalOpen(false);
      setEditUserUsername(null);
    }
  };   

  // Handle Create User
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handleConfirmCreate = async () => {
    try {
      const values = await createForm.validateFields();
      await createUser(values);
      message.success("User created successfully.");
      fetchUsers();
    } catch (error) {
      message.error("Failed to create user.");
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: any) => (
        // If Admin, badge success, else if manager badge warning, else default
        <div>
          <Badge 
            color={role === "admin" ? "green" : role === "manager" ? "orange" : "grey"}
            text={role === "admin" ? "Admin" : role === "manager" ? "Manager" : "Staff"}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          {permission?.users?.update && (
            <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record.username)} />
          )}
          {permission?.users?.delete && (
            <Button type="link" icon={<DeleteOutlined />} onClick={() => showDeleteModal(record.username)} />
          )}
        </div>
      ),
    }
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Title level={4}>Users</Title>
        </Col>
        {permission?.users?.write && (
          <Col span={12} style={{ textAlign: "right", marginBottom: 16 }}>
            <Button type="primary" onClick={showCreateModal}>Add New User</Button>
          </Col>
        )}
      </Row>
      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={users} columns={columns} rowKey="id" />
      )}

      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onOk={handleConfirmEdit}
        onCancel={handleCancelEdit}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="first_name" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select the role!' }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>  

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <Modal
        title="Create User"
        open={isCreateModalOpen}
        onOk={handleConfirmCreate}
        onCancel={handleCancelCreate}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input the password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="first_name" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select the role!' }]}>
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