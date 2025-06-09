import React from "react";

export default function AffiliatePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Affiliate Program</h1>
      <p className="mb-4">Earn with MyLapKart by joining our affiliate program!</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Attractive commissions on every sale</li>
        <li>Easy tracking and timely payouts</li>
        <li>Sign up by emailing <a href="mailto:affiliate@mylapkart.com" className="text-blue-600 underline">affiliate@mylapkart.com</a></li>
      </ul>
      <p className="mb-4">For more details, please <a href="/contact" className="text-blue-600 underline">contact us</a>.</p>
    </div>
  );
}
