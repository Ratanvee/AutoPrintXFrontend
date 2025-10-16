// Global variable (not reactive)
let selectedPrinter = "";

export const setSelectedPrinterr = (printer) => {
    selectedPrinter = printer;
};

export const getSelectedPrinter = () => selectedPrinter;
