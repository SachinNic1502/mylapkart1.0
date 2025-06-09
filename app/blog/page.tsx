import React from "react";

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">MyLapKart Blog</h1>
      <p className="mb-4">Read the latest news, buying guides, and tips for getting the most out of your laptop purchases!</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Product reviews and comparisons</li>
        <li>How-to guides and tutorials</li>
        <li>Industry news and updates</li>
      </ul>
      <p className="mb-4">Stay tuned for our first articles coming soon.</p>
    </div>
  );
}
