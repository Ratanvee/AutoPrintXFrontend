// "use client"

// import { useState, useEffect, useMemo, useCallback, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Eye, Printer, Search, Download, RefreshCw, FileText, X } from "lucide-react"
// import { recentOrders } from "./api/endpoints"
// import { printDocument } from "./api/printerAgentapi"
// import { getSelectedPrinter } from "../../global"
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import AnimatedTrashButton from "./TrashButton"
// import toast from 'react-hot-toast'
// import FileActionsPopup from './pops/FileActionPopUp'

// const RecentOrders = ({ selectedPrinter }) => {
//   const queryClient = useQueryClient()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [autoPrint, setAutoPrint] = useState(false)
//   const [hoveredAction, setHoveredAction] = useState(null) // { orderId, type: 'view'|'download'|'print' }
//   const autoPrintedOrdersRef = useRef(new Set())
//   const lastOrderCountRef = useRef(0)
//   const hoverTimeoutRef = useRef(null)
//   const [displayLimit, setDisplayLimit] = useState(10) // Start with 10 orders
//   const [isFetching, setisFetching] = useState(false)

//   const {
//     data: ordersData,
//     isLoading,
//     error,
//     dataUpdatedAt,
//     // isFetching
//   } = useQuery({
//     queryKey: ['recentOrders'],
//     queryFn: async () => {
//       const data = await recentOrders()
//       if (data && data.orders) {
//         return data.orders // Return ALL orders, not just 20
//       }
//       return []
//     },
//     refetchInterval: (data) => {
//       if (!data || !Array.isArray(data)) return 3000
//       if (data.length !== lastOrderCountRef.current) {
//         lastOrderCountRef.current = data.length
//         return 3000
//       }
//       return 10000
//     },
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//     staleTime: 2000,
//     retry: 2,
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
//     onError: (err) => {
//       console.error("Error fetching recent orders:", err)
//       toast.error('Failed to fetch orders', { duration: 3000 })
//     }
//   })

//   const orders = ordersData || []

//   // Apply display limit to all orders
//   const limitedOrders = orders.slice(0, displayLimit)
//   const hasMoreOrders = orders.length > displayLimit

//   // Load more function
//   const handleLoadMore = useCallback(() => {
//     setisFetching(true)
//     setDisplayLimit(prev => prev + 10)
//     toast.success('Loading 10 more orders...', { duration: 1500 })
//     setisFetching(false)
//   }, [])
//   // Parse file URLs and page counts from order (handles both single file and multiple files)
//   const getOrderFiles = useCallback((order) => {
//     if (!order.file_url) return []

//     let files = []
//     let pageCounts = {}

//     // Parse page counts - try multiple sources
//     try {
//       // First try: file_pages from API (formatted by serializer)
//       if (order.file_pages && typeof order.file_pages === 'object') {
//         pageCounts = order.file_pages
//       }
//       // Second try: pageCounts field
//       else if (order.pageCounts) {
//         pageCounts = typeof order.pageCounts === 'string'
//           ? JSON.parse(order.pageCounts)
//           : order.pageCounts
//       }
//       // Third try: FilePagesCount (raw field)
//       else if (order.FilePagesCount) {
//         pageCounts = typeof order.FilePagesCount === 'string'
//           ? JSON.parse(order.FilePagesCount)
//           : order.FilePagesCount
//       }
//       // Fallback: NoOfPages or no_of_pages for single file
//       else if (order.NoOfPages || order.no_of_pages) {
//         pageCounts = { default: order.NoOfPages || order.no_of_pages }
//       }
//     } catch (e) {
//       console.warn('Failed to parse page counts:', e)
//       // Last resort: use NoOfPages or no_of_pages
//       if (order.NoOfPages || order.no_of_pages) {
//         pageCounts = { default: order.NoOfPages || order.no_of_pages }
//       }
//     }

//     try {
//       // Try to parse as JSON (multiple files)
//       const parsed = JSON.parse(order.file_url)
//       if (typeof parsed === 'object' && !Array.isArray(parsed)) {
//         // Convert object to array of {name, url, pages}
//         files = Object.entries(parsed).map(([name, url]) => ({
//           name,
//           url,
//           pages: pageCounts[name] || null
//         }))
//         return files
//       }
//     } catch (e) {
//       // Not JSON, treat as single file URL
//     }

//     // Single file case
//     if (typeof order.file_url === 'string' && order.file_url.startsWith('http')) {
//       return [{
//         name: `${order.id}_file.pdf`,
//         url: order.file_url,
//         pages: order.NoOfPages || order.no_of_pages || pageCounts.default || null
//       }]
//     }

//     return []
//   }, [])

//   const handleAutoPrint = useCallback(async (pendingOrders) => {
//     const printerName = getSelectedPrinter()
//     if (!printerName) {
//       toast.error("⚠️ Please select a printer first.")
//       setAutoPrint(false)
//       return
//     }

//     const ordersToPrint = pendingOrders
//       .filter(order => !autoPrintedOrdersRef.current.has(order.id))
//       .slice(0, 5)

//     if (ordersToPrint.length === 0) return

//     for (const order of ordersToPrint) {
//       try {
//         const files = getOrderFiles(order)
//         if (files.length === 0) continue

//         // Print first file or all files
//         const response = await printDocument(
//           files[0].url,
//           order.id,
//           printerName,
//           order.print_color,
//           order.no_of_copies
//         )

//         if (response && response.message) {
//           autoPrintedOrdersRef.current.add(order.id)
//           toast.success(`Printed order ${order.id}`, {
//             duration: 2000,
//             position: 'bottom-right'
//           })
//         }
//       } catch (err) {
//         console.error("Error auto printing order:", err)
//       }

//       await new Promise(resolve => setTimeout(resolve, 1000))
//     }
//   }, [getOrderFiles])

//   useEffect(() => {
//     if (!autoPrint || orders.length === 0) return
//     const pendingOrders = orders.filter(order => order.status === "Pending")
//     if (pendingOrders.length > 0) {
//       handleAutoPrint(pendingOrders)
//     }
//   }, [autoPrint, orders, handleAutoPrint])

//   const filteredOrders = useMemo(() => {
//     return limitedOrders.filter((order) => {
//       const matchesSearch =
//         order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.id?.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesStatus = statusFilter === "all" || order.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [limitedOrders, searchTerm, statusFilter])

//   const getStatusColor = useCallback((status) => {
//     switch (status) {
//       case "Complete": return "text-success"
//       case "Processing": return "text-warning"
//       case "Downloading": return "text-primary"
//       case "Pending": return "text-danger"
//       case "Cancelled": return "text-light bg-dark"
//       default: return "text-dark"
//     }
//   }, [])

//   const getPaymentStatusColor = useCallback((status) => {
//     if (status === true) return "text-success"
//     if (status === "Pending") return "text-warning"
//     if (status === "Failed") return "text-danger"
//     return "text-dark"
//   }, [])

