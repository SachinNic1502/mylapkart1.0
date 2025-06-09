"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Refund, Return & Cancellation Policy</h1>
          <p className="text-lg text-gray-700 mb-2">Please review our refund, return, and cancellation policy below.</p>
        </div>
        <Card className="mb-8 shadow p-5 flex flex-col gap-8">
          <CardContent>
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Cancellation Policy</h2>
              <div className="mb-2">
                <span className="font-semibold">Before Shipping:</span>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Orders can be cancelled anytime before dispatch.</li>
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold">After Shipping:</span>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Cancellation is not possible.</li>
                  <li>Refuse delivery or return the item after receipt.</li>
                </ul>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">Return & Refund Policy</h2>
              <div className="mb-2">
                <span className="font-semibold">Return Eligibility:</span>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>You can request a return within 7 days for:</li>
                  <li className="ml-4">Damaged or defective product</li>
                  <li className="ml-4">Incorrect item delivered</li>
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Conditions:</span>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Item must be unused, original packaging intact.</li>
                  <li>No return on “No Return” tagged items (e.g., software/customized).</li>
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Refund Process:</span>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Processed within 7–10 business days after inspection.</li>
                  <li>Refunded to original payment method.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <div>
                  <span className="font-semibold">Contact:</span> <a href="tel:7219655222" className="underline">7219655222</a>
                </div>
                <div>
                  <span className="font-semibold">Email:</span> <a href="mailto:ssgorle@gmail.com" className="underline">ssgorle@gmail.com</a>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
