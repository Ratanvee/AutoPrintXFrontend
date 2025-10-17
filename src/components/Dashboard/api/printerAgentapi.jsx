// PrinterAgentAPI.js
const PRINTER_AGENT_URL = import.meta.env.VITE_PrinterAgentURL; // Flask local agent URL
const GetPrinterURL = `${PRINTER_AGENT_URL}/printers`
const PrinterStatusURL = `${PRINTER_AGENT_URL}/status`
const PrintOutsURL = `${PRINTER_AGENT_URL}/print`

// 🖨️ 1. Fetch list of connected printers
export const getPrinters = async () => {
    try {
        const response = await fetch(GetPrinterURL);
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
        const response = await fetch(PrinterStatusURL);
        const data = await response.json();
        return data;
    } catch {
        return false;
    }
};

// 🧾 3. Send print request to printer agent
export const printDocument = async (fileUrl, order_id, printerName, colorMode) => {
    try {
        const response = await fetch(PrintOutsURL, {
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
