// import jsPDF from "jspdf";
// import autoTable, { RowInput } from "jspdf-autotable";

// export function generateBillPdf(order: any) {
//   const doc = new jsPDF();
//   const leftMargin = 15;
//   let verticalPos = 25;

//   // Store Information Header
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.setTextColor(40, 40, 150);
//   // doc.text("Laptop House", leftMargin, verticalPos);
//   doc.addImage("/icons/Laptop House.png", "PNG", leftMargin, verticalPos, 50, 50);
  
//   doc.setFontSize(10);
//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "normal");
//   doc.text("GSTIN: 27AAAPL1234C1ZV", leftMargin, verticalPos + 5);
//   doc.text("Shop No. 15, Navkar Plaza, Waki Road, Near Best Bazaar,Jamner, Tal-Jamner, Dist-Jalgaon 424206, Maharashtra", leftMargin, verticalPos + 10);
//   doc.text("Phone: +91 7219655222 | Email: ssgorle@gmail.com", leftMargin, verticalPos + 15);
//   doc.text("www.Laptop House.in", leftMargin, verticalPos + 20);

//   // Invoice Title
//   verticalPos += 30;
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.text("TAX INVOICE", 105, verticalPos, { align: "center" });

//   // Invoice & Order Details Table
//   verticalPos += 8;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   autoTable(doc, {
//     startY: verticalPos,
//     body: [
//       [
//         `Invoice No: ${order.invoiceNo || order.orderId}`,
//         `Order ID: ${order.orderId}`
//       ],
//       [
//         `Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`,
//         `Payment Mode: ${order.paymentMethod.toUpperCase()}`
//       ]
//     ],
//     styles: { fontSize: 10, cellPadding: 2 },
//     columnStyles: {
//       0: { cellWidth: 90 },
//       1: { cellWidth: 90 }
//     },
//     tableWidth: 'wrap',
//     theme: 'plain',
//   });
//   verticalPos = (doc as any).lastAutoTable.finalY + 2;

//   // Customer Details
//   verticalPos += 15;
//   doc.setFont("helvetica", "bold");
//   doc.text("Bill To:", leftMargin, verticalPos);
//   doc.setFont("helvetica", "normal");
  
//   const customerAddress = [
//     order.shippingAddress.fullName,
//     order.shippingAddress.address,
//     `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
//     `${order.shippingAddress.country}`,
//     `Phone: ${order.shippingAddress.phone}`
//   ];
  
//   doc.text(customerAddress, leftMargin + 20, verticalPos);

//   // Table Data Preparation - FIX: Use "Rs" instead of Rs symbol
//   const itemsData: RowInput[] = order.orderItems.map((item: any, index: number) => [
//     index + 1,
//     item.name,
//     item.quantity,
//     `Rs ${item.price.toFixed(2)}`,
//     `Rs ${(item.price * item.quantity).toFixed(2)}`
//   ]);

//   // AutoTable for Items - FIX: Update column headers
//   autoTable(doc, {
//     startY: verticalPos + 30,
//     head: [['S.No', 'Description', 'Qty', 'Unit Price (Rs)', 'Total (Rs)']],
//     body: itemsData,
//     theme: 'grid',
//     headStyles: { 
//       fillColor: [40, 40, 150],
//       textColor: 255,
//       fontStyle: 'bold'
//     },
//     styles: { 
//       fontSize: 10,
//       cellPadding: 3,
//       halign: 'center'
//     },
//     columnStyles: {
//       0: { cellWidth: 15 },
//       1: { cellWidth: 80, halign: 'left' },
//       2: { cellWidth: 20 },
//       3: { cellWidth: 35, halign: 'right' },
//       4: { cellWidth: 35, halign: 'right' }
//     }
//   });

//   const tableEndPos = (doc as any).lastAutoTable.finalY;

//   // Calculations
//   const subtotal = order.itemsPrice;
//   const shipping = order.shippingPrice;
//   const tax = order.taxPrice;
//   const discount = order.coinDiscount || 0;
//   const grandTotal = order.totalPrice;

//   // Summary Table - FIX: Use "Rs" instead of Rs symbol
//   autoTable(doc, {
//     startY: tableEndPos + 5,
//     body: [
//       ['Subtotal:', `Rs ${subtotal.toFixed(2)}`],
//       ['Shipping:', `Rs ${shipping.toFixed(2)}`],
//       ['Tax (18% GST):', `Rs ${tax.toFixed(2)}`],
//       ...(discount ? [['Coin Discount:', `- Rs ${discount.toFixed(2)}`]] : []),
//       ['Grand Total:', `Rs ${grandTotal.toFixed(2)}`]
//     ],
//     styles: { 
//       fontSize: 11,
//       cellPadding: 4
//     },
//     columnStyles: {
//       0: { 
//         cellWidth: 100, 
//         fontStyle: 'bold', 
//         fillColor: [220, 220, 220] 
//       },
//       1: { 
//         cellWidth: 80, 
//         halign: 'right', 
//         fontStyle: 'bold' 
//       }
//     },
//     tableWidth: 'wrap'
//   });

