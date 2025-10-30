// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Eye, Printer, MoreHorizontal, Search, Download } from "lucide-react"
// import { recentOrders } from "./api/endpoints"
// import { printDocument } from "./api/printerAgentapi"
// import { getSelectedPrinter } from "../../global"
// import { useQuery } from '@tanstack/react-query'

// const RecentOrders = ({ selectedPrinter }) => {
//   // const [orders, setOrders] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   // const [loading, setLoading] = useState(true)
//   const [autoPrint, setAutoPrint] = useState(false) // ✅ Auto Print toggle
//   const [autoPrintedOrders, setAutoPrintedOrders] = useState([]) // track printed orders

//   // ✅ Fetch recent orders
//   // useEffect(() => {
//   //   const fetchRecentOrders = async () => {
//   //     try {
//   //       const data = await recentOrders()
//   //       if (data && data.orders) {
//   //         setOrders(data.orders.slice(0, 10))
//   //       } else {
//   //         setOrders([])
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching recent orders:", err)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }
//   //   fetchRecentOrders()
//   // }, [])



//   // ✅ Fetch recent orders with auto-refresh (no extra state needed)
//   const { data: orders = [], isLoading, error } = useQuery({
//     queryKey: ['recentOrders'],
//     queryFn: async () => {
//       const data = await recentOrders()
//       if (data && data.orders) {
//         return data.orders.slice(0, 10)
//       }
//       return []
//     },
//     refetchInterval: 3000, // Auto-refresh every 3 seconds
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     onError: (err) => {
//       console.error("Error fetching recent orders:", err)
//     }
//   })

//   // Now use:
//   // - orders (instead of state)
//   // - isLoading (instead of loading state)
//   // - error (for error handling)

//   if (isLoading) return <p>Loading recent orders...</p>
//   if (error) return <p>Error fetching recent orders.</p>

//   // ✅ Auto Print effect
//   useEffect(() => {
//     if (autoPrint) {
//       const printerName = getSelectedPrinter()
//       if (!printerName) {
//         alert("⚠️ Please select a printer first.")
//         setAutoPrint(false)
//         return
//       }
//       console.log("these are oreder : ", orders)

//       // Filter first 5 pending orders that have not been auto-printed yet
//       const pendingOrders = orders
//         .filter((order) => order.status === "pending" && !autoPrintedOrders.includes(order.id))
//         .slice(0, 5)

//       pendingOrders.forEach(async (order) => {
//         try {
//           const response = await printDocument(order.file_url, order.id, printerName, order.print_color, order.no_of_copies)
//           if (response.message) {
//             console.log(`✅ Auto Printed: Order ID ${order.id}`)
//             setAutoPrintedOrders((prev) => [...prev, order.id])
//           } else {
//             console.error(`❌ Auto Print failed: Order ID ${order.id}`)
//           }
//         } catch (err) {
//           console.error("Error auto printing order:", err)
//         }
//       })
//     }
//   }, [autoPrint, orders, autoPrintedOrders])

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || order.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status) => {
//     // console.log("Getting color for status:", status)
//     switch (status) {
//       case "Complete": return "text-success"
//       case "Processing": return "text-warning"
//       case "Pending": return "text-danger"
//       case "Cancelled": return "text-light bg-dark"
//       default: return "text-dark"
//     }
//   }

//   const getPaymentStatusColor = (status) => {
//     // console.log("Getting color for payment status:", status)
//     switch (status) {
//       case true: return "text-success"
//       case "Pending": return "text-warning"
//       case "Failed": return "text-danger"
//       default: return "text-dark"
//     }
//   }

//   const handlePrint = async (fileUrl, order_id, printColor, no_of_copies) => {
//     const printerName = getSelectedPrinter()
//     if (!printerName) {
//       alert("⚠️ Please select a printer first.")
//       return
//     }
//     const response = await printDocument(fileUrl, order_id, printerName, printColor, no_of_copies)
//     if (response.message) {
//       alert(`✅ Printed successfully on ${printerName}, Order ID: ${order_id}`)
//     } else {
//       alert(`❌ Print failed: ${response.error}`)
//     }
//   }

//   const downloadFile = (url, filename) => {
//     fetch(url)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const link = document.createElement("a")
//         link.href = window.URL.createObjectURL(blob)
//         link.download = filename
//         link.click()
//       })
//       .catch((err) => console.error(err))
//   }

//   if (loading) return <p>Loading recent orders...</p>

//   return (
//     <motion.div
//       className="recent-orders"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="section-header flex justify-between items-center">
//         <div>
//           <h3>Recent Orders</h3>
//         </div>
//         <p>{filteredOrders.length} orders found</p>
//         <div>
//           <label className="switch">
//             <input type="checkbox" checked={autoPrint} onChange={(e) => setAutoPrint(e.target.checked)} />
//             <span className="slider round"></span>
//           </label>
//           <span style={{ marginLeft: "8px" }}>Auto Print First 5 Pending</span>
//         </div>
//         <div className="flex items-center gap-4">
//           {/* Auto Print Switch */}
//           {/* <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={autoPrint}
//               onChange={(e) => setAutoPrint(e.target.checked)}
//             />
//             <span>Auto Print First 5 Pending</span>
//           </label> */}

//           <div className="orders-actions flex items-center gap-2">
//             <div className="search-box">
//               <Search size={16} />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="status-filter"
//             >
//               <option value="all">All Status</option>
//               <option value="completed">Completed</option>
//               <option value="processing">Processing</option>
//               <option value="pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {filteredOrders.map((order, index) => (
//                 <motion.tr
//                   key={order.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
//                 >
//                   <td className="order-id">{order.id}</td>
//                   <td className="order-customer">{order.customer}</td>
//                   <td className="order-date">{order.date}</td>
//                   <td className={`${getPaymentStatusColor(order.payment_status)}`}>{order.amount}</td>
//                   <td>
//                     <motion.span className={`${getStatusColor(order.status)} status`}>
//                       {order.status}
//                     </motion.span>
//                   </td>
//                   <td className="flex gap-2">
//                     {order.file_url && (
//                       <motion.a
//                         href={order.file_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn-icon"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         title="View File"
//                       >
//                         <Eye size={16} />
//                       </motion.a>
//                     )}

//                     {order.file_url && (
//                       <motion.button
//                         className="btn-icon"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => downloadFile(order.file_url, "file.pdf")}
//                         title="Download File"
//                       >
//                         <Download size={16} />
//                       </motion.button>
//                     )}

//                     <motion.button
//                       className="btn-icon"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="Print Order"
//                       onClick={() => handlePrint(order.file_url, order.id, order.print_color, order.no_of_copies)}
//                     >
//                       <Printer size={16} />
//                     </motion.button>

//                     <motion.button
//                       className="btn-icon"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="More Actions"
//                     >
//                       <MoreHorizontal size={16} />
//                     </motion.button>
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   )
// }

