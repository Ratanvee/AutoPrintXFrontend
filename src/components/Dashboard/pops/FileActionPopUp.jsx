
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Printer, Download, FileText } from "lucide-react"

// Hover popup component for multiple files
const FileActionsPopup = ({ files, actionType, onClose, onAction, onActionAll }) => {
  // Calculate total pages
  const totalPages = files.reduce((sum, file) => sum + (file.pages || 0), 0)

  return (
    <motion.div
      className="file-actions-popup"
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: '-10px',
        right: '100%',
        marginRight: '10px',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        padding: '12px',
        minWidth: '280px',
        maxWidth: '400px',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: 1000
      }}
      onMouseEnter={onClose.cancel}
      onMouseLeave={onClose.trigger}
    >
      {/* Header with file count, total pages, and action all button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '10px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            {files.length} file{files.length > 1 ? 's' : ''}
          </span>
          {totalPages > 0 && (
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>
              Total: {totalPages} page{totalPages > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <motion.button
          onClick={onActionAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {actionType === 'view' && <Eye size={14} />}
          {actionType === 'download' && <Download size={14} />}
          {actionType === 'print' && <Printer size={14} />}
          {actionType === 'view' ? 'Open All' : actionType === 'download' ? 'Download All' : 'Print All'}
        </motion.button>
      </div>

      {/* File list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              gap: '8px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              minWidth: 0
            }}>
              <FileText size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#334155',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    flex: 1
                  }} title={file.name}>
                    {file.name}
                  </span>
                  {file.pages && (
                    <span style={{
                      fontSize: '11px',
                      color: '#64748b',
                      fontWeight: '500',
                      flexShrink: 0,
                      backgroundColor: '#e0f2fe',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      ({file.pages}p)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => onAction(file)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: '6px',
                backgroundColor: '#e0f2fe',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title={actionType === 'view' ? 'View' : actionType === 'download' ? 'Download' : 'Print'}
            >
              {actionType === 'view' && <Eye size={14} style={{ color: '#0284c7' }} />}
              {actionType === 'download' && <Download size={14} style={{ color: '#0284c7' }} />}
              {actionType === 'print' && <Printer size={14} style={{ color: '#0284c7' }} />}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}


export default FileActionsPopup;