import { Coins, Gift } from "lucide-react";
import React from "react";

type Props = {
  finalTotal: number;
};

export function RewardsInfo({ finalTotal }: Props) {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <Coins className="h-4 w-4 inline mr-1" />
          You'll earn {Math.floor(finalTotal * 0.01)} coins (1% of order value) with this purchase!
        </p>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <Gift className="h-4 w-4 inline mr-1" />
          You'll receive a random gift coupon with your order!
        </p>
      </div>
    </div>
  );
}
