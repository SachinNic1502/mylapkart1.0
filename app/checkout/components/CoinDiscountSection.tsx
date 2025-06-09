import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {
  userCoins: number;
  useCoins: boolean;
  coinDiscount: number;
  coinsToUse: number;
  maxDiscount: number;
  handleCoinToggle: (checked: boolean) => void;
};

export function CoinDiscountSection({
  userCoins,
  useCoins,
  coinDiscount,
  coinsToUse,
  maxDiscount,
  handleCoinToggle,
}: Props) {
  if (userCoins <= 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="h-5 w-5 mr-2 text-yellow-600" />
          Use Coins for Discount
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="useCoins" checked={useCoins} onCheckedChange={handleCoinToggle} />
          <Label htmlFor="useCoins" className="text-sm">
            Use my coins for discount
          </Label>
        </div>
        <div className="text-sm text-gray-600">
          <p>Available coins: {userCoins.toLocaleString()}</p>
          <p>Max discount: ₹{maxDiscount}</p>
        </div>
        {useCoins && userCoins > 0 && (
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">
                Using {coinsToUse.toLocaleString()} coins for ₹{coinDiscount} discount
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