//   const handleViewFile = useCallback((file) => {
//     window.open(file.url, '_blank')
//   }, [])

//   const handleViewAllFiles = useCallback((files) => {
//     files.forEach((file, index) => {
//       setTimeout(() => {
//         window.open(file.url, '_blank')
//       }, index * 300)
//     })
//     toast.success(`Opening ${files.length} file(s)...`, { duration: 2000 })
//   }, [])

//   const handleDownloadFile = useCallback((file) => {
//     const downloadToast = toast.loading(`Downloading ${file.name}...`)

//     fetch(file.url)
//       .then((res) => {
//         if (!res.ok) throw new Error('Download failed')
//         return res.blob()
//       })
//       .then((blob) => {
//         const link = document.createElement("a")
//         link.href = window.URL.createObjectURL(blob)
//         link.download = file.name
//         link.click()
//         window.URL.revokeObjectURL(link.href)
//         toast.success('Downloaded successfully!', { id: downloadToast })
//       })
//       .catch((err) => {
//         console.error(err)
//         toast.error('Download failed', { id: downloadToast })
//       })
//   }, [])

//   const handleDownloadAllFiles = useCallback(async (files) => {
//     toast.loading(`Downloading ${files.length} file(s)...`, { duration: 2000 })

//     for (const [index, file] of files.entries()) {
//       try {
//         await new Promise((resolve) => {
//           fetch(file.url)
//             .then((res) => res.blob())
//             .then((blob) => {
//               const link = document.createElement("a")
//               link.href = window.URL.createObjectURL(blob)
//               link.download = file.name
//               link.click()
//               window.URL.revokeObjectURL(link.href)
//               resolve()
//             })
//             .catch(resolve)
//         })
//         await new Promise(resolve => setTimeout(resolve, 500))
//       } catch (err) {
//         console.error(`Error downloading ${file.name}:`, err)
//       }
//     }

//     toast.success(`Downloaded ${files.length} file(s)!`, { duration: 3000 })
//   }, [])

//   // const handlePrintFile = useCallback(async (file, order) => {
//   //   const printerName = getSelectedPrinter()
//   //   if (!printerName) {
//   //     toast.error("⚠️ Please select a printer first.")
//   //     return
//   //   }

//   //   const printingToast = toast.loading(`Printing ${file.name}...`)
//   //   // Update order status to Complete after successful print
//   //   queryClient.setQueryData(['recentOrders'], (oldData) => {
//   //     if (!oldData) return oldData
//   //     return oldData.map(o =>
//   //       o.id === order.id ? { ...o, status: 'Processing' } : o
//   //     )
//   //   })

//   //   try {
//   //     const response = await printDocument(
//   //       file.url,
//   //       order.id,
//   //       printerName,
//   //       order.print_color,
//   //       order.no_of_copies
//   //     )

//   //     if (response && response.message) {
//   //       toast.success(`✅ Printed ${file.name}`, { id: printingToast })
//   //       // Update order status to Complete after successful print
//   //       queryClient.setQueryData(['recentOrders'], (oldData) => {
//   //         if (!oldData) return oldData
//   //         return oldData.map(o =>
//   //           o.id === order.id ? { ...o } : o
//   //         )
//   //       })

//   //       // Wait a moment for backend to update, then invalidate cache
//   //       setTimeout(async () => {
//   //         await queryClient.invalidateQueries(['recentOrders'])
//   //         console.log('✓ Refreshed orders after print')
//   //       }, 500)
//   //     } else {
//   //       toast.error(`❌ Print failed: ${response?.error || 'Unknown error'}`, { id: printingToast })
//   //     }
//   //   } catch (error) {
//   //     toast.error(`❌ Print error: ${error.message}`, { id: printingToast })
//   //   }
//   // }, [queryClient])\

//   // ── Helper: Load printer job-routing settings from localStorage ──
//   const getPrinterSettings = () => {
//     try {
//       const raw = localStorage.getItem("printerJobRouting")
//       return raw ? JSON.parse(raw) : null
//     } catch {
//       return null
//     }
//   }

//   // ── Helper: Pick the right printer based on order specs ──
//   const resolveTargetPrinter = (order, files) => {
//     const settings = getPrinterSettings()
//     if (!settings) return { printer: null, reason: "no_settings" }

//     const isColor = order.print_color?.toLowerCase() === "color"
//     const totalPages = order.no_of_pages || 0
//     const totalFiles = files?.length || 1
//     const isUrgent = order.is_urgent === true || order.priority === "urgent"
//     const isBulk = totalFiles > 3

//     let key = "documentPrinting"
//     if (isUrgent) key = "urgentJobs"
//     else if (isBulk) key = "bulkJobs"
//     else if (isColor) key = "colorPrinting"
//     else if (totalPages > 10) key = "largeFiles"
//     else key = "smallFiles"

//     const printer = settings[key]
//     if (!printer) return { printer: null, reason: "no_settings" }
//     return { printer, reason: key }
//   }

//   const routingLabel = {
//     urgentJobs: "Urgent Job",
//     bulkJobs: "Bulk Order",
//     colorPrinting: "Color Printing",
//     bwPrinting: "B&W Printing",
//     largeFiles: "Large File",
//     smallFiles: "Small File",
//     photosPrinting: "Photo Printing",
//     documentPrinting: "Document Printing",
//   }

//   // ── Helper: update a single order in the query cache ──
//   const patchOrder = (queryClient, orderId, patch) => {
//     queryClient.setQueryData(["recentOrders"], (old) =>
//       old ? old.map(o => o.id === orderId ? { ...o, ...patch } : o) : old
//     )
//   }

//   // ─────────────────────────────────────────────
//   // MAIN HANDLER
//   // ─────────────────────────────────────────────
//   const handlePrintFile = useCallback(async (file, order) => {

//     // ── 1. Resolve printer ──
//     const allFiles = order.files || [file]
//     const { printer: printerName, reason } = resolveTargetPrinter(order, allFiles)

//     if (!printerName) {
//       toast(
//         (t) => (
//           <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <span>⚙️ Printer routing is not configured.</span>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id)
//                 window.location.href = "/dashboard/settings/printer"
//               }}
//               style={{
//                 padding: "4px 10px", borderRadius: "6px", background: "#6366f1",
//                 color: "#fff", border: "none", cursor: "pointer",
//                 fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap",
//               }}
//             >
//               Go to Settings →
//             </button>
//           </span>
//         ),
//         { duration: 6000 }
//       )
//       return
//     }

//     const label = routingLabel[reason] || reason

//     // ── 2. DOWNLOADING ──
//     patchOrder(queryClient, order.id, { status: "Downloading" })

//     const downloadToast = toast.loading(
//       `⬇️ Downloading "${file.name}"...`,
//       { id: `download-${order.id}` }
//     )

