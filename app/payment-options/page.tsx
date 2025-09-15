"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CreditCard, Wallet, IndianRupee, HelpCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentOptionsPage() {
  return ( 
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Payment Options</h1>
          <p className="text-lg text-gray-700 mb-2">Choose from a variety of secure and convenient payment methods for your Laptop House orders.</p>
        </div>

        {/* Payment Methods Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-8 items-center justify-center mb-6">
              <div className="flex flex-col items-center text-center">
                <CreditCard className="w-10 h-10 text-blue-500 mb-2" />
                <span className="font-semibold">Credit/Debit Cards</span>
                <span className="text-xs text-gray-500">Visa, MasterCard, RuPay</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Wallet className="w-10 h-10 text-green-500 mb-2" />
                <span className="font-semibold">UPI & Wallets</span>
                <span className="text-xs text-gray-500">Paytm, PhonePe, etc.</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <IndianRupee className="w-10 h-10 text-yellow-500 mb-2" />
                <span className="font-semibold">Cash on Delivery</span>
                <span className="text-xs text-gray-500">COD available</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4 text-center">
              We support a wide range of secure payment methods for your convenience. All transactions are encrypted and 100% safe.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <HelpCircle className="text-purple-600 w-5 h-5" />
            <CardTitle className="text-lg">Payment FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. All transactions are encrypted using industry-standard protocols. We never store your card details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>What if my payment fails?</AccordionTrigger>
                <AccordionContent>
                  If your payment fails, please try another method or contact your bank. For persistent issues, contact our support team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>Can I use multiple payment methods for one order?</AccordionTrigger>
                <AccordionContent>
                  Currently, only one payment method can be used per order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger>Is Cash on Delivery available everywhere?</AccordionTrigger>
                <AccordionContent>
                  COD is available in most pin codes but may be restricted in some remote areas. You’ll see availability at checkout.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Need Help with Payments?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">For payment issues or queries, our support team is here for you 24/7.</p>
            <Button asChild size="sm">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
