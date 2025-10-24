// Global variable (not reactive)
let selectedPrinter = "";

export const setSelectedPrinterr = (printer) => {
    selectedPrinter = printer;
};

export const getSelectedPrinter = () => selectedPrinter;

// Global variable for QR Data (not reactive)
let QRData = {};
export const setQRData = (data) => {
    QRData = data;
};

export const getQRData = () => QRData;