//     let downloadedBlob
//     try {
//       const res = await fetch(file.url)
//       if (!res.ok) throw new Error(`Download failed (${res.status})`)
//       downloadedBlob = await res.blob()

//       toast.success(
//         `✅ "${file.name}" downloaded successfully`,
//         { id: downloadToast, duration: 2500 }
//       )
//     } catch (error) {
//       toast.error(
//         `❌ Download failed: ${error.message}`,
//         { id: downloadToast }
//       )
//       patchOrder(queryClient, order.id, { status: "Failed" })
//       queryClient.invalidateQueries(["recentOrders"])
//       return
//     }

//     // Small gap so user sees the download-success toast before print starts
//     await new Promise(r => setTimeout(r, 600))

//     // ── 3. PRINTING ──
//     patchOrder(queryClient, order.id, { status: "Processing" })

//     const printToast = toast.loading(
//       `🖨️ Printing "${file.name}" on ${printerName} · ${label}...`,
//       { id: `print-${order.id}` }
//     )

//     try {
//       const response = await printDocument(
//         file.url,
//         order.id,
//         printerName,
//         order.print_color,
//         order.no_of_copies
//       )

//       if (response?.message) {

//         // ── 4. PROCESSING (printer is spooling) ──
//         patchOrder(queryClient, order.id, { status: "Processing" })

//         toast.loading(
//           `⚙️ Processing print job on ${printerName}...`,
//           { id: printToast, duration: 1500 }
//         )

//         await new Promise(r => setTimeout(r, 1500))

//         // ── 5. COMPLETE ──
//         patchOrder(queryClient, order.id, { status: "Processing" })

//         toast.success(
//           (t) => (
//             <span>
//               <span style={{ fontWeight: 700 }}>🎉 Print Complete!</span>
//               <br />
//               <span style={{ fontSize: "13px", color: "#374151" }}>
//                 "{file.name}" printed on <b>{printerName}</b> · {label}
//               </span>
//             </span>
//           ),
//           { id: printToast, duration: 5000 }
//         )

//         // Sync with server after completion
//         setTimeout(() => {
//           queryClient.invalidateQueries(["recentOrders"])
//           console.log("✓ Orders refreshed after print complete")
//         }, 500)

//       } else {
//         throw new Error(response?.error || "Unknown print error")
//       }

//     } catch (error) {
//       toast.error(
//         `❌ Print error: ${error.message}`,
//         { id: printToast }
//       )
//       patchOrder(queryClient, order.id, { status: "Failed" })
//       queryClient.invalidateQueries(["recentOrders"])
//     }

//   }, [queryClient])


//   // const handlePrintAllFiles = useCallback(async (files, order) => {
//   //   const printerName = getSelectedPrinter()
//   //   if (!printerName) {
//   //     toast.error("⚠️ Please select a printer first.")
//   //     return
//   //   }

//   //   toast.loading(`Printing ${files.length} file(s)...`, { duration: 2000 })

//   //   let allPrinted = true
//   //   for (const file of files) {
//   //     try {
//   //       const response = await printDocument(
//   //         file.url,
//   //         order.id,
//   //         printerName,
//   //         order.print_color,
//   //         order.no_of_copies
//   //       )
//   //       if (!response || !response.message) {
//   //         allPrinted = false
//   //       }
//   //       await new Promise(resolve => setTimeout(resolve, 1000))
//   //     } catch (error) {
//   //       console.error(`Error printing ${file.name}:`, error)
//   //       allPrinted = false
//   //     }
//   //   }

//   //   if (allPrinted) {
//   //     toast.success(`✅ Printed ${files.length} file(s)!`, { duration: 3000 })

//   //     // Wait a moment for backend to update, then invalidate cache
//   //     setTimeout(async () => {
//   //       await queryClient.invalidateQueries(['recentOrders'])
//   //       console.log('✓ Refreshed orders after print')
//   //     }, 500)
//   //   } else {
//   //     toast.error(`❌ Some files failed to print`, { duration: 3000 })
//   //   }
//   // }, [queryClient])


//   const handlePrintAllFiles = useCallback(async (files, order) => {

//     // ── 1. Resolve printer from routing settings ──
//     const allFiles = files || []
//     const { printer: printerName, reason } = resolveTargetPrinter(order, allFiles)

//     if (!printerName) {
//       toast(
//         (t) => (
//           <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <span>⚙️ Printer routing is not configured.</span>
//             <button
//               onClick={() => {
//                 toast.dismiss(t.id)
//                 window.location.href = "/dashboard/settings/printer"
//               }}
//               style={{
//                 padding: "4px 10px", borderRadius: "6px", background: "#6366f1",
//                 color: "#fff", border: "none", cursor: "pointer",
//                 fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap",
//               }}
//             >
//               Go to Settings →
//             </button>
//           </span>
//         ),
//         { duration: 6000 }
//       )
//       return
//     }

//     const label = routingLabel[reason] || reason
//     const total = allFiles.length
//     let passed = 0
//     let failed = 0

//     // ── 2. Mark order as Downloading ──
//     patchOrder(queryClient, order.id, { status: "Downloading" })

//     // Summary toast that stays throughout
//     const summaryToast = toast.loading(
//       `⬇️ Starting download of ${total} file(s)...`,
//       { id: `all-summary-${order.id}` }
//     )

//     // ── 3. Process each file sequentially ──
//     for (let i = 0; i < allFiles.length; i++) {
//       const file = allFiles[i]
//       const fileNum = `[${i + 1}/${total}]`

//       // ── DOWNLOADING ──
//       const dlToast = toast.loading(
//         `⬇️ ${fileNum} Downloading "${file.name}"...`,
//         { id: `dl-${order.id}-${i}` }
//       )

//       try {
//         const res = await fetch(file.url)
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         await res.blob() // ensure fully downloaded

//         toast.success(
//           `✅ ${fileNum} "${file.name}" downloaded`,
//           { id: dlToast, duration: 2000 }
//         )
//       } catch (err) {
//         toast.error(
//           `❌ ${fileNum} Download failed: ${err.message}`,
//           { id: dlToast, duration: 3000 }
//         )
//         failed++
//         continue // skip to next file
//       }

//       await new Promise(r => setTimeout(r, 500))

//       // ── PRINTING ──
//       patchOrder(queryClient, order.id, { status: "Printing" })

//       const printToast = toast.loading(
//         `🖨️ ${fileNum} Printing "${file.name}" on ${printerName} · ${label}...`,
//         { id: `pt-${order.id}-${i}` }
//       )

//       try {
//         const response = await printDocument(
//           file.url,
//           order.id,
//           printerName,
//           order.print_color,
//           order.no_of_copies
//         )

//         if (response?.message) {

