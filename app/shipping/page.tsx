"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Truck, PackageCheck, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
 
export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Shipping Information</h1>
          <p className="text-lg text-gray-700 mb-2">We strive to deliver your orders quickly and safely across India.</p>
        </div>

        {/* Main Info Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl">Our Shipping Promise</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-600" /> Orders processed within <span className="font-semibold">1-2 business days</span> after payment confirmation.</li>
              <li className="flex items-center gap-2"><PackageCheck className="w-5 h-5 text-green-600" /> Estimated delivery: <span className="font-semibold">3-7 business days</span> depending on location.</li>
              <li className="flex items-center gap-2"><span className="font-semibold text-blue-700">Free shipping</span> on all orders above ₹999.</li>
              <li className="flex items-center gap-2"><Truck className="w-5 h-5 text-purple-600" /> Tracking details sent via email/SMS once shipped.</li>
              <li className="flex items-center gap-2">We use trusted courier partners for all deliveries.</li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <HelpCircle className="text-purple-600 w-5 h-5" />
            <CardTitle className="text-lg">Shipping FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Can I change my shipping address after placing an order?</AccordionTrigger>
                <AccordionContent>
                  Address changes are possible before your order is shipped. Please contact our support team as soon as possible.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>How do I track my shipment?</AccordionTrigger>
                <AccordionContent>
                  Once your order is shipped, you’ll receive tracking details via email/SMS. You can also track from your account dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>What if my order is delayed?</AccordionTrigger>
                <AccordionContent>
                  Delivery times may vary due to external factors. If your order is delayed, please check your tracking link or contact support for help.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger>Do you ship to all locations in India?</AccordionTrigger>
                <AccordionContent>
                  We deliver to most pin codes across India. If your location is not serviceable, we’ll notify you at checkout.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Need Help with Shipping?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">If you have questions about your shipment, please <Link href="/contact" className="text-blue-600 underline">contact us</Link> or call <a href="tel:+911234567890" className="text-blue-600 underline">+91 12345 67890</a>.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
