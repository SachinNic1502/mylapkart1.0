import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

type Props = {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
};

export function PaymentMethodSection({ paymentMethod, setPaymentMethod }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cod">Cash on Delivery</SelectItem>
            <SelectItem value="razorpay">Razorpay (Card/UPI/Wallet)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
