// PrinterAgentAPI.js
const PRINTER_AGENT_URL = "http://localhost:5050"; // Flask local agent URL

// 🖨️ 1. Fetch list of connected printers
export const getPrinters = async () => {
    try {
        const response = await fetch(`${PRINTER_AGENT_URL}/printers`);
        const data = await response.json();
        return data.printers || [];
    } catch (error) {
        console.error("Error fetching printers:", error);
        return [];
    }
};

// 🟢 2. Check if the printer agent is online
export const checkPrinterAgentStatus = async () => {
    try {
        const response = await fetch(`${PRINTER_AGENT_URL}/status`);
        const data = await response.json();
        return data.status === "online";
    } catch {
        return false;
    }
};

// 🧾 3. Send print request to printer agent
export const printDocument = async (fileUrl, order_id, printerName, colorMode = "Color") => {
    try {
        const response = await fetch(`${PRINTER_AGENT_URL}/print`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file_url: fileUrl,
                printer_name: printerName,
                color_mode: colorMode,
                order_id: order_id,
            }),
        });

        const data = await response.json();
        console.log("Print Response:", data);

        if (!response.ok) {
            throw new Error(data.error || "Print request failed");
        }

        console.log("✅ Print Success:", data);
        return data;
    } catch (error) {
        console.error("❌ Print Error:", error);
        return { error: error.message };
    }
};


// Fetch connected printers
export const fetchPrinters = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${PRINTER_AGENT_URL}/printers`);
        const data = await response.json();
        if (data.printers && Array.isArray(data.printers)) {
            setPrinters(data.printers);
        } else {
            setPrinters([]);
        }
    } catch (error) {
        console.error("Error fetching printers:", error);
        setPrinters([]);
    } finally {
        setLoading(false);
    }
};
