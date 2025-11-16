"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Printer, Search, Download, RefreshCw, FileText, X } from "lucide-react"
import { recentOrders } from "./api/endpoints"
import { printDocument } from "./api/printerAgentapi"
import { getSelectedPrinter } from "../../global"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AnimatedTrashButton from "./TrashButton"
import toast from 'react-hot-toast'
import FileActionsPopup from './pops/FileActionPopUp'

const RecentOrders = ({ selectedPrinter }) => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [autoPrint, setAutoPrint] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null) // { orderId, type: 'view'|'download'|'print' }
  const autoPrintedOrdersRef = useRef(new Set())
  const lastOrderCountRef = useRef(0)
  const hoverTimeoutRef = useRef(null)
  const [displayLimit, setDisplayLimit] = useState(10) // Start with 10 orders
  const [isFetching, setisFetching] = useState(false)

  const {
    data: ordersData,
    isLoading,
    error,
    dataUpdatedAt,
    // isFetching
  } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: async () => {
      const data = await recentOrders()
      if (data && data.orders) {
        return data.orders // Return ALL orders, not just 20
      }
      return []
    },
    refetchInterval: (data) => {
      if (!data || !Array.isArray(data)) return 3000
      if (data.length !== lastOrderCountRef.current) {
        lastOrderCountRef.current = data.length
        return 3000
      }
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

  // Apply display limit to all orders
  const limitedOrders = orders.slice(0, displayLimit)
  const hasMoreOrders = orders.length > displayLimit

  // Load more function
  const handleLoadMore = useCallback(() => {
    setisFetching(true)
    setDisplayLimit(prev => prev + 10)
    toast.success('Loading 10 more orders...', { duration: 1500 })
    setisFetching(false)
  }, [])
  // Parse file URLs and page counts from order (handles both single file and multiple files)
  const getOrderFiles = useCallback((order) => {
    if (!order.file_url) return []

    let files = []
    let pageCounts = {}

    // Parse page counts - try multiple sources
    try {
      // First try: file_pages from API (formatted by serializer)
      if (order.file_pages && typeof order.file_pages === 'object') {
        pageCounts = order.file_pages
      }
      // Second try: pageCounts field
      else if (order.pageCounts) {
        pageCounts = typeof order.pageCounts === 'string'
          ? JSON.parse(order.pageCounts)
          : order.pageCounts
      }
      // Third try: FilePagesCount (raw field)
      else if (order.FilePagesCount) {
        pageCounts = typeof order.FilePagesCount === 'string'
          ? JSON.parse(order.FilePagesCount)
          : order.FilePagesCount
      }
      // Fallback: NoOfPages or no_of_pages for single file
      else if (order.NoOfPages || order.no_of_pages) {
        pageCounts = { default: order.NoOfPages || order.no_of_pages }
      }
    } catch (e) {
      console.warn('Failed to parse page counts:', e)
      // Last resort: use NoOfPages or no_of_pages
      if (order.NoOfPages || order.no_of_pages) {
        pageCounts = { default: order.NoOfPages || order.no_of_pages }
      }
    }

    try {
      // Try to parse as JSON (multiple files)
      const parsed = JSON.parse(order.file_url)
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Convert object to array of {name, url, pages}
        files = Object.entries(parsed).map(([name, url]) => ({
          name,
          url,
          pages: pageCounts[name] || null
        }))
        return files
      }
    } catch (e) {
      // Not JSON, treat as single file URL
    }

    // Single file case
    if (typeof order.file_url === 'string' && order.file_url.startsWith('http')) {
      return [{
        name: `${order.id}_file.pdf`,
        url: order.file_url,
        pages: order.NoOfPages || order.no_of_pages || pageCounts.default || null
      }]
    }

    return []
  }, [])

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
        const files = getOrderFiles(order)
        if (files.length === 0) continue

        // Print first file or all files
        const response = await printDocument(
          files[0].url,
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
  }, [getOrderFiles])

  useEffect(() => {
    if (!autoPrint || orders.length === 0) return
    const pendingOrders = orders.filter(order => order.status === "Pending")
    if (pendingOrders.length > 0) {
      handleAutoPrint(pendingOrders)
    }
  }, [autoPrint, orders, handleAutoPrint])

  const filteredOrders = useMemo(() => {
    return limitedOrders.filter((order) => {
      const matchesSearch =
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [limitedOrders, searchTerm, statusFilter])

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

  const handleViewFile = useCallback((file) => {
    window.open(file.url, '_blank')
  }, [])

  const handleViewAllFiles = useCallback((files) => {
    files.forEach((file, index) => {
      setTimeout(() => {
        window.open(file.url, '_blank')
      }, index * 300)
    })
    toast.success(`Opening ${files.length} file(s)...`, { duration: 2000 })
  }, [])

  const handleDownloadFile = useCallback((file) => {
    const downloadToast = toast.loading(`Downloading ${file.name}...`)

    fetch(file.url)
      .then((res) => {
        if (!res.ok) throw new Error('Download failed')
        return res.blob()
      })
      .then((blob) => {
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = file.name
        link.click()
        window.URL.revokeObjectURL(link.href)
        toast.success('Downloaded successfully!', { id: downloadToast })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Download failed', { id: downloadToast })
      })
  }, [])

  const handleDownloadAllFiles = useCallback(async (files) => {
    toast.loading(`Downloading ${files.length} file(s)...`, { duration: 2000 })

    for (const [index, file] of files.entries()) {
      try {
        await new Promise((resolve) => {
          fetch(file.url)
            .then((res) => res.blob())
            .then((blob) => {
              const link = document.createElement("a")
              link.href = window.URL.createObjectURL(blob)
              link.download = file.name
              link.click()
              window.URL.revokeObjectURL(link.href)
              resolve()
            })
            .catch(resolve)
        })
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (err) {
        console.error(`Error downloading ${file.name}:`, err)
      }
    }

    toast.success(`Downloaded ${files.length} file(s)!`, { duration: 3000 })
  }, [])

  const handlePrintFile = useCallback(async (file, order) => {
    const printerName = getSelectedPrinter()
    if (!printerName) {
      toast.error("⚠️ Please select a printer first.")
      return
    }

    const printingToast = toast.loading(`Printing ${file.name}...`)
    // Update order status to Complete after successful print
    queryClient.setQueryData(['recentOrders'], (oldData) => {
      if (!oldData) return oldData
      return oldData.map(o =>
        o.id === order.id ? { ...o, status: 'Processing' } : o
      )
    })

    try {
      const response = await printDocument(
        file.url,
        order.id,
        printerName,
        order.print_color,
        order.no_of_copies
      )

      if (response && response.message) {
        toast.success(`✅ Printed ${file.name}`, { id: printingToast })
        // Update order status to Complete after successful print
        queryClient.setQueryData(['recentOrders'], (oldData) => {
          if (!oldData) return oldData
          return oldData.map(o =>
            o.id === order.id ? { ...o, status: 'Complete' } : o
          )
        })

        // Wait a moment for backend to update, then invalidate cache
        setTimeout(async () => {
          await queryClient.invalidateQueries(['recentOrders'])
          console.log('✓ Refreshed orders after print')
        }, 500)
      } else {
        toast.error(`❌ Print failed: ${response?.error || 'Unknown error'}`, { id: printingToast })
      }
    } catch (error) {
      toast.error(`❌ Print error: ${error.message}`, { id: printingToast })
    }
  }, [queryClient])

  const handlePrintAllFiles = useCallback(async (files, order) => {
    const printerName = getSelectedPrinter()
    if (!printerName) {
      toast.error("⚠️ Please select a printer first.")
      return
    }

    toast.loading(`Printing ${files.length} file(s)...`, { duration: 2000 })

    let allPrinted = true
    for (const file of files) {
      try {
        const response = await printDocument(
          file.url,
          order.id,
          printerName,
          order.print_color,
          order.no_of_copies
        )
        if (!response || !response.message) {
          allPrinted = false
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error printing ${file.name}:`, error)
        allPrinted = false
      }
    }

    if (allPrinted) {
      toast.success(`✅ Printed ${files.length} file(s)!`, { duration: 3000 })

      // Wait a moment for backend to update, then invalidate cache
      setTimeout(async () => {
        await queryClient.invalidateQueries(['recentOrders'])
        console.log('✓ Refreshed orders after print')
      }, 500)
    } else {
      toast.error(`❌ Some files failed to print`, { duration: 3000 })
    }
  }, [queryClient])

  const handleMouseEnter = useCallback((orderId, type) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAction({ orderId, type })
    }, 300)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAction(null)
    }, 200)
  }, [])

  const cancelMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries(['recentOrders'])
    toast.success('Refreshing orders...', { duration: 1000 })
  }, [queryClient])

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
              <th>Side</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const files = getOrderFiles(order)
                const hasMultipleFiles = files.length > 1

                return (
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
                    <td>single</td>
                    <td>
                      <motion.span className={`${getStatusColor(order.status)} status`}>
                        {order.status}
                      </motion.span>
                    </td>
                    <td className="flex gap-2 recent-orders-actions">
                      {files.length > 0 && (
                        <>
                          {/* View Button */}
                          <div style={{ position: 'relative' }}>
                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={hasMultipleFiles ? `View ${files.length} files` : "View File"}
                              onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'view')}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => !hasMultipleFiles && handleViewFile(files[0])}
                            >
                              <Eye size={16} />
                              {hasMultipleFiles && (
                                <span style={{
                                  position: 'absolute',
                                  top: '-4px',
                                  right: '-4px',
                                  backgroundColor: '#3b82f6',
                                  color: '#fff',
                                  borderRadius: '50%',
                                  width: '16px',
                                  height: '16px',
                                  fontSize: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '600'
                                }}>
                                  {files.length}
                                </span>
                              )}
                            </motion.button>
                            <AnimatePresence>
                              {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'view' && (
                                <FileActionsPopup
                                  files={files}
                                  actionType="view"
                                  onClose={{
                                    trigger: handleMouseLeave,
                                    cancel: cancelMouseLeave
                                  }}
                                  onAction={handleViewFile}
                                  onActionAll={() => handleViewAllFiles(files)}
                                />
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Download Button */}
                          <div style={{ position: 'relative' }}>
                            <motion.button
                              className="btn-icon"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title={hasMultipleFiles ? `Download ${files.length} files` : "Download File"}
                              onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'download')}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => !hasMultipleFiles && handleDownloadFile(files[0])}
                            >
                              <Download size={16} />
                              {hasMultipleFiles && (
                                <span style={{
                                  position: 'absolute',
                                  top: '-4px',
                                  right: '-4px',
                                  backgroundColor: '#10b981',
                                  color: '#fff',
                                  borderRadius: '50%',
                                  width: '16px',
                                  height: '16px',
                                  fontSize: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '600'
                                }}>
                                  {files.length}
                                </span>
                              )}
                            </motion.button>
                            <AnimatePresence>
                              {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'download' && (
                                <FileActionsPopup
                                  files={files}
                                  actionType="download"
                                  onClose={{
                                    trigger: handleMouseLeave,
                                    cancel: cancelMouseLeave
                                  }}
                                  onAction={handleDownloadFile}
                                  onActionAll={() => handleDownloadAllFiles(files)}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      )}

                      {/* Print Button */}
                      <div style={{ position: 'relative' }}>
                        <motion.button
                          className="btn-icon"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={hasMultipleFiles ? `Print ${files.length} files` : "Print Order"}
                          onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'print')}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => !hasMultipleFiles && files.length > 0 && handlePrintFile(files[0], order)}
                        >
                          <Printer size={16} />
                          {hasMultipleFiles && (
                            <span style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '-4px',
                              backgroundColor: '#f59e0b',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '16px',
                              height: '16px',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '600'
                            }}>
                              {files.length}
                            </span>
                          )}
                        </motion.button>
                        <AnimatePresence>
                          {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'print' && (
                            <FileActionsPopup
                              files={files}
                              actionType="print"
                              onClose={{
                                trigger: handleMouseLeave,
                                cancel: cancelMouseLeave
                              }}
                              onAction={(file) => handlePrintFile(file, order)}
                              onActionAll={() => handlePrintAllFiles(files, order)}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      <AnimatedTrashButton
                        title="Delete Order"
                        size={20}
                      />
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>


      {/* Load More Button */}
      {hasMoreOrders && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}
        >
          <motion.button
            onClick={handleLoadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isFetching}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isFetching ? 'not-allowed' : 'pointer',
              opacity: isFetching ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
            className="btn-primary"
          >
            {isFetching ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
                Loading...
              </>
            ) : (
              <>
                <Download size={16} />
                Load More Orders
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  +10
                </span>
              </>
            )}
          </motion.button>

          <div style={{
            marginLeft: '16px',
            fontSize: '13px',
            color: '#64748b'
          }}>
            Showing {displayLimit} of {orders.length} orders
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default RecentOrders