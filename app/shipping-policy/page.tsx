"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function ShippingPolicyPage() {
  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-blue-900">Shipping Policy</h1>
        <p className="text-lg text-gray-700 mb-2">Please review our shipping policy below.</p>
      </div>
      <Card className="mb-8 shadow p-5 flex flex-col gap-8">
  <CardContent>
    <section>
      <h2 className="text-xl font-semibold mb-3">Shipping & Delivery Policy</h2>
      <ul className="list-disc list-inside ml-6 mb-2">
        <li>We deliver across India through trusted logistics partners.</li>
      </ul>
      <div className="mb-2">
        <span className="font-semibold">Dispatch Time:</span> Within 24–48 hours after order confirmation
      </div>
      <div className="mb-2">
        <span className="font-semibold">Delivery Time:</span> 3–7 working days (may vary by location)
      </div>
      <div className="mb-2">
        <span className="font-semibold">Shipping Charges:</span> Free for orders above ₹9,999, nominal for others
      </div>
      <div className="mb-2">
        <span className="font-semibold">Tracking:</span> Shared via email/SMS after shipment
      </div>
    </section>
  </CardContent>
</Card>
    </div>
    <Footer />
    </>
  );
}
