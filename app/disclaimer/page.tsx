"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Disclaimer</h1>
        </div>
        <Card className="mb-8 shadow p-5 flex flex-col gap-8">
          <CardContent>
            <ul className="list-disc ml-6 text-base space-y-2">
              <li>Product photos are for illustration only</li>
              <li>Pricing, specs, and availability can change without notice</li>
              <li>We are not liable for delivery delays by courier partners</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