//   const summaryEndPos = (doc as any).lastAutoTable.finalY;

//   // Footer Section - Enhanced for eCommerce
// doc.setFontSize(9);
// doc.setFont("helvetica", "bold");
// doc.text("Important Information:", leftMargin, summaryEndPos + 10);

// // Return Policy
// doc.setFont("helvetica", "italic");
// const returnPolicy = [
//   "• Return Policy: 7-day return policy for manufacturing defects only",
//   "• Original invoice must be presented for any returns/exchanges",
//   "• Products must be in original condition with all accessories",
//   "• Shipping charges are non-refundable"
// ];
// returnPolicy.forEach((line, index) => {
//   doc.text(line, leftMargin + 5, summaryEndPos + 15 + (index * 5));
// });

// // Warranty Information
// doc.setFont("helvetica", "bold");
// doc.text("Warranty:", leftMargin, summaryEndPos + 35);
// doc.setFont("helvetica", "italic");
// doc.text("All products come with manufacturer's warranty as per product specifications", leftMargin + 5, summaryEndPos + 40);

// // Thank You Message
// doc.setFont("helvetica", "normal");
// doc.setFontSize(11);
// doc.setTextColor(40, 40, 150); // Brand color
// doc.text("Thank you for shopping with Laptop House!", 105, summaryEndPos + 50, { align: "center" });

// // Customer Support
// doc.setFontSize(9);
// doc.setTextColor(0, 0, 0);
// const supportInfo = [
//   "For any queries, please contact our customer support:",
//   "Email: support@Laptop House.com | Phone: +91 9876543210",
//   "Business Hours: Mon-Sat, 10:00 AM to 7:00 PM"
// ];
// supportInfo.forEach((line, index) => {
//   doc.text(line, 105, summaryEndPos + 55 + (index * 5), { align: "center" });
// });

// // Legal Footer
// doc.setFontSize(8);
// doc.setTextColor(100);
// const legalText = [
//   "This is a computer generated invoice and is valid without signature",
//   "Terms and conditions apply. Subject to Mumbai jurisdiction.",
//   `Invoice generated on: ${new Date().toLocaleString('en-IN')}`
// ];
// legalText.forEach((line, index) => {
//   doc.text(line, 105, summaryEndPos + 70 + (index * 4), { align: "center" });
// });


