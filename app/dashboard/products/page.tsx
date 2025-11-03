"use client";

import { useEffect, useState } from "react";
import { Table, Card, Spin, Row, Col, Typography, Modal, Form, InputNumber, Input, Button, Select, App, Breakpoint } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: boolean;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [permission, setPermission] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    // ini baru jalan di client
    const storedPermission = JSON.parse(localStorage.getItem("permissions_obj") || "{}");
    setPermission(storedPermission);

    if (!storedPermission?.products.read ) {
      router.push("/dashboard");
    }
  }, []);

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();

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
    fetchProducts();
  }, []);


  // Delete Modal Handlers
  const showDeleteModal = (id: number) => {
    setIsDeleteModal(true);

    getProductById(id)
      .then((data) => {
        setSelectedProduct(data);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        message.error("Failed to load product data");
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteModal(false);
  }

  const handleOkDelete = () => {
    // Delete product call API
    deleteProduct(selectedProduct!.id).then(() => {
      message.success("Product deleted successfully");

      setSelectedProduct(null);
      // Refresh product list
      setIsDeleteModal(false);
      
      fetchProducts();
    }).catch((err) => {
      console.error("Failed to delete product:", err);
      message.error("Failed to delete product");
    });
  };

  // Edit Modal Handlers

  const showModal = (id: number) => {
    setIsModalOpen(true);

    getProductById(id)
      .then((data) => {
        setSelectedProduct(data);
        form.setFieldsValue({
          ...data,
          status: data.status ? "active" : "inactive",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        message.error("Failed to load product data");
      });
  };

  const handleUpdate = (values: any) => {
    // Set Payload 

    // Convert status to boolean
    if (values.status === "active") {
      values.status = true;
    } else {
      values.status = false;
    }

    const payload = {
      name: values?.name,
      price: values?.price,
      stock: values?.stock,
      status: values?.status,
    };

    updateProduct(selectedProduct!.id, payload).then(() => {
      // Notification from antd
      message.success("Product updated successfully");

      setSelectedProduct(null);
      // Refresh product list
      setIsModalOpen(false);
      
      fetchProducts();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Handle Modal Add New Product

  const showAddModal = () => {
    setIsAddModalOpen(true);

    // Reset form fields
    formAdd.resetFields();
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  const handleAddProduct = (values: any) => {

    const payload = {
      name: values?.name,
      price: values?.price,
      stock: values?.stock,
      status: values?.status === "active" ? true : false,
    };

    createProduct(payload).then(() => {
      message.success("Product added successfully");

      setIsAddModalOpen(false);
      // Refresh product list
      fetchProducts();
    }).catch((err) => {
      console.error("Failed to add product:", err);
      message.error("Failed to add product");
    });
  }

  // Table Columns

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      responsive: ["md"] as Breakpoint[], // tampil hanya di layar medium ke atas
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      responsive: ["xs","sm"] as Breakpoint[],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `Rp ${value.toLocaleString()}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
      responsive: ["xs","sm"] as Breakpoint[],
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: Product, b: Product) => a.stock - b.stock,
      responsive: ["xs","sm"] as Breakpoint[],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // Add button danger with radius component to show status , button nya is small
      render: (value: boolean) => (
        <Button type={value ? "primary" : "default"} shape="round" size="small">
          {value ? "Active" : "Inactive"}
        </Button>
      ),
      sorter: (a: Product, b: Product) => (a.status === b.status ? 0 : a.status ? 1 : -1),
      responsive: ["xs","sm"] as Breakpoint[],
    },

    // Create Action Edit and Delete buttons Open Modal
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <div style={{ display: "flex", gap: 8 }}>
          {permission?.products?.update && (
            <Button color="cyan" variant="solid" icon={<EditOutlined />} onClick={() => {
              // Open edit modal
              showModal(record.id);
            }} />
          )}
          {permission?.products?.delete && (
            <Button color="danger" variant="solid" icon={<DeleteOutlined />}  onClick={() => {
            // Open delete confirmation modal
            showDeleteModal(record.id);
          }} />)}
        </div>
      ),
      responsive: ["xs","sm"] as Breakpoint[],
    },
  ];

  return (
    <div>
      <Row>
        <Col span={12} style={{ marginBottom: 16 }}>
          <Title level={3}>Product Management</Title>
          <Text type="secondary">Manage your products effectively</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right", marginBottom: 16 }}>
          {permission?.products?.write && (
            <Button type="primary" onClick={() => {
              showAddModal();
            }}>
              Add New Product
            </Button>
          )}
        </Col>
      </Row>

      <Card title="All Products" style={{ width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="id"
            dataSource={products}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>

      {/* Add Product Modal */}

      <Modal title="Add New Product" open={isAddModalOpen} onCancel={handleCancelAdd} footer={null}>
        {/* Form to add new product (not implemented) */}
        <Form form={formAdd} onFinish={handleAddProduct} layout="vertical">
          <Form.Item name="name" label="Product Name" initialValue="">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="active">
            <Select style={{ width: "100%", marginBottom: 16 }}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancelAdd}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit and Delete Modals */}
      <Modal title="Edit Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
        {/* Form to edit product (not implemented) */}
        <Form form={form} layout="vertical" onFinish={handleUpdate} initialValues={selectedProduct || {}}>
          <Form.Item name="id" label="ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Product Name">
            <Input/>
          </Form.Item>
          {/* Price and stock as InputNumber and one Row Full Layout*/}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stock" label="Stock">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Status as Select Active/Inactive */}
          <Form.Item name="status" label="Status">
            <Select style={{ width: "100%", marginBottom: 16 }}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Delete Product" open={isDeleteModal} onCancel={handleCancelDelete} footer={null}>
        {/* Confirmation to delete product (not implemented) */}
        <Text>Are you sure you want to delete this product?</Text>
        <br />
        <Text type="danger">This action cannot be undone.</Text>
        <br/>
        <Form.Item hidden>
          <Input value={selectedProduct?.id} />
        </Form.Item>
        <Button style={{ marginTop: 7 }} type="primary" danger onClick={handleOkDelete}>Delete</Button>
        {/* Cancel button Margin Left */}
        <Button style={{ marginLeft: 8 }} onClick={handleCancelDelete}>Cancel</Button>
      </Modal>
    </div>
  );
}
