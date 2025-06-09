export async function downloadBill(orderId: string) {
  try {
    const response = await fetch(`/api/orders/${orderId}/bill`, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch bill');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MyLapkart_Order_${orderId}_Bill.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (err) {
    alert('Could not download bill. Please try again.');
  }
}