//   // Save PDF with meaningful filename
//   const fileName = `Invoice_${order.orderId}_${order.shippingAddress.fullName.replace(/\s+/g, '_')}.pdf`;
//   doc.save(fileName);
// }
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export function generateBillPdf(order: any) {
  console.log(order);
  const doc = new jsPDF();
  const leftMargin = 15;
  let verticalPos = 25;

  // Header (Bill of Supply & Original for Recipient)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);

  doc.text("Invoice", 105, verticalPos, { align: "center", fontSize: 16 }); // Centered 
  // draw line
  doc.line(leftMargin, verticalPos + 5, doc.internal.pageSize.getWidth() - leftMargin, verticalPos + 5);
  verticalPos += 10;

  // Store Information (with logo)
  doc.addImage('/icons/Laptop House.png', 'PNG', leftMargin, verticalPos, 30, 30); // Logo at top-left
  // Move verticalPos to below the logo
  verticalPos += 32;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("SHOP NO. 25, FIRST FLOOR, NAVKAR PLAZA, WAKI ROAD, JAMNER, DIST-JALGAON-424206(M.S)", leftMargin, verticalPos); 
  verticalPos += 5;
  doc.text("Phone: 8007225683 / 7219655222", leftMargin, verticalPos); 
  doc.text("Email: SSGORLE@GMAIL.COM", 115, verticalPos); 
  verticalPos += 5;
  doc.text("GSTIN: 27ANCPG2088D1ZA", leftMargin, verticalPos); 
  doc.text("State: Maharashtra", 115, verticalPos); 
  verticalPos += 10;

  // Invoice Details
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Details:", 115, verticalPos); 
  verticalPos += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`No: ${order.orderId || order.invoiceNo || ''}`, 115, verticalPos); 
  verticalPos += 5;
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = `${String(createdAt.getDate()).padStart(2, '0')}/${String(createdAt.getMonth()+1).padStart(2, '0')}/${createdAt.getFullYear()}`;
  doc.text(`Date: ${formattedDate}`, 115, verticalPos); 
  verticalPos += 5; 
  verticalPos -= 20; 

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", leftMargin, verticalPos); 
  verticalPos += 5;
  doc.setFont("helvetica", "normal");
  doc.text(order.shippingAddress?.fullName || '', leftMargin, verticalPos); 
  verticalPos += 5;
  doc.text(`${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}`, leftMargin, verticalPos); 
  verticalPos += 5;
  doc.text(`Contact No: ${order.shippingAddress?.phone || ''}`, leftMargin, verticalPos); 
  verticalPos += 10;

  // Ship To
  doc.setFont("helvetica", "bold");
  doc.text("Ship To:", leftMargin, verticalPos); 
  verticalPos += 5;
  doc.setFont("helvetica", "normal");
  doc.text(order.shippingAddress?.fullName || '', leftMargin, verticalPos); 
  verticalPos += 5;
  doc.text(`${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}`, leftMargin, verticalPos); 
  verticalPos += 5;
  doc.text(`Contact No: ${order.shippingAddress?.phone || ''}`, leftMargin, verticalPos); 
  verticalPos += 10;

  // Items Table
  const itemsData: RowInput[] = (order.orderItems || []).map((item: any, idx: number) => [
    idx + 1,
    item.name || (item.product && item.product.name) || '',
    item.quantity || 1,
    item.product?.unit || 'Pcs',
    item.price?.toFixed ? item.price.toFixed(2) : (item.price || '0.00'),
    ((item.price || 0) * (item.quantity || 1)).toFixed(2)
  ]);

  autoTable(doc, {
    startY: verticalPos,
    head: [['#', 'Item name',  'Quantity', 'Unit', 'Price/Unit(Rs)', 'Amount(Rs)']], 
    body: itemsData,
    theme: 'grid',
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 0,
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    styles: {
      fontSize: 10,
      cellPadding: 2,
      halign: 'left',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    }
  });

  const tableEndPos = (doc as any).lastAutoTable.finalY;

  verticalPos = tableEndPos + 15;

  // Payment Mode
  doc.setFont("helvetica", "bold");
  doc.text("Payment Mode:", leftMargin, verticalPos); 
  doc.setFont("helvetica", "normal");
  doc.text((order.paymentMethod || '').toUpperCase(), leftMargin + 30, verticalPos); 

  // Sub Total, Total, Received, Balance
  doc.setFont("helvetica", "normal");
  doc.text("Sub Total", 140, verticalPos); 
  doc.text(`: ${(order.itemsPrice || 0).toFixed(2)}`, 165, verticalPos); 
  verticalPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total", 140, verticalPos); 
  doc.text(`: ${(order.totalPrice || 0).toFixed(2)}`, 165, verticalPos); 
  verticalPos += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Amount in Words:", leftMargin, verticalPos); 
  doc.setFont("helvetica", "normal");
  doc.text(numberToWords(order.totalPrice || 0), leftMargin, verticalPos + 5); 

  verticalPos += 10;
  doc.setFont("helvetica", "normal");
  doc.text("Received", 140, verticalPos); 
  doc.text(`: ${(order.isPaid ? order.totalPrice : 0).toFixed(2)}`, 165, verticalPos); 
  verticalPos += 5;
  doc.text("Balance", 140, verticalPos); 
  doc.text(`Rs${(order.isPaid ? 0 : order.totalPrice).toFixed(2)}`, 165, verticalPos); 

  // Footer Section
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 35;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 150);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for your business!', 105, footerY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Support: SSGORLE@GMAIL.COM | +91 7219655222 | +91 8007225683', 105, footerY + 7, { align: 'center' });
  doc.text('Business Hours: Mon-Sat, 10:00 AM to 7:00 PM', 105, footerY + 13, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, footerY + 19, { align: 'center' });

  // Save PDF with meaningful filename
  const fileName = `Invoice_${order.orderId}_${order.shippingAddress.fullName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);

// Helper: Convert number to words (basic, for INR)
function numberToWords(num: number): string {
  if (!num || isNaN(num)) return '';
  const a = [ '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen' ];
  const b = [ '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety' ];
  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
    return '';
  }
  const intPart = Math.floor(num);
  const decimalPart = Math.round((num - intPart) * 100);
  let words = inWords(intPart) + ' Rupees';
  if (decimalPart) words += ' and ' + inWords(decimalPart) + ' Paise';
  return words + ' only';
}
}