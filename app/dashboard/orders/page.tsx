// Same with users page.tsx but for orders page.tsx
// Same Table, Modal, Form, Input, Button, Select, App imports and DeleteOutlined icon import

"use client";

import { useEffect, useState } from "react";
import { Table, Card, Spin, Row, Col, Typography, Modal, Form, Input, Button, Select, App } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getOrders, deleteOrder, getOrderById, createOrder, updateStatusOrder } from "@/services/orderService";

const { Title } = Typography;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { message } = App.useApp();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      message.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Delete Order
  const showDeleteModal = (id: number) => {
    setSelectedOrderId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrderId === null) return;

    try {
      await deleteOrder(selectedOrderId);
      message.success("Order deleted successfully.");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  // Handle Edit Order
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();

  // Show Edit Modal
  const showEditModal = (id: number) => {
    setSelectedOrderId(id);
    setIsEditModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrderId(order.id);
    editForm.setFieldsValue({ status: order.status });
    setIsEditModalOpen(true);
  };

  const handleSaveEditStatus = async (values: any) => {
    if (!selectedOrderId) return;

    try {
      await updateStatusOrder(selectedOrderId, values);
      message.success("Order updated successfully.");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order.");
    } finally {
      setIsEditModalOpen(false);
      setSelectedOrderId(null);
    }
  };  

  const columns = [
              { title: "ID", dataIndex: "id", key: "id" },
              { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
              { title: "Product", render: (_: any, record: any) => record.product.name, key: "product.name" },
              { title: "Price", render: (_: any, record: any) => record.product.price, key: "product.price" },
              { title : "Quantity", dataIndex: "quantity", key: "quantity" },
              { title: "Total", dataIndex: "total_price", key: "total_price" },
              { title: "Status", render: (_: any, record: any) => (
                <span>
                  <Button type={record.status === "Pending" ? "default" : "primary"} shape="round" size="small" >
                    {record.status}
                  </Button>
                </span>
              ), key: "status" },
              {
                title: "Actions",
                key: "actions",
                render: (_: any, record: any) => (
                  <>
                    {/* Edit show only if status is Pending */}
                    {record.status === "Pending" && (
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(record.id)}
                    > </Button>) && <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteModal(record.id)}
                    />}
                    
                  </>
                ),
              },
            ]

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Title level={4}>Orders</Title>
        </Col>
      </Row>
      <Card>
        {loading ? (
          <Spin />
        ) : (
          <Table
            dataSource={orders}
            rowKey="id"
            columns={columns}
          />
        )}
      </Card>

      <Modal
        title="Edit Order Status"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSaveEditStatus}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Order"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this order?</p>
      </Modal>
    </div>
  );
} 