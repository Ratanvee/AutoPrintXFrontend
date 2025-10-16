"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, Filter, Download, MoreHorizontal } from "lucide-react"

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      orders: 12,
      totalSpent: "$1,245.00",
      joinDate: "Jan 15, 2024",
      status: "active",
      lastOrder: "2 days ago",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      orders: 8,
      totalSpent: "$892.50",
      joinDate: "Feb 20, 2024",
      status: "active",
      lastOrder: "1 week ago",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      orders: 15,
      totalSpent: "$2,156.75",
      joinDate: "Dec 10, 2023",
      status: "vip",
      lastOrder: "3 days ago",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890",
      location: "Houston, TX",
      orders: 5,
      totalSpent: "$425.00",
      joinDate: "Mar 5, 2024",
      status: "active",
      lastOrder: "2 weeks ago",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "+1 (555) 567-8901",
      location: "Phoenix, AZ",
      orders: 3,
      totalSpent: "$189.75",
      joinDate: "Apr 12, 2024",
      status: "inactive",
      lastOrder: "1 month ago",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "vip":
        return "warning"
      case "inactive":
        return "danger"
      default:
        return "secondary"
    }
  }

  return (
    <motion.div
      className="customers-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Customer Management</h1>
          <p>Manage customer relationships and data</p>
        </div>
        <div className="header-actions">
          <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Download size={16} />
            Export
          </motion.button>
          <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Plus size={16} />
            Add Customer
          </motion.button>
        </div>
      </div>

      {/* Customer Stats */}
      <motion.div
        className="customer-stats"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-number">{customers.length}</p>
          <span className="stat-change positive">+12% this month</span>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p className="stat-number">{customers.filter((c) => c.status === "active").length}</p>
          <span className="stat-change positive">+8% this month</span>
        </div>
        <div className="stat-card">
          <h3>VIP Customers</h3>
          <p className="stat-number">{customers.filter((c) => c.status === "vip").length}</p>
          <span className="stat-change positive">+2 new VIPs</span>
        </div>
        <div className="stat-card">
          <h3>Average Orders</h3>
          <p className="stat-number">
            {Math.round(customers.reduce((acc, c) => acc + c.orders, 0) / customers.length)}
          </p>
          <span className="stat-change positive">+15% this month</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="filters-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="vip">VIP</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="btn-icon">
          <Filter size={16} />
        </button>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        className="customers-table-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="table-header">
          <h3>Customers ({filteredCustomers.length})</h3>
          <div className="table-actions">
            <button className="btn-icon">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
                  >
                    <td>
                      <div className="customer-info">
                        <img
                          src={`https://placehold.co/40x40/0a2463/white?text=${customer.name.charAt(0)}`}
                          alt={customer.name}
                          className="customer-avatar"
                        />
                        <div>
                          <p className="customer-name">{customer.name}</p>
                          <span className="join-date">Joined {customer.joinDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <Mail size={14} />
                          <span>{customer.email}</span>
                        </div>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <MapPin size={14} />
                        <span>{customer.location}</span>
                      </div>
                    </td>
                    <td className="orders-count">{customer.orders}</td>
                    <td className="amount">{customer.totalSpent}</td>
                    <td>
                      <span className={`status ${getStatusColor(customer.status)}`}>{customer.status}</span>
                    </td>
                    <td>{customer.lastOrder}</td>
                    <td>
                      <div className="action-buttons">
                        <motion.button
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Customer"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Customer"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </motion.button>
                        <motion.button
                          className="btn-icon danger"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Customer"
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
      </motion.div>
    </motion.div>
  )
}

export default CustomersManagement