// export default RecentOrders




// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Eye, Printer, MoreHorizontal, Search, Download, Trash2 } from "lucide-react"
// import { recentOrders } from "./api/endpoints"
// import { printDocument } from "./api/printerAgentapi"
// import { getSelectedPrinter } from "../../global"
// import { useQuery } from '@tanstack/react-query'
// import AnimatedTrashButton from "./TrashButton"

// const RecentOrders = ({ selectedPrinter }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [autoPrint, setAutoPrint] = useState(false)
//   const [autoPrintedOrders, setAutoPrintedOrders] = useState([])

//   // ✅ Fetch recent orders with auto-refresh
//   const { data: orders = [], isLoading, error } = useQuery({
//     queryKey: ['recentOrders'],
//     queryFn: async () => {
//       const data = await recentOrders()
//       if (data && data.orders) {
//         return data.orders.slice(0, 15)
//       }
//       return []
//     },
//     refetchInterval: 3000,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     onError: (err) => {
//       console.error("Error fetching recent orders:", err)
//     }
//   })

//   // ✅ Auto Print effect
//   useEffect(() => {
//     if (autoPrint) {
//       const printerName = getSelectedPrinter()
//       if (!printerName) {
//         alert("⚠️ Please select a printer first.")
//         setAutoPrint(false)
//         return
//       }
//       console.log("these are oreder : ", orders)

//       const pendingOrders = orders
//         .filter((order) => order.status === "Pending" && !autoPrintedOrders.includes(order.id))
//         .slice(0, 5)

//       pendingOrders.forEach(async (order) => {
//         try {
//           const response = await printDocument(order.file_url, order.id, printerName, order.print_color, order.no_of_copies)
//           if (response.message) {
//             console.log(`✅ Auto Printed: Order ID ${order.id}`)
//             setAutoPrintedOrders((prev) => [...prev, order.id])
//           } else {
//             console.error(`❌ Auto Print failed: Order ID ${order.id}`)
//           }
//         } catch (err) {
//           console.error("Error auto printing order:", err)
//         }
//       })
//     }
//   }, [autoPrint, orders, autoPrintedOrders])

//   // ✅ NOW check loading/error AFTER all hooks
//   if (isLoading) return <p>Loading recent orders...</p>
//   if (error) return <p>Error fetching recent orders.</p>

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || order.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Complete": return "text-success"
//       case "Processing": return "text-warning"
//       case "Pending": return "text-danger"
//       case "Cancelled": return "text-light bg-dark"
//       default: return "text-dark"
//     }
//   }

//   const getPaymentStatusColor = (status) => {
//     switch (status) {
//       case true: return "text-success"
//       case "Pending": return "text-warning"
//       case "Failed": return "text-danger"
//       default: return "text-dark"
//     }
//   }

