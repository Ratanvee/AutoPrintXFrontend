// // PrinterAgentAPI.js
// const PRINTER_AGENT_URL = import.meta.env.VITE_PrinterAgentURL; // Flask local agent URL
// const GetPrinterURL = `${PRINTER_AGENT_URL}/printers`
// const PrinterStatusURL = `${PRINTER_AGENT_URL}/status`
// const PrintOutsURL = `${PRINTER_AGENT_URL}/print`

// // 🖨️ 1. Fetch list of connected printers
// export const getPrinters = async () => {
//     try {
//         const response = await fetch(GetPrinterURL);
//         const data = await response.json();
//         return data.printers || [];
//     } catch (error) {
//         // console.error("Error fetching printers:", error);
//         return [];
//     }
// };

// // 🟢 2. Check if the printer agent is online
// export const checkPrinterAgentStatus = async () => {
//     try {
//         const response = await fetch(PrinterStatusURL);
//         const data = await response.json();
//         return data;
//     } catch {
//         return false;
//     }
// };

// // 🧾 3. Send print request to printer agent
// export const printDocument = async (fileUrl, order_id, printerName, colorMode, NoOfCopies) => {
//     try {
//         const response = await fetch(PrintOutsURL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 file_url: fileUrl,
//                 printer_name: printerName,
//                 color_mode: colorMode,
//                 order_id: order_id,
//                 NoOfCopies: NoOfCopies
//             }),
//         });

//         const data = await response.json();
//         console.log("Print Response:", data);

//         if (!response.ok) {
//             throw new Error(data.error || "Print request failed");
//         }

//         console.log("✅ Print Success:", data);
//         return data;
//     } catch (error) {
//         console.error("❌ Print Error:", error);
//         return { error: error.message };
//     }
// };



const PRINTER_AGENT_URL = import.meta.env.VITE_PrinterAgentURL;

const GetPrinterURL = `${PRINTER_AGENT_URL}/printers`;
const PrinterStatusURL = `${PRINTER_AGENT_URL}/status`;
const PrintOutsURL = `${PRINTER_AGENT_URL}/print`;

const fetchWithTimeout = async (url, options = {}, timeout = 2000) => {
    const controller = new AbortController();

    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timer);
        return response;
    } catch (err) {
        clearTimeout(timer);
        return null;
    }
};

export const getPrinters = async () => {
    const response = await fetchWithTimeout(GetPrinterURL);

    if (!response) return [];

    try {
        const data = await response.json();
        return data.printers || [];
    } catch {
        return [];
    }
};

export const checkPrinterAgentStatus = async () => {
    try {
        const controller = new AbortController();

        // const timeout = setTimeout(() => {
        //     controller.abort();
        // }, 2000);

        const response = await fetch(PrinterStatusURL, {
            signal: controller.signal,
            cache: "no-store",
        });

        // clearTimeout(timeout);

        if (!response.ok) {
            return { online: false };
        }

        return await response.json();

    } catch {
        return { online: false };
    }
};

export const printDocument = async (
    fileUrl,
    order_id,
    printerName,
    colorMode,
    NoOfCopies
) => {
    const response = await fetchWithTimeout(
        PrintOutsURL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                file_url: fileUrl,
                printer_name: printerName,
                color_mode: colorMode,
                order_id,
                NoOfCopies,
            }),
        },
        5000
    );

    if (!response) {
        return {
            success: false,
            error: "Printer Agent Offline",
        };
    }

    try {
        return await response.json();
    } catch {
        return {
            success: false,
            error: "Invalid response",
        };
    }
};