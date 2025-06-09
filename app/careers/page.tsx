import React from "react";

export default function CareersPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Careers at MyLapKart</h1>
      <p className="mb-4">Join our passionate team and help shape the future of e-commerce for laptops and electronics!</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Dynamic work environment</li>
        <li>Opportunities for growth</li>
        <li>Competitive salaries and benefits</li>
        <li>Send your resume to <a href="mailto:hr@mylapkart.com" className="text-blue-600 underline">hr@mylapkart.com</a></li>
      </ul>
      <p className="mb-4">We are always looking for talented individuals in tech, sales, and customer support.</p>
    </div>
  );
}
