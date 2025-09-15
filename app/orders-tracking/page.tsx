"use client";


import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, Truck, PackageCheck, Clock, XCircle, RefreshCcw, Link2, AlertTriangle } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function OrdersTrackingPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Order Tracking</h1>
          <p className="text-lg text-gray-700 mb-4">Easily track your orders, view shipping status, and get real-time delivery updates for all your Laptop House purchases.</p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/orders">Track My Orders</Link>
          </Button>
        </div>

        {/* How to Track Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">How to Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
              <li>Login to your Laptop House account.</li>
              <li>Go to <span className="font-semibold">Orders</span> or <span className="font-semibold">Order Tracking</span> from the navigation or footer.</li>
              <li>Select the order you want to track.</li>
              <li>View the real-time status, shipping details, and estimated delivery date.</li>
            </ol>
            <Button asChild size="sm" className="mt-2">
              <Link href="/orders">Go to My Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Statuses & Troubleshooting */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Order Statuses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><PackageCheck className="w-5 h-5 text-blue-700" /><span><span className="font-semibold text-blue-800">Placed:</span> Order received and processing.</span></li>
                <li className="flex items-center gap-2"><Truck className="w-5 h-5 text-green-600" /><span><span className="font-semibold text-green-800">Shipped:</span> Order handed to courier, tracking link available.</span></li>
                <li className="flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-600" /><span><span className="font-semibold text-yellow-800">Out for Delivery:</span> Out with delivery agent.</span></li>
                <li className="flex items-center gap-2"><PackageCheck className="w-5 h-5 text-emerald-600" /><span><span className="font-semibold text-emerald-800">Delivered:</span> Successfully delivered to your address.</span></li>
                <li className="flex items-center gap-2"><XCircle className="w-5 h-5 text-red-600" /><span><span className="font-semibold text-red-800">Cancelled/Returned:</span> Order was cancelled or returned.</span></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-blue-400" /><span>Order not updating? Try refreshing the page or re-login.</span></li>
                <li className="flex items-center gap-2"><Link2 className="w-5 h-5 text-purple-500" /><span>Tracking link not working? Wait a few hours after shipping or contact support.</span></li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-600" /><span>Order delayed? Check for courier updates or contact us for help.</span></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="flex items-center gap-2">
            <HelpCircle className="text-purple-600 w-5 h-5" />
            <CardTitle className="text-lg">Order Tracking FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Can I track my order without logging in?</AccordionTrigger>
                <AccordionContent>
                  For your security, order tracking requires you to be logged in to your Laptop House account.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>How soon is tracking available?</AccordionTrigger>
                <AccordionContent>
                  Tracking is usually available within 24 hours of your order being shipped. You’ll receive an email/SMS with tracking details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>Who do I contact for help?</AccordionTrigger>
                <AccordionContent>
                  Use the support options below or our live chat for immediate assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Need More Help?</CardTitle>
          </CardHeader> 
          <CardContent>
            <p className="text-gray-700 mb-2">Our support team is here for you 24/7.</p>
            <ul className="text-gray-700 text-sm space-y-1 mb-2">
              <li>Email: <a href="mailto:support@Laptop House.com" className="text-blue-600 underline">support@Laptop House.com</a></li>
              <li>Phone: <a href="tel:+911234567890" className="text-blue-600 underline">+91 12345 67890</a></li>
              <li>Live Chat:Comming Soon</li>
            </ul>
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