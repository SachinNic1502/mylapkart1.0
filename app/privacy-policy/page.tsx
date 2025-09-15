import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Privacy Policy</h1>
          <p className="text-lg text-gray-700 mb-2">Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal data when you visit our website and use our services.</p>
        </div>
        <Card className="shadow-lg">
  <CardContent>
    <p className="mb-4">Laptop House (“we”, “our”, or “us”) is committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, and protect your personal data.</p>
    <h3 className="text-lg font-semibold mt-6 mb-2">What We Collect</h3>
    <ul className="list-disc ml-6 mb-4">
      <li><span className="font-medium">Personal Info:</span> Name, email, mobile number, address</li>
      <li><span className="font-medium">Payment Info:</span> Handled via secure gateways, not stored</li>
      <li><span className="font-medium">Device Info:</span> IP address, browser type, usage patterns</li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Why We Collect It</h3>
    <ul className="list-disc ml-6 mb-4">
      <li>To fulfill your orders</li>
      <li>Provide support & updates</li>
      <li>Enhance your shopping experience</li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Sharing & Security</h3>
    <ul className="list-disc ml-6 mb-4">
      <li>We never sell your data</li>
      <li>Shared only with delivery/payment/legal partners</li>
      <li>Protected via SSL, encryption, and strict access controls</li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Your Rights</h3>
    <p className="mb-4">Request to access, edit, or delete your data by contacting us at <a href="mailto:ssgorle@gmail.com" className="underline">ssgorle@gmail.com</a></p>
  </CardContent>
</Card>
      </div>
      <Footer />
    </>
  );
}
