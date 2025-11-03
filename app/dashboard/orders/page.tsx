// Same with users page.tsx but for orders page.tsx
// Same Table, Modal, Form, Input, Button, Select, App imports and DeleteOutlined icon import

"use client";

import { useEffect, useState } from "react";
import { Table, Card, Spin, Row, Col, Typography, Modal, Form, Input, Button, Select, App } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getOrders, deleteOrder, getOrderById, createOrder, updateStatusOrder } from "@/services/orderService";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/productService";

const { Title } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: boolean;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { message } = App.useApp();

  const router = useRouter();
  
  const permission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");

  if (!permission?.orders.read ) {
    router.push("/dashboard");
  }

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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await getProducts()
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to fetch products:", err));

    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
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

  // Modal and Handle Add Order
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  const handleConfirmAdd = async () => {
    try {
      const values = await addForm.validateFields();
      await createOrder(values);
      message.success("Order created successfully.");
      fetchOrders();
    } catch (error) {
      message.error("Failed to create order.");
    } finally {
      setIsAddModalOpen(false);
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
                    {permission?.orders?.update && record.status === "Pending" && (
                      <>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => showEditModal(record.id)}
                        />

                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => showDeleteModal(record.id)}
                        />
                      </>
                    )}
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
        {permission?.orders?.write && (
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => { showAddModal(); fetchProducts(); }}>
            Add Order
          </Button>
        </Col>
        )}
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

      // Add Modar add order
      <Modal
        title="Add Order"
        open={isAddModalOpen}
        onOk={handleConfirmAdd}
        onCancel={handleCancelAdd}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="customer_name"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter the customer name." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_id"
            label="Product"
            rules={[{ required: true, message: "Please select a product." }]}
          >
            <Select>
              {/* Options should be populated dynamically */}
              {products.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name} - Rp. {product.price}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity." }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 