//           // ── PROCESSING ──
//           patchOrder(queryClient, order.id, { status: "Processing" })

//           toast.loading(
//             `⚙️ ${fileNum} Processing "${file.name}" on ${printerName}...`,
//             { id: printToast, duration: 1500 }
//           )

//           await new Promise(r => setTimeout(r, 1500))

//           toast.success(
//             `🎉 ${fileNum} "${file.name}" printed on ${printerName}`,
//             { id: printToast, duration: 3000 }
//           )

//           passed++

//         } else {
//           throw new Error(response?.error || "Unknown error")
//         }

//       } catch (err) {
//         toast.error(
//           `❌ ${fileNum} Print failed: ${err.message}`,
//           { id: printToast, duration: 3000 }
//         )
//         failed++
//       }

//       // Gap between files so toasts don't pile up
//       await new Promise(r => setTimeout(r, 800))
//     }

//     // ── 4. Final summary toast ──
//     if (failed === 0) {
//       patchOrder(queryClient, order.id, { status: "Completed" })
//       toast.success(
//         (t) => (
//           <span>
//             <span style={{ fontWeight: 700 }}>🎉 All {total} file(s) printed!</span>
//             <br />
//             <span style={{ fontSize: "13px", color: "#374151" }}>
//               Printer: <b>{printerName}</b> · {label}
//             </span>
//           </span>
//         ),
//         { id: summaryToast, duration: 6000 }
//       )
//     } else if (passed === 0) {
//       patchOrder(queryClient, order.id, { status: "Failed" })
//       toast.error(
//         `❌ All ${total} file(s) failed to print`,
//         { id: summaryToast, duration: 5000 }
//       )
//     } else {
//       patchOrder(queryClient, order.id, { status: "Partial" })
//       toast(
//         `⚠️ ${passed} of ${total} file(s) printed · ${failed} failed`,
//         { id: summaryToast, icon: "⚠️", duration: 5000 }
//       )
//     }

//     // ── 5. Sync with server ──
//     setTimeout(() => {
//       queryClient.invalidateQueries(["recentOrders"])
//       console.log("✓ Orders refreshed after bulk print")
//     }, 500)

//   }, [queryClient])

//   const handleMouseEnter = useCallback((orderId, type) => {
//     if (hoverTimeoutRef.current) {
//       clearTimeout(hoverTimeoutRef.current)
//     }
//     hoverTimeoutRef.current = setTimeout(() => {
//       setHoveredAction({ orderId, type })
//     }, 300)
//   }, [])

//   const handleMouseLeave = useCallback(() => {
//     if (hoverTimeoutRef.current) {
//       clearTimeout(hoverTimeoutRef.current)
//     }
//     hoverTimeoutRef.current = setTimeout(() => {
//       setHoveredAction(null)
//     }, 200)
//   }, [])

//   const cancelMouseLeave = useCallback(() => {
//     if (hoverTimeoutRef.current) {
//       clearTimeout(hoverTimeoutRef.current)
//     }
//   }, [])

//   const handleRefresh = useCallback(() => {
//     queryClient.invalidateQueries(['recentOrders'])
//     toast.success('Refreshing orders...', { duration: 1000 })
//   }, [queryClient])

//   if (isLoading && orders.length === 0) {
//     return (
//       <motion.div
//         className="recent-orders"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <p>Loading recent orders...</p>
//       </motion.div>
//     )
//   }

//   if (error && orders.length === 0) {
//     return (
//       <motion.div className="recent-orders-error">
//         <p>Error fetching recent orders.</p>
//         <button onClick={handleRefresh} className="btn-retry">
//           Retry
//         </button>
//       </motion.div>
//     )
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
//           <h3>Recent Orders({filteredOrders.length})</h3>
//         </div>

//         {/* <div className="flex items-center gap-2">
//           <label className="switch">
//             <input
//               type="checkbox"
//               checked={autoPrint}
//               onChange={(e) => {
//                 setAutoPrint(e.target.checked)
//                 if (!e.target.checked) {
//                   autoPrintedOrdersRef.current.clear()
//                 }
//               }}
//             />
//             <span className="slider round"></span>
//           </label>
//           <span style={{ marginLeft: "8px" }}>Auto Print First 5 Pending</span>
//         </div> */}

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
//               <th>Side</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {filteredOrders.map((order, index) => {
//                 const files = getOrderFiles(order)
//                 const hasMultipleFiles = files.length > 1

//                 return (
//                   <motion.tr
//                     key={order.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     whileHover={{ backgroundColor: "rgba(10, 36, 99, 0.02)" }}
//                   >
//                     <td className="order-id">{order.id}</td>
//                     <td className="order-customer">{order.customer}</td>
//                     <td className="order-date">{order.date}</td>
//                     <td className={getPaymentStatusColor(order.payment_status)}>
//                       {order.amount}
//                     </td>
//                     <td>single</td>
//                     <td>
//                       <motion.span className={`${getStatusColor(order.status)} status`}>
//                         {order.status}
//                       </motion.span>
//                     </td>
//                     <td className="flex gap-2 recent-orders-actions">
//                       {files.length > 0 && (
//                         <>
//                           {/* View Button */}
//                           <div style={{ position: 'relative' }}>
//                             <motion.button
//                               className="btn-icon"
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               title={hasMultipleFiles ? `View ${files.length} files` : "View File"}
//                               onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'view')}
//                               onMouseLeave={handleMouseLeave}
//                               onClick={() => !hasMultipleFiles && handleViewFile(files[0])}
//                             >
//                               <Eye size={16} />
//                               {hasMultipleFiles && (
//                                 <span style={{
//                                   position: 'absolute',
//                                   top: '-4px',
//                                   right: '-4px',
//                                   backgroundColor: '#3b82f6',
//                                   color: '#fff',
//                                   borderRadius: '50%',
//                                   width: '16px',
//                                   height: '16px',
//                                   fontSize: '10px',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center',
//                                   fontWeight: '600'
//                                 }}>
//                                   {files.length}
//                                 </span>
//                               )}
//                             </motion.button>
//                             <AnimatePresence>
//                               {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'view' && (
//                                 <FileActionsPopup
//                                   files={files}
//                                   actionType="view"
//                                   onClose={{
//                                     trigger: handleMouseLeave,
//                                     cancel: cancelMouseLeave
//                                   }}
//                                   onAction={handleViewFile}
//                                   onActionAll={() => handleViewAllFiles(files)}
//                                 />
//                               )}
//                             </AnimatePresence>
//                           </div>

