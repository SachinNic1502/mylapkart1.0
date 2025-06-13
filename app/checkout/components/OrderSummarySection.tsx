import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Coins, Gift } from "lucide-react";
import React from "react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type Props = {
  items: CartItem[];
  total: number;
  useCoins: boolean;
  coinDiscount: number;
  taxAmount: number;
  finalTotal: number;
  loading: boolean;
  razorpayLoaded: boolean;
  paymentMethod: string;
  handlePlaceOrder: () => void;
};

export function OrderSummarySection({
  items,
  total,
  useCoins,
  coinDiscount,
  taxAmount,
  finalTotal,
  loading,
  razorpayLoaded,
  paymentMethod,
  handlePlaceOrder,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <Image
              src={item.image || "/placeholder.svg?height=60&width=60"}
              alt={item.name}
              width={60}
              height={60}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}

        {(() => {
          // Delivery charge logic
          const deliveryCharge = total < 9999 ? 149 : 0;
          const displayCoinDiscount = useCoins && coinDiscount > 0 ? coinDiscount : 0;
          const subtotalAfterDiscount = total - displayCoinDiscount;
          const tax = Math.round(subtotalAfterDiscount * 0.18);
          const fullTotal = subtotalAfterDiscount + deliveryCharge + tax;
          return (
            <>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {displayCoinDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coin Discount:</span>
                    <span>-₹{displayCoinDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{fullTotal.toLocaleString()}</span>
                </div>
              </div>
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === "razorpay" && !razorpayLoaded)}
                className="w-full"
                size="lg"
              >
                {loading ? "Processing..." : `Place Order - ₹${fullTotal.toLocaleString()}`}
              </Button>
            </>
          );
        })()}


        {paymentMethod === "razorpay" && !razorpayLoaded && (
          <p className="text-sm text-gray-600 text-center">Loading payment gateway...</p>
        )}
      </CardContent>
    </Card>
  );
}