//   const handlePrint = async (fileUrl, order_id, printColor, no_of_copies) => {
//     const printerName = getSelectedPrinter()
//     if (!printerName) {
//       alert("⚠️ Please select a printer first.")
//       return
//     }
//     const response = await printDocument(fileUrl, order_id, printerName, printColor, no_of_copies)
//     if (response.message) {
//       alert(`✅ Printed successfully on ${printerName}, Order ID: ${order_id}`)
//     } else {
//       alert(`❌ Print failed: ${response.error}`)
//     }
//   }

//   const downloadFile = (url, filename) => {
//     fetch(url)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const link = document.createElement("a")
//         link.href = window.URL.createObjectURL(blob)
//         link.download = filename
//         link.click()
//       })
//       .catch((err) => console.error(err))
//   }

//   return (
//     <motion.div
//       className="recent-orders"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="section-header flex justify-between items-center">
//         <div>
//           <h3>Recent Orders</h3>
//         </div>
//         <p>{filteredOrders.length} orders found</p>
//         <div>
//           <label className="switch">
//             <input type="checkbox" disabled checked={autoPrint} onChange={(e) => setAutoPrint(e.target.checked)} />
//             <span className="slider round"></span>
//           </label>
//           <span style={{ marginLeft: "8px" }}>Auto Print First 5 Pending</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="orders-actions flex items-center gap-2">
//             <div className="search-box">
//               <Search size={16} />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="status-filter"
//             >
//               <option value="all">All Status</option>
//               <option value="Complete">Completed</option>
//               <option value="Processing">Processing</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {filteredOrders.map((order, index) => (
//                 <motion.tr
//                   key={order.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
//                 >
//                   <td className="order-id">{order.id}</td>
//                   <td className="order-customer">{order.customer}</td>
//                   <td className="order-date">{order.date}</td>
//                   <td className={`${getPaymentStatusColor(order.payment_status)}`}>{order.amount}</td>
//                   <td>
//                     <motion.span className={`${getStatusColor(order.status)} status`}>
//                       {order.status}
//                     </motion.span>
//                   </td>
//                   <td className="flex gap-2 recent-orders-actions">
//                     {order.file_url && (
//                       <motion.a
//                         href={order.file_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn-icon"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         title="View File"
//                       >
//                         <Eye size={16} />
//                       </motion.a>
//                     )}

//                     {order.file_url && (
//                       <motion.button
//                         className="btn-icon"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => downloadFile(order.file_url, "file.pdf")}
//                         title="Download File"
//                       >
//                         <Download size={16} />
//                       </motion.button>
//                     )}

//                     <motion.button
//                       className="btn-icon"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="Print Order"
//                       onClick={() => handlePrint(order.file_url, order.id, order.print_color, order.no_of_copies)}
//                     >
//                       <Printer size={16} />
//                     </motion.button>

//                     {/* <motion.button
//                       className="btn-icon btn-icon-trash"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       title="More Actions"
//                     >
//                       <Trash2 size={16} />
//                     </motion.button> */}
//                     <AnimatedTrashButton
//                       // onClick={() => deleteItem(id)}
//                       title="Delete Order"
//                       size={20}
//                       // disabled={!canDelete}
//                     />
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   )
// }

// export default RecentOrders

"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Printer, Search, Download, RefreshCw } from "lucide-react"
import { recentOrders } from "./api/endpoints"
import { printDocument } from "./api/printerAgentapi"
import { getSelectedPrinter } from "../../global"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AnimatedTrashButton from "./TrashButton"
import toast from 'react-hot-toast'

