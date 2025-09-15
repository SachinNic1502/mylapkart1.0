"use client"


import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreditCard, Wallet, IndianRupee, Truck, HelpCircle, Headset, RefreshCcw, XCircle, PackageCheck } from "lucide-react";
 
export default function ReturnsAndRefundsDocPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Returns & Refunds Policy</h1>
          <p className="text-lg text-gray-700 mb-2">Shop with confidence—easy returns, fast refunds, and 24/7 support.</p>
        </div>

        {/* Policy Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Our Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-semibold">Easy Returns:</span> Request a return within <span className="font-semibold">7 days</span> of delivery for eligible products.</li>
              <li><span className="font-semibold">Refunds:</span> Once your return is approved and received, refunds are processed within <span className="font-semibold">3-5 business days</span> to your original payment method.</li>
              <li><span className="font-semibold">Conditions:</span> Items must be unused, in original packaging, and include all accessories/documentation.</li>
              <li><span className="font-semibold">Non-returnable:</span> Certain items (e.g., software, perishable goods) are not eligible for return. See product page for details.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Two-column: Order Tracking & Returns Process */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex items-center gap-2">
              <Truck className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg">Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Track your orders in real-time from your account dashboard. Get updates on shipping status, estimated delivery, and more.
              </p>
              <Button asChild size="sm">
                <Link href="/orders">Go to Order Tracking</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex items-center gap-2">
              <RefreshCcw className="text-green-600 w-5 h-5" />
              <CardTitle className="text-lg">How to Return a Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-2">
                <li>Login to your Laptop House account and go to <span className="font-semibold">My Orders</span>.</li>
                <li>Select the order and item you wish to return.</li>
                <li>Click <span className="font-semibold">Request Return</span> and fill out the required details.</li>
                <li>Pack the item securely for pickup or drop-off as instructed.</li>
                <li>Track your return status and refund progress in your account.</li>
              </ol>
              <Button asChild size="sm">
                <Link href="/orders">Start a Return</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <HelpCircle className="text-purple-600 w-5 h-5" />
            <CardTitle className="text-lg">Returns & Refunds FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>How long does it take to get my refund?</AccordionTrigger>
                <AccordionContent>
                  Refunds are processed within 3-5 business days after we receive and inspect your return. You’ll get an email confirmation when your refund is issued.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>What if I receive a damaged or wrong product?</AccordionTrigger>
                <AccordionContent>
                  Please request a return immediately from your account dashboard. Select the issue type and upload photos if needed. Our team will assist you promptly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>Can I exchange an item instead of returning?</AccordionTrigger>
                <AccordionContent>
                  Currently, we only support returns and refunds. For exchanges, please return your item and place a new order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger>Are there any return shipping charges?</AccordionTrigger>
                <AccordionContent>
                  Returns are free for eligible products. You’ll see any applicable charges during the return request process.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="shadow-md">
          <CardHeader className="flex items-center gap-2">
            <Headset className="text-pink-600 w-5 h-5" />
            <CardTitle className="text-lg">Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">Need help? Our support team is here for you 24/7.</p>
            <ul className="text-gray-700 text-sm space-y-1 mb-2">
              <li>Email: <a href="mailto:support@Laptop House.com" className="text-blue-600 underline">support@Laptop House.com</a></li>
              <li>Phone: <a href="tel:+911234567890" className="text-blue-600 underline">+91 12345 67890</a></li>
              <li>Live Chat: Coming Soon</li>
            </ul>
            <Button asChild size="sm">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
