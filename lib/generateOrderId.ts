// lib/generateOrderId.ts
export function generateOrderId() {
    const prefix = 'MLK-ORD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const random = Math.random().toString(36).substr(2, 6).toUpperCase(); // 6-char random
    console.log("random",`${prefix}-${date}-${random}`)
    return `${prefix}-${date}-${random}`;
}