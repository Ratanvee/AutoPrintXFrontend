"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  Filter,
  Grid,
  List,
  MoreHorizontal,
} from "lucide-react"

const ProductsManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Standard Black & White Printing",
      category: "Printing",
      price: "$0.10",
      cost: "$0.05",
      stock: "Unlimited",
      sales: 1250,
      revenue: "$125.00",
      status: "active",
      image: "https://placehold.co/60x60/0a2463/white?text=BW",
    },
    {
      id: 2,
      name: "Color Printing Premium",
      category: "Printing",
      price: "$0.25",
      cost: "$0.15",
      stock: "Unlimited",
      sales: 890,
      revenue: "$222.50",
      status: "active",
      image: "https://placehold.co/60x60/2176ff/white?text=CP",
    },
    {
      id: 3,
      name: "Spiral Binding Service",
      category: "Binding",
      price: "$3.50",
      cost: "$1.50",
      stock: "Available",
      sales: 156,
      revenue: "$546.00",
      status: "active",
      image: "https://placehold.co/60x60/3e92cc/white?text=SB",
    },
    {
      id: 4,
      name: "Hardcover Binding",
      category: "Binding",
      price: "$8.00",
      cost: "$4.00",
      stock: "Limited",
      sales: 45,
      revenue: "$360.00",
      status: "active",
      image: "https://placehold.co/60x60/0a2463/white?text=HB",
    },
    {
      id: 5,
      name: "Express Delivery",
      category: "Service",
      price: "$5.00",
      cost: "$2.50",
      stock: "Available",
      sales: 234,
      revenue: "$1,170.00",
      status: "active",
      image: "https://placehold.co/60x60/2176ff/white?text=ED",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list") // 'list' or 'grid'

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "danger"
      case "draft":
        return "warning"
      default:
        return "secondary"
    }
  }

  return (
    <motion.div
      className="products-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Products Management</h1>
          <p>Manage your services and pricing</p>
        </div>
        <div className="header-actions">
          <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Package size={16} />
            Import
          </motion.button>
          <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Plus size={16} />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Product Stats */}
      <motion.div
        className="product-stats"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-number">{products.length}</p>
            <span className="stat-change positive">+2 this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">$2,423.50</p>
            <span className="stat-change positive">+18% this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Best Seller</h3>
            <p className="stat-number">B&W Printing</p>
            <span className="stat-change positive">1,250 sales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Products</h3>
            <p className="stat-number">{products.filter((p) => p.status === "active").length}</p>
            <span className="stat-change neutral">All active</span>
          </div>
        </div>
      </motion.div>

      {/* Filters and View Toggle */}
      <motion.div
        className="filters-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-select">
          <option value="all">All Categories</option>
          <option value="Printing">Printing</option>
          <option value="Binding">Binding</option>
          <option value="Service">Service</option>
        </select>

        <div className="view-toggle">
          <button className={`btn-icon ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
            <List size={16} />
          </button>
          <button className={`btn-icon ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
            <Grid size={16} />
          </button>
        </div>
      </motion.div>

      {/* Products Display */}
      <motion.div
        className={`products-container ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === "list" ? (
          <div className="products-table-container">
            <div className="table-header">
              <h3>Products ({filteredProducts.length})</h3>
              <div className="table-actions">
                <button className="btn-icon">
                  <Filter size={16} />
                </button>
                <button className="btn-icon">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
                      >
                        <td>
                          <div className="product-info">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="product-image"
                            />
                            <span className="product-name">{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td className="price">{product.price}</td>
                        <td className="cost">{product.cost}</td>
                        <td>{product.stock}</td>
                        <td>{product.sales}</td>
                        <td className="revenue">{product.revenue}</td>
                        <td>
                          <span className={`status ${getStatusColor(product.status)}`}>{product.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Product"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              className="btn-icon danger"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="product-image-container">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <span className={`status ${getStatusColor(product.status)}`}>{product.status}</span>
                  </div>
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <div className="product-pricing">
                      <span className="price">{product.price}</span>
                      <span className="cost">Cost: {product.cost}</span>
                    </div>
                    <div className="product-stats">
                      <div className="stat">
                        <span className="label">Sales:</span>
                        <span className="value">{product.sales}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Revenue:</span>
                        <span className="value">{product.revenue}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Eye size={16} />
                      </motion.button>
                      <motion.button className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Edit size={16} />
                      </motion.button>
                      <motion.button className="btn-icon danger" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ProductsManagement
