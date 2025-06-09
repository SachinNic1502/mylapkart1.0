import jsPDF from "jspdf";

export function generateBillPdf(order: any) {
  const doc = new jsPDF();
  const left = 15;
  let y = 20;

  // Set a professional font
  doc.setFont("helvetica", "normal");

  // Header: Store Information
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MyLapkart", left, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("www.mylapkart.com", left, y + 7);
  doc.text("GSTIN: 27AAAPL1234C1ZV", left, y + 12); // Replace with your actual GSTIN
  doc.text("Mumbai, Maharashtra, India", left, y + 17);

  // Invoice Title and Details
  y += 25;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Invoice / Bill of Supply", left, y);
  y += 10;

  // Invoice Number and Date
  doc.setFontSize(11);
  doc.text(`Invoice No: INV-${order._id.slice(-8)}`, left, y); // Unique invoice number
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, left + 100, y);
  y += 10;

  // Customer and Shipping Information
  if (order.customerName) {
    doc.setFontSize(11);
    doc.text("Bill To:", left, y);
    doc.text(order.customerName, left + 30, y);
    y += 6;
  }
  if (order.shippingAddress) {
    doc.setFontSize(10);
    doc.text("Ship To:", left, y);
    let addressLines: string[] = [];
    if (typeof order.shippingAddress === 'string') {
      addressLines = [order.shippingAddress];
    } else if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      // Filter out empty/undefined/null fields and join values
      addressLines = [
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.pincode,
        order.shippingAddress.country
      ].filter(Boolean);
    }
    for (const line of addressLines) {
      doc.text(line, left + 30, y);
      y += 6;
    }
  }
  y += 4;

  // Table Header: Items
  doc.setFontSize(11);
  doc.setFillColor(200, 200, 200); // Light gray background
  doc.rect(left, y, 180, 8, "F"); // Filled rectangle for header
  doc.setFont("helvetica", "bold");
  doc.text("S.No", left + 2, y + 6);
  doc.text("Item Description", left + 18, y + 6);
  doc.text("Qty", left + 90, y + 6);
  doc.text("Unit Price", left + 110, y + 6);
  doc.text("Total", left + 150, y + 6);

  // Table Rows: Item Details
  y += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let subtotal = 0;
  order.orderItems.forEach((item: any, idx: number) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    doc.text(`${idx + 1}`, left + 2, y);
    doc.text(`${item.name}`, left + 18, y);
    doc.text(`${item.quantity}`, left + 90, y);
    doc.text(`₹${item.price.toLocaleString()}`, left + 110, y);
    doc.text(`₹${itemSubtotal.toLocaleString()}`, left + 150, y);
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // Totals Section
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(left, y, left + 180, y); // Horizontal line separator
  y += 8;
  doc.setFontSize(11);
  doc.text("Subtotal:", left + 110, y);
  doc.text(`₹${subtotal.toLocaleString()}`, left + 150, y);

  // Tax (use order tax if available, else 18% GST)
  let tax = order.taxAmount || Math.round(subtotal * 0.18);
  y += 6;
  doc.text("Tax (18% GST):", left + 110, y);
  doc.text(`₹${tax.toLocaleString()}`, left + 150, y);

  // Grand Total with Discounts
  let grandTotal = subtotal + tax;
  if (order.coinDiscount) {
    y += 6;
    doc.text("Coin Discount:", left + 110, y);
    doc.text(`-₹${order.coinDiscount.toLocaleString()}`, left + 150, y);
    grandTotal -= order.coinDiscount;
  }

  y += 8;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", left + 110, y);
  doc.text(`₹${grandTotal.toLocaleString()}`, left + 150, y);

  // Footer: Thank You and Support
  y += 16;
  doc.setFontSize(12);
  doc.text("Thank you for shopping with us!", left, y);
  y += 7;
  doc.setFontSize(10);
  doc.text("For support: support@mylapkart.com | +91-9000000000", left, y);

  // Save with a Descriptive File Name
  doc.save(`Invoice_INV-${order._id.slice(-8)}_${order.customerName || "Customer"}.pdf`);
}