//                           {/* Download Button */}
//                           <div style={{ position: 'relative' }}>
//                             <motion.button
//                               className="btn-icon"
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               title={hasMultipleFiles ? `Download ${files.length} files` : "Download File"}
//                               onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'download')}
//                               onMouseLeave={handleMouseLeave}
//                               onClick={() => !hasMultipleFiles && handleDownloadFile(files[0])}
//                             >
//                               <Download size={16} />
//                               {hasMultipleFiles && (
//                                 <span style={{
//                                   position: 'absolute',
//                                   top: '-4px',
//                                   right: '-4px',
//                                   backgroundColor: '#10b981',
//                                   color: '#fff',
//                                   borderRadius: '50%',
//                                   width: '16px',
//                                   height: '16px',
//                                   fontSize: '10px',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center',
//                                   fontWeight: '600'
//                                 }}>
//                                   {files.length}
//                                 </span>
//                               )}
//                             </motion.button>
//                             <AnimatePresence>
//                               {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'download' && (
//                                 <FileActionsPopup
//                                   files={files}
//                                   actionType="download"
//                                   onClose={{
//                                     trigger: handleMouseLeave,
//                                     cancel: cancelMouseLeave
//                                   }}
//                                   onAction={handleDownloadFile}
//                                   onActionAll={() => handleDownloadAllFiles(files)}
//                                 />
//                               )}
//                             </AnimatePresence>
//                           </div>
//                         </>
//                       )}

//                       {/* Print Button */}
//                       <div style={{ position: 'relative' }}>
//                         <motion.button
//                           className="btn-icon"
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           title={hasMultipleFiles ? `Print ${files.length} files` : "Print Order"}
//                           onMouseEnter={() => hasMultipleFiles && handleMouseEnter(order.id, 'print')}
//                           onMouseLeave={handleMouseLeave}
//                           onClick={() => !hasMultipleFiles && files.length > 0 && handlePrintFile(files[0], order)}
//                         >
//                           <Printer size={16} />
//                           {hasMultipleFiles && (
//                             <span style={{
//                               position: 'absolute',
//                               top: '-4px',
//                               right: '-4px',
//                               backgroundColor: '#f59e0b',
//                               color: '#fff',
//                               borderRadius: '50%',
//                               width: '16px',
//                               height: '16px',
//                               fontSize: '10px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               fontWeight: '600'
//                             }}>
//                               {files.length}
//                             </span>
//                           )}
//                         </motion.button>
//                         <AnimatePresence>
//                           {hasMultipleFiles && hoveredAction?.orderId === order.id && hoveredAction?.type === 'print' && (
//                             <FileActionsPopup
//                               files={files}
//                               actionType="print"
//                               onClose={{
//                                 trigger: handleMouseLeave,
//                                 cancel: cancelMouseLeave
//                               }}
//                               onAction={(file) => handlePrintFile(file, order)}
//                               onActionAll={() => handlePrintAllFiles(files, order)}
//                             />
//                           )}
//                         </AnimatePresence>
//                       </div>

//                       {/* <AnimatedTrashButton
//                         title="Delete Order"
//                         size={20}
//                       /> */}
//                     </td>
//                   </motion.tr>
//                 )
//               })}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>


//       {/* Load More Button */}
//       {hasMoreOrders && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             marginTop: '24px',
//             paddingTop: '24px',
//             borderTop: '1px solid #e2e8f0'
//           }}
//         >
//           <motion.button
//             onClick={handleLoadMore}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             disabled={isFetching}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               padding: '12px 24px',
//               backgroundColor: '#3b82f6',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '8px',
//               fontSize: '14px',
//               fontWeight: '500',
//               cursor: isFetching ? 'not-allowed' : 'pointer',
//               opacity: isFetching ? 0.6 : 1,
//               transition: 'all 0.2s ease'
//             }}
//             className="btn-primary"
//           >
//             {isFetching ? (
//               <>
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   <RefreshCw size={16} />
//                 </motion.div>
//                 Loading...
//               </>
//             ) : (
//               <>
//                 <Download size={16} />
//                 Load More Orders
//                 <span style={{
//                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                   padding: '2px 8px',
//                   borderRadius: '12px',
//                   fontSize: '12px',
//                   fontWeight: '600'
//                 }}>
//                   +10
//                 </span>
//               </>
//             )}
//           </motion.button>

//           <div style={{
//             marginLeft: '16px',
//             fontSize: '13px',
//             color: '#64748b'
//           }}>
//             Showing {displayLimit} of {orders.length} orders
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }

// export default RecentOrders



"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye, Printer, Search, RefreshCw, X, Download,
  FileText, Info, Clock, CreditCard, Layers, Hash, ChevronDown, FileWarning
} from "lucide-react"
import { recentOrders } from "./api/endpoints"
import { printDocument } from "./api/printerAgentapi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import FileActionsPopup from "./pops/FileActionPopUp"

// ─────────────────────────────────────────────
// Helpers to figure out how a file should be previewed
// ─────────────────────────────────────────────
const getFileExt = (name = "") => (name.split(".").pop() || "").toLowerCase()

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"]
const OFFICE_EXTS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"]

const getPreviewKind = (file) => {
  const ext = getFileExt(file?.name || file?.url || "")
  if (ext === "pdf") return "pdf"
  if (IMAGE_EXTS.includes(ext)) return "image"
  if (OFFICE_EXTS.includes(ext)) return "office"
  return "unsupported"
}

