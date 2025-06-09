import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function WarrantyPage() {
  return ( 
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Warranty Policy</h1>
        </div>
        <Card className="shadow-lg mb-8">
          <CardContent>
            <ul className="list-disc ml-6 mb-4 text-base">
              <li>All products are covered by a standard manufacturer warranty (typically 1 year) unless otherwise stated.</li>
              <li>Warranty covers manufacturing defects only. Physical damage, water damage, and unauthorized repairs are not covered.</li>
              <li>To claim warranty, contact us with your order details and product serial number.</li>
              <li>We will assist you with the manufacturer’s warranty process or provide further instructions.</li>
            </ul>
            <p className="mb-4">For warranty claims or questions, please <a href="/contact" className="text-blue-600 underline">contact our support team</a>.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