const RecentOrders = ({ selectedPrinter }) => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [autoPrint, setAutoPrint] = useState(false)
  const autoPrintedOrdersRef = useRef(new Set())
  const lastOrderCountRef = useRef(0)

  // ✅ Fixed: Smart polling with proper null checks
  const {
    data: ordersData,
    isLoading,
    error,
    dataUpdatedAt,
    isFetching
  } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: async () => {
      const data = await recentOrders()
      if (data && data.orders) {
        return data.orders.slice(0, 15)
      }
      return []
    },
    // ✅ Fixed: Proper null/undefined handling in refetchInterval
    refetchInterval: (data) => {
      // If no data yet, poll at 3 seconds
      if (!data || !Array.isArray(data)) return 3000

      // If new orders detected, poll fast
      if (data.length !== lastOrderCountRef.current) {
        lastOrderCountRef.current = data.length
        return 3000
      }

      // Otherwise, slow down to 10 seconds
      return 10000
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 2000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (err) => {
      console.error("Error fetching recent orders:", err)
      toast.error('Failed to fetch orders', { duration: 3000 })
    }
  })

  const orders = ordersData || []

  // ✅ Optimized auto-print
  const handleAutoPrint = useCallback(async (pendingOrders) => {
    const printerName = getSelectedPrinter()
    if (!printerName) {
      toast.error("⚠️ Please select a printer first.")
      setAutoPrint(false)
      return
    }

    const ordersToPrint = pendingOrders
      .filter(order => !autoPrintedOrdersRef.current.has(order.id))
      .slice(0, 5)

    if (ordersToPrint.length === 0) return

    for (const order of ordersToPrint) {
      try {
        const response = await printDocument(
          order.file_url,
          order.id,
          printerName,
          order.print_color,
          order.no_of_copies
        )

        if (response && response.message) {
          autoPrintedOrdersRef.current.add(order.id)
          toast.success(`Printed order ${order.id}`, {
            duration: 2000,
            position: 'bottom-right'
          })
        }
      } catch (err) {
        console.error("Error auto printing order:", err)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }, [])

  useEffect(() => {
    if (!autoPrint || orders.length === 0) return
    const pendingOrders = orders.filter(order => order.status === "Pending")
    if (pendingOrders.length > 0) {
      handleAutoPrint(pendingOrders)
    }
  }, [autoPrint, orders, handleAutoPrint])

  // ✅ Memoized filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Complete": return "text-success"
      case "Processing": return "text-warning"
      case "Pending": return "text-danger"
      case "Cancelled": return "text-light bg-dark"
      default: return "text-dark"
    }
  }, [])

  const getPaymentStatusColor = useCallback((status) => {
    if (status === true) return "text-success"
    if (status === "Pending") return "text-warning"
    if (status === "Failed") return "text-danger"
    return "text-dark"
  }, [])

  const handlePrint = useCallback(async (fileUrl, order_id, printColor, no_of_copies) => {
    const printerName = getSelectedPrinter()
    if (!printerName) {
      toast.error("⚠️ Please select a printer first.")
      return
    }

    const printingToast = toast.loading(`Printing order ${order_id}...`)

    try {
      const response = await printDocument(fileUrl, order_id, printerName, printColor, no_of_copies)

      if (response && response.message) {
        toast.success(`✅ Printed successfully on ${printerName}`, {
          id: printingToast
        })
      } else {
        toast.error(`❌ Print failed: ${response?.error || 'Unknown error'}`, {
          id: printingToast
        })
      }
    } catch (error) {
      toast.error(`❌ Print error: ${error.message}`, {
        id: printingToast
      })
    }
  }, [])

  const downloadFile = useCallback((url, filename) => {
    const downloadToast = toast.loading('Downloading file...')

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Download failed')
        return res.blob()
      })
      .then((blob) => {
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(link.href)
        toast.success('Downloaded successfully!', { id: downloadToast })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Download failed', { id: downloadToast })
      })
  }, [])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries(['recentOrders'])
    toast.success('Refreshing orders...', { duration: 1000 })
  }, [queryClient])

  // ✅ Show loading only on initial load
  if (isLoading && orders.length === 0) {
    return (
      <motion.div
        className="recent-orders"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Loading recent orders...</p>
      </motion.div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <motion.div className="recent-orders-error">
        <p>Error fetching recent orders.</p>
        <button onClick={handleRefresh} className="btn-retry">
          Retry
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="recent-orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header flex justify-between items-center">
        <div>
          <h3>Recent Orders</h3>
        </div>

        <p>{filteredOrders.length} orders found</p>

        <div className="flex items-center gap-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={autoPrint}
              onChange={(e) => {
                setAutoPrint(e.target.checked)
                if (!e.target.checked) {
                  autoPrintedOrdersRef.current.clear()
                }
              }}
            />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: "8px" }}>Auto Print First 5 Pending</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="orders-actions flex items-center gap-2">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="Complete">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
                >
                  <td className="order-id">{order.id}</td>
                  <td className="order-customer">{order.customer}</td>
                  <td className="order-date">{order.date}</td>
                  <td className={getPaymentStatusColor(order.payment_status)}>
                    {order.amount}
                  </td>
                  <td>
                    <motion.span className={`${getStatusColor(order.status)} status`}>
                      {order.status}
                    </motion.span>
                  </td>
                  <td className="flex gap-2 recent-orders-actions">
                    {order.file_url && (
                      <>
                        <motion.a
                          href={order.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View File"
                        >
                          <Eye size={16} />
                        </motion.a>

                        <motion.button
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => downloadFile(order.file_url, "file.pdf")}
                          title="Download File"
                        >
                          <Download size={16} />
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      className="btn-icon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Print Order"
                      onClick={() => handlePrint(
                        order.file_url,
                        order.id,
                        order.print_color,
                        order.no_of_copies
                      )}
                    >
                      <Printer size={16} />
                    </motion.button>

                    <AnimatedTrashButton
                      title="Delete Order"
                      size={20}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default RecentOrders