// ─────────────────────────────────────────────
// FILE VIEWER POPUP — shown when Eye / View is clicked
// Renders the actual file inline, with Download + Close in the header
// ─────────────────────────────────────────────
const FileViewerPopup = ({ file, order, onClose }) => {
  const kind = getPreviewKind(file)

  const handleDownload = () => {
    const dlToast = toast.loading(`Downloading ${file.name}...`)
    fetch(file.url)
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.blob() })
      .then(blob => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        a.click()
        URL.revokeObjectURL(a.href)
        toast.success("Downloaded!", { id: dlToast })
      })
      .catch(() => toast.error("Download failed", { id: dlToast }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 780, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "88vh" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={16} color="#3b82f6" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 380 }}>{file.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                {order?.id}{file.pages ? ` · ${file.pages} pages` : ""}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Download size={14} /> Download
            </motion.button>
            <button onClick={onClose} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Preview body */}
        <div style={{ flex: 1, overflow: "auto", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
          {kind === "pdf" && (
            <iframe
              src={file.url}
              title={file.name}
              style={{ width: "100%", height: "65vh", border: "none", background: "#fff" }}
            />
          )}

          {kind === "image" && (
            <img
              src={file.url}
              alt={file.name}
              style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain", display: "block" }}
            />
          )}

          {kind === "office" && (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`}
              title={file.name}
              style={{ width: "100%", height: "65vh", border: "none", background: "#fff" }}
            />
          )}

          {kind === "unsupported" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 40, color: "#9ca3af" }}>
              <FileWarning size={32} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>Preview not available for this file type</div>
              <div style={{ fontSize: 12 }}>Use the Download button above to open it locally.</div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// ORDER DETAIL POPUP — shown when ! is clicked
// ─────────────────────────────────────────────
const OrderDetailPopup = ({ order, onClose }) => {
  const rows = [
    { icon: Hash, label: "Order ID", value: order.id },
    { icon: Clock, label: "Date", value: order.date },
    { icon: FileText, label: "Customer", value: order.customer },
    { icon: Layers, label: "Print Color", value: order.print_color || "—" },
    { icon: Layers, label: "Paper Size", value: order.paper_size || "—" },
    { icon: Layers, label: "Print Side", value: order.print_side || "—" },
    { icon: Layers, label: "Binding", value: order.binding || "None" },
    { icon: FileText, label: "Total Pages", value: order.no_of_pages || order.NoOfPages || "—" },
    { icon: Hash, label: "Copies", value: order.no_of_copies || "1" },
    { icon: CreditCard, label: "Amount", value: order.amount },
    { icon: CreditCard, label: "Payment", value: order.payment_status === true ? "✅ Paid" : order.payment_status || "—" },
    { icon: CreditCard, label: "Payment Method", value: order.payment_method || "—" },
    { icon: Hash, label: "Transaction ID", value: order.transaction_id || "—" },
    { icon: Clock, label: "Status", value: order.status },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Info size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Order Details</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{order.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={14} />
          </button>
        </div>

        {/* Details grid */}
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 400, overflowY: "auto" }}>
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ padding: "10px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <Icon size={12} color="#9ca3af" />
                <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".4px", fontWeight: 500 }}>{label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value ?? "—"}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// SMART MULTI-FILE HOVER POPUP
// auto-flips direction based on available space
// Now has an explicit action button (View / Print / Download) per row,
// plus a "<Action> All" button in the header.
// ─────────────────────────────────────────────
const POPUP_WIDTH = 250
const POPUP_ITEM_H = 40
const POPUP_HEADER_H = 38

const ACTION_META = {
  view: { icon: Eye, verb: "View", color: "#3b82f6" },
  print: { icon: Printer, verb: "Print", color: "#f59e0b" },
  download: { icon: Download, verb: "Download", color: "#10b981" },
}

const SmartFileActionsPopup = ({ files, actionType, onAction, onActionAll, onClose, triggerRef }) => {
  const [style, setStyle] = useState({ opacity: 0 })
  const [animFrom, setAnimFrom] = useState({ y: -6 })

  useEffect(() => {
    if (!triggerRef?.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const popupH = POPUP_HEADER_H + files.length * POPUP_ITEM_H
    const popupW = POPUP_WIDTH

    const vw = window.innerWidth
    const vh = window.innerHeight

    // ── Vertical: prefer bottom, flip to top if not enough space ──
    const spaceBelow = vh - rect.bottom
    const spaceAbove = rect.top
    const openDown = spaceBelow >= popupH || spaceBelow >= spaceAbove

    // ── Horizontal: center on trigger, clamp to viewport ──
    const triggerCenterX = rect.left + rect.width / 2
    let leftPx = triggerCenterX - popupW / 2

    // Clamp so popup never goes off-screen
    const margin = 8
    if (leftPx < margin) leftPx = margin
    if (leftPx + popupW > vw - margin) leftPx = vw - margin - popupW

    // Convert to position relative to the trigger's offsetParent
    const triggerLeft = rect.left
    const relLeft = leftPx - triggerLeft

    const posStyle = openDown
      ? { top: "calc(100% + 6px)", bottom: "auto" }
      : { bottom: "calc(100% + 6px)", top: "auto" }

    setAnimFrom({ y: openDown ? -6 : 6 })
    setStyle({ left: relLeft, ...posStyle, opacity: 1 })
  }, [triggerRef, files.length])

  const meta = ACTION_META[actionType] || ACTION_META.view
  const HeaderIcon = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: animFrom.y, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: animFrom.y, scale: 0.97 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      onMouseEnter={onClose.cancel}
      onMouseLeave={onClose.trigger}
      style={{
        position: "absolute",
        width: POPUP_WIDTH,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
        zIndex: 1000,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Header — "<Verb> All" button */}
      <button
        onClick={onActionAll}
        style={{
          width: "100%", border: "none", padding: "9px 14px", fontSize: 12, fontWeight: 700, color: "#fff",
          background: meta.color, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, height: POPUP_HEADER_H,
        }}
      >
        <HeaderIcon size={13} />
        <span>{meta.verb} All ({files.length})</span>
      </button>

      {/* Individual files, each with its own action button */}
      {files.map((file, i) => {
        const ItemIcon = meta.icon
        return (
          <div
            key={i}
            style={{
              padding: "0 8px 0 14px", display: "flex", alignItems: "center", gap: 8,
              borderTop: "1px solid #f3f4f6", background: "#fff", height: POPUP_ITEM_H,
            }}
          >
            <FileText size={13} color="#9ca3af" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
              {file.pages && <div style={{ fontSize: 10, color: "#9ca3af" }}>{file.pages}p</div>}
            </div>
            <button
              onClick={() => onAction(file)}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 6,
                border: `1px solid ${meta.color}33`, background: `${meta.color}14`, color: meta.color,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              <ItemIcon size={11} /> {meta.verb}
            </button>
          </div>
        )
      })}
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const RecentOrders = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [hoveredAction, setHoveredAction] = useState(null)
  const [viewerOrder, setViewerOrder] = useState(null)   // { order, file } for FileViewerPopup
  const [detailOrder, setDetailOrder] = useState(null)   // for OrderDetailPopup
  const [displayLimit, setDisplayLimit] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const hoverTimeoutRef = useRef(null)
  const lastOrderCountRef = useRef(0)
  const autoPrintedOrdersRef = useRef(new Set())

  // Refs for smart popup positioning
  const btnRefs = useRef({})
  const getBtnRef = (orderId, type) => {
    const key = `${orderId}-${type}`
    if (!btnRefs.current[key]) btnRefs.current[key] = { current: null }
    return btnRefs.current[key]
  }

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const data = await recentOrders()
      return data?.orders || []
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
    staleTime: 2000,
    retry: 2,
  })

  const orders = ordersData || []
  const limitedOrders = orders.slice(0, displayLimit)
  const hasMoreOrders = orders.length > displayLimit

  const handleLoadMore = useCallback(() => {
    setIsFetching(true)
    setDisplayLimit(prev => prev + 10)
    toast.success("Loaded 10 more orders", { duration: 1500 })
    setTimeout(() => setIsFetching(false), 300)
  }, [])

  const getOrderFiles = useCallback((order) => {
    if (!order.file_url) return []
    let pageCounts = {}
    try {
      if (order.file_pages && typeof order.file_pages === "object") pageCounts = order.file_pages
      else if (order.pageCounts) pageCounts = typeof order.pageCounts === "string" ? JSON.parse(order.pageCounts) : order.pageCounts
      else if (order.FilePagesCount) pageCounts = typeof order.FilePagesCount === "string" ? JSON.parse(order.FilePagesCount) : order.FilePagesCount
      else if (order.NoOfPages || order.no_of_pages) pageCounts = { default: order.NoOfPages || order.no_of_pages }
    } catch { pageCounts = {} }

    try {
      const parsed = JSON.parse(order.file_url)
      if (typeof parsed === "object" && !Array.isArray(parsed))
        return Object.entries(parsed).map(([name, url]) => ({ name, url, pages: pageCounts[name] || null }))
    } catch { }

    if (typeof order.file_url === "string" && order.file_url.startsWith("http"))
      return [{ name: `${order.id}_file.pdf`, url: order.file_url, pages: order.NoOfPages || order.no_of_pages || null }]
    return []
  }, [])

  // ── Printer routing helpers ──
  const getPrinterSettings = () => { try { const r = localStorage.getItem("printerJobRouting"); return r ? JSON.parse(r) : null } catch { return null } }
  const routingLabel = { urgentJobs: "Urgent Job", bulkJobs: "Bulk Order", colorPrinting: "Color Printing", bwPrinting: "B&W Printing", largeFiles: "Large File", smallFiles: "Small File", photosPrinting: "Photo Printing", documentPrinting: "Document Printing" }
  const resolveTargetPrinter = (order, files) => {
    const settings = getPrinterSettings()
    if (!settings) return { printer: null, reason: "no_settings" }
    const isColor = order.print_color?.toLowerCase() === "color"
    const totalPages = order.no_of_pages || 0
    const isBulk = (files?.length || 1) > 3
    const isUrgent = order.is_urgent === true || order.priority === "urgent"
    let key = "documentPrinting"
    if (isUrgent) key = "urgentJobs"
    else if (isBulk) key = "bulkJobs"
    else if (isColor) key = "colorPrinting"
    else if (totalPages > 10) key = "largeFiles"
    else key = "smallFiles"
    const printer = settings[key]
    if (!printer) return { printer: null, reason: "no_settings" }
    return { printer, reason: key }
  }
  const patchOrder = (orderId, patch) => {
    queryClient.setQueryData(["recentOrders"], old => old ? old.map(o => o.id === orderId ? { ...o, ...patch } : o) : old)
  }
  const noRouterToast = () => toast((t) => (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span>⚙️ Printer routing not configured.</span>
      <button onClick={() => { toast.dismiss(t.id); window.location.href = "/dashboard/settings/printer" }} style={{ padding: "4px 10px", borderRadius: 6, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Go to Settings →</button>
    </span>
  ), { duration: 6000 })

  const handlePrintFile = useCallback(async (file, order) => {
    const allFiles = order.files || [file]
    const { printer: printerName, reason } = resolveTargetPrinter(order, allFiles)
    if (!printerName) { noRouterToast(); return }
    const label = routingLabel[reason] || reason
    patchOrder(order.id, { status: "Downloading" })
    const dlToast = toast.loading(`⬇️ Downloading "${file.name}"...`, { id: `dl-${order.id}` })
    try {
      const res = await fetch(file.url)
      if (!res.ok) throw new Error(`${res.status}`)
      await res.blob()
      toast.success(`✅ "${file.name}" downloaded`, { id: dlToast, duration: 2000 })
    } catch (e) {
      toast.error(`❌ Download failed: ${e.message}`, { id: dlToast })
      patchOrder(order.id, { status: "Failed" })
      queryClient.invalidateQueries(["recentOrders"])
      return
    }
    await new Promise(r => setTimeout(r, 600))
    // patchOrder(order.id, { status: "Printing" })
    const printToast = toast.loading(`🖨️ Printing on ${printerName} · ${label}...`, { id: `pt-${order.id}` })
    try {
      const response = await printDocument(file.url, order.id, printerName, order.print_color, order.no_of_copies)
      if (response?.message) {
        patchOrder(order.id, { status: "Processing" })
        toast.loading(`⚙️ Processing on ${printerName}...`, { id: printToast, duration: 1500 })
        await new Promise(r => setTimeout(r, 1500))
        patchOrder(order.id, { status: "Processing" })
        toast.success(<span><b>🎉 Print Complete!</b><br /><span style={{ fontSize: 13 }}>"{file.name}" → <b>{printerName}</b> · {label}</span></span>, { id: printToast, duration: 5000 })
        setTimeout(() => queryClient.invalidateQueries(["recentOrders"]), 500)
      } else throw new Error(response?.error || "Unknown error")
    } catch (e) {
      toast.error(`❌ Print error: ${e.message}`, { id: printToast })
      patchOrder(order.id, { status: "Failed" })
      queryClient.invalidateQueries(["recentOrders"])
    }
  }, [queryClient])

  const handlePrintAllFiles = useCallback(async (files, order) => {
    const { printer: printerName, reason } = resolveTargetPrinter(order, files)
    if (!printerName) { noRouterToast(); return }
    const label = routingLabel[reason] || reason
    const total = files.length
    let passed = 0, failed = 0
    patchOrder(order.id, { status: "Downloading" })
    const summaryToast = toast.loading(`⬇️ Starting ${total} file(s)...`, { id: `sum-${order.id}` })
    for (let i = 0; i < files.length; i++) {
      const file = files[i], fn = `[${i + 1}/${total}]`
      const dlToast = toast.loading(`⬇️ ${fn} Downloading "${file.name}"...`, { id: `dl-${order.id}-${i}` })
      try {
        const res = await fetch(file.url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        await res.blob()
        toast.success(`✅ ${fn} "${file.name}" downloaded`, { id: dlToast, duration: 1800 })
      } catch (err) { toast.error(`❌ ${fn} Download failed`, { id: dlToast, duration: 2500 }); failed++; continue }
      await new Promise(r => setTimeout(r, 500))
      // patchOrder(order.id, { status: "Printing" })
      const ptToast = toast.loading(`🖨️ ${fn} Printing on ${printerName}...`, { id: `pt-${order.id}-${i}` })
      try {
        const res = await printDocument(file.url, order.id, printerName, order.print_color, order.no_of_copies)
        if (res?.message) {
          patchOrder(order.id, { status: "Processing" })
          toast.loading(`⚙️ ${fn} Processing...`, { id: ptToast, duration: 1500 })
          await new Promise(r => setTimeout(r, 1500))
          toast.success(`🎉 ${fn} Printed on ${printerName}`, { id: ptToast, duration: 2500 })
          passed++
        } else throw new Error(res?.error || "Unknown")
      } catch (err) { toast.error(`❌ ${fn} Print failed`, { id: ptToast, duration: 2500 }); failed++ }
      await new Promise(r => setTimeout(r, 700))
    }
    if (failed === 0) { patchOrder(order.id, { status: "Processing" }); toast.success(<span><b>🎉 All {total} files printed!</b><br /><span style={{ fontSize: 13 }}>Printer: <b>{printerName}</b> · {label}</span></span>, { id: summaryToast, duration: 6000 }) }
    else if (passed === 0) { patchOrder(order.id, { status: "Failed" }); toast.error(`❌ All ${total} files failed`, { id: summaryToast, duration: 5000 }) }
    else { patchOrder(order.id, { status: "Partial" }); toast(`⚠️ ${passed}/${total} printed · ${failed} failed`, { id: summaryToast, icon: "⚠️", duration: 5000 }) }
    setTimeout(() => queryClient.invalidateQueries(["recentOrders"]), 500)
  }, [queryClient])

  // ── Hover logic ──
  const handleMouseEnter = useCallback((orderId, type) => {
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => setHoveredAction({ orderId, type }), 280)
  }, [])
  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => setHoveredAction(null), 200)
  }, [])
  const cancelMouseLeave = useCallback(() => clearTimeout(hoverTimeoutRef.current), [])

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries(["recentOrders"])
    toast.success("Refreshing...", { duration: 1000 })
  }, [queryClient])

  const getStatusColor = (s) => ({ Complete: "text-success", Processing: "text-warning", Downloading: "text-primary", Printing: "text-primary", Pending: "text-danger", Cancelled: "text-light bg-dark", Completed: "text-success", Failed: "text-danger" }[s] || "text-dark")
  const getPaymentColor = (s) => s === true ? "text-success" : s === "Pending" ? "text-warning" : s === "Failed" ? "text-danger" : "text-dark"

  const filteredOrders = useMemo(() => limitedOrders.filter(o => {
    const ms = o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const mf = statusFilter === "all" || o.status === statusFilter
    return ms && mf
  }), [limitedOrders, searchTerm, statusFilter])

  if (isLoading && orders.length === 0) return <div className="recent-orders"><p>Loading recent orders...</p></div>
  if (error && orders.length === 0) return <div className="recent-orders-error"><p>Error fetching orders.</p><button onClick={handleRefresh} className="btn-retry">Retry</button></div>

  return (
    <>
      <motion.div className="recent-orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="section-header flex justify-between items-center">
          <h3>Recent Orders ({filteredOrders.length})</h3>
          <div className="flex items-center gap-4">
            <div className="orders-actions flex items-center gap-2">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="status-filter">
                <option value="all">All Status</option>
                <option value="Complete">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
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
                  const hasMultiple = files.length > 1

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="order-id">{order.id}</td>
                      <td className="order-customer">{order.customer}</td>
                      <td className="order-date">{order.date}</td>
                      <td className={getPaymentColor(order.payment_status)}>{order.amount}</td>
                      <td>single</td>
                      <td><span className={`${getStatusColor(order.status)} status`}>{order.status}</span></td>

                      <td className="flex gap-2 recent-orders-actions">
                        {/* ── Eye / View ── */}
                        {files.length > 0 && (
                          <div style={{ position: "relative" }}
                            ref={el => { const k = `${order.id}-view`; if (!btnRefs.current[k]) btnRefs.current[k] = {}; btnRefs.current[k].current = el }}
                          >
                            <motion.button
                              className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              title={hasMultiple ? `View ${files.length} files` : "View File"}
                              onMouseEnter={() => hasMultiple && handleMouseEnter(order.id, "view")}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => !hasMultiple && setViewerOrder({ order, file: files[0] })}
                            >
                              <Eye size={16} />
                              {hasMultiple && <span style={{ position: "absolute", top: -4, right: -4, background: "#3b82f6", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{files.length}</span>}
                            </motion.button>
                            <AnimatePresence>
                              {hasMultiple && hoveredAction?.orderId === order.id && hoveredAction?.type === "view" && (
                                <SmartFileActionsPopup
                                  files={files} actionType="view"
                                  triggerRef={btnRefs.current[`${order.id}-view`]}
                                  onClose={{ trigger: handleMouseLeave, cancel: cancelMouseLeave }}
                                  onAction={file => { setViewerOrder({ order, file }); setHoveredAction(null) }}
                                  onActionAll={() => { files.forEach((f, i) => setTimeout(() => window.open(f.url, "_blank"), i * 300)); setHoveredAction(null) }}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* ── Print ── */}
                        <div style={{ position: "relative" }}
                          ref={el => { const k = `${order.id}-print`; if (!btnRefs.current[k]) btnRefs.current[k] = {}; btnRefs.current[k].current = el }}
                        >
                          <motion.button
                            className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            title={hasMultiple ? `Print ${files.length} files` : "Print"}
                            onMouseEnter={() => hasMultiple && handleMouseEnter(order.id, "print")}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => !hasMultiple && files.length > 0 && handlePrintFile(files[0], order)}
                          >
                            <Printer size={16} />
                            {hasMultiple && <span style={{ position: "absolute", top: -4, right: -4, background: "#f59e0b", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{files.length}</span>}
                          </motion.button>
                          <AnimatePresence>
                            {hasMultiple && hoveredAction?.orderId === order.id && hoveredAction?.type === "print" && (
                              <SmartFileActionsPopup
                                files={files} actionType="print"
                                triggerRef={btnRefs.current[`${order.id}-print`]}
                                onClose={{ trigger: handleMouseLeave, cancel: cancelMouseLeave }}
                                onAction={file => { handlePrintFile(file, order); setHoveredAction(null) }}
                                onActionAll={() => { handlePrintAllFiles(files, order); setHoveredAction(null) }}
                              />
                            )}
                          </AnimatePresence>
                        </div>

                        {/* ── ! Order Detail ── */}
                        <motion.button
                          className="btn-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          title="Order Details"
                          onClick={() => setDetailOrder(order)}
                          style={{ fontWeight: 700, fontSize: 14, color: "#6366f1" }}
                        >
                          <Info size={16} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMoreOrders && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24, paddingTop: 24, borderTop: "1px solid #e2e8f0", gap: 16 }}>
            <motion.button onClick={handleLoadMore} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isFetching} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: isFetching ? "not-allowed" : "pointer", opacity: isFetching ? 0.6 : 1 }}>
              {isFetching ? <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Loading...</> : <>Load More <span style={{ background: "rgba(255,255,255,0.25)", padding: "1px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>+10</span></>}
            </motion.button>
            <span style={{ fontSize: 13, color: "#64748b" }}>Showing {displayLimit} of {orders.length}</span>
          </div>
        )}
      </motion.div>

      {/* ── Popups ── */}
      <AnimatePresence>
        {viewerOrder && (
          <FileViewerPopup
            file={viewerOrder.file}
            order={viewerOrder.order}
            onClose={() => setViewerOrder(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailOrder && (
          <OrderDetailPopup
            order={detailOrder}
            onClose={() => setDetailOrder(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default RecentOrders