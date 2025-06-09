import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function FAQPage() {
  return ( 
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Frequently Asked Questions (FAQ)</h1>
        </div>
        <Card className="shadow-lg mb-8">
        <CardHeader className="flex items-center gap-2">
          <HelpCircle className="text-purple-600 w-5 h-5" />
          <CardTitle className="text-2xl">Frequently Asked Questions (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Ordering */}
            <AccordionItem value="faq-1">
              <AccordionTrigger>How do I place an order?</AccordionTrigger>
              <AccordionContent>
                Browse products, add your desired items to the cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase securely.
              </AccordionContent>
            </AccordionItem>
            {/* Payment */}
            <AccordionItem value="faq-2">
              <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept credit/debit cards, UPI, net banking, and cash on delivery (COD). All payments are processed securely. For more details, see our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we use industry-standard encryption and do not store your card details. All transactions are processed through secure payment gateways. Read more in our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
              </AccordionContent>
            </AccordionItem>
            {/* Shipping */}
            <AccordionItem value="faq-4">
              <AccordionTrigger>What are your shipping charges and delivery timelines?</AccordionTrigger>
              <AccordionContent>
                We offer free shipping on orders above ₹999 across India. Most orders are delivered within 2-7 business days. For more details, visit our <a href="/shipping-policy" className="text-blue-600 underline">Shipping Policy</a>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5">
              <AccordionTrigger>How do I track my order?</AccordionTrigger>
              <AccordionContent>
                Go to <span className="font-semibold">Order Tracking</span> under Help & Support or check your email for shipping updates. Tracking links are provided once your order is shipped.
              </AccordionContent>
            </AccordionItem>
            {/* Returns & Refunds */}
            <AccordionItem value="faq-6">
              <AccordionTrigger>What is your return and refund policy?</AccordionTrigger>
              <AccordionContent>
                We offer easy returns within 7 days of delivery for eligible products. Refunds are processed within 3-5 business days after the returned item is inspected. Read our <a href="/refund-policy" className="text-blue-600 underline">Refund, Return & Cancellation Policy</a> for full details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-7">
              <AccordionTrigger>How do I request a return or cancellation?</AccordionTrigger>
              <AccordionContent>
                Go to <span className="font-semibold">My Orders</span>, select the order, and click on <span className="font-semibold">Request Return</span> or <span className="font-semibold">Cancel Order</span>. Fill out the required details and submit your request. For more, see our <a href="/refund-policy" className="text-blue-600 underline">policy</a>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-8">
              <AccordionTrigger>When will I get my refund?</AccordionTrigger>
              <AccordionContent>
                Once your returned item is received and inspected, refunds are processed within 3-5 business days to your original payment method.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-9">
              <AccordionTrigger>What items are not eligible for return?</AccordionTrigger>
              <AccordionContent>
                Products marked as non-returnable on the product page, perishable goods, software, and certain personal use items are not eligible for return. See our <a href="/refund-policy" className="text-blue-600 underline">Refund Policy</a> for details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-10">
              <AccordionTrigger>How do I track my return status?</AccordionTrigger>
              <AccordionContent>
                You can track your return request and its status from the <span className="font-semibold">Returns</span> section in your account dashboard.
              </AccordionContent>
            </AccordionItem>
            {/* Privacy & Terms */}
            <AccordionItem value="faq-11">
              <AccordionTrigger>Where can I read your Terms & Conditions?</AccordionTrigger>
              <AccordionContent>
                You can read our full terms and conditions on our <a href="/terms-and-conditions" className="text-blue-600 underline">Terms & Conditions</a> page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-12">
              <AccordionTrigger>How is my personal information used?</AccordionTrigger>
              <AccordionContent>
                We use your data only for order processing, delivery, and customer support. We never sell your information. Learn more in our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
              </AccordionContent>
            </AccordionItem>
            {/* Support */}
            <AccordionItem value="faq-13">
              <AccordionTrigger>How do I contact customer support?</AccordionTrigger>
              <AccordionContent>
                Use our <a href="/contact" className="text-blue-600 underline">Contact Us</a> page, email support, or call our helpline for assistance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
    <Footer />
</>
  );
}
