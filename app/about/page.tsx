"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Award, ShieldCheck, Truck } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">About MyLapKart</h1>
          <p className="text-lg text-gray-700 mb-2">
            Your trusted destination for laptops, accessories, and more — delivered with care, speed, and a smile.
          </p>
        </div>

        {/* Our Story & Mission */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Founded in 2022, MyLapKart was born out of a passion for technology and a commitment to making high-quality laptops and accessories accessible to everyone in India. We believe in honest pricing, transparent policies, and exceptional customer service.
            </p>
            <p>
              Our mission is to simplify your shopping experience with a curated selection, fast shipping, and dedicated support — so you can focus on what matters most.
            </p>
          </CardContent>
        </Card>

        {/* Why Shop With Us */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="flex flex-col items-center py-6">
            <ShieldCheck className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle className="text-lg text-center">100% Genuine Products</CardTitle>
            <CardContent className="text-center text-gray-700 text-sm">We guarantee only authentic, brand-new products sourced from trusted suppliers.</CardContent>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <Truck className="w-10 h-10 text-green-600 mb-2" />
            <CardTitle className="text-lg text-center">Fast & Free Shipping</CardTitle>
            <CardContent className="text-center text-gray-700 text-sm">Enjoy quick delivery and free shipping on orders above ₹999 across India.</CardContent>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <Award className="w-10 h-10 text-purple-600 mb-2" />
            <CardTitle className="text-lg text-center">Trusted by Thousands</CardTitle>
            <CardContent className="text-center text-gray-700 text-sm">Thousands of happy customers trust us for their tech needs. Your satisfaction is our priority.</CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="shadow-md mb-8">
          <CardHeader className="flex items-center gap-2">
            <Users className="text-pink-600 w-5 h-5" />
            <CardTitle className="text-lg">Join the MyLapKart Family</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Have questions, suggestions, or want to partner with us? We’d love to hear from you!
            </p>
            <Button asChild size="sm">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card> 
              {/* Social Media Section */}
        {/* <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold mb-3">Connect With Us</h2>
          <div className="flex gap-6">
            <a href="https://facebook.com/mylapkart" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg className="w-7 h-7 text-blue-700 hover:text-blue-900 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://twitter.com/mylapkart" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg className="w-7 h-7 text-blue-500 hover:text-blue-700 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11.64c-2.5 0-4.51 2.01-4.51 4.5 0 .35.04.69.1 1.01C7.69 6.09 4.07 4.13 1.64 1.16c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.64A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.51 3.91 3.52 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.71 2.15 2.95 4.04 2.98A9.05 9.05 0 0 1 1 19.54a12.8 12.8 0 0 0 6.95 2.03c8.36 0 12.94-6.93 12.94-12.94 0-.2 0-.39-.01-.58A9.18 9.18 0 0 0 23 3z"/></svg>
            </a>
            <a href="https://instagram.com/mylapkart" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="w-7 h-7 text-pink-600 hover:text-pink-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://linkedin.com/company/mylapkart" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg className="w-7 h-7 text-blue-800 hover:text-blue-900 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><line x1="16" y1="11" x2="16" y2="16"/><line x1="8" y1="11" x2="8" y2="16"/><line x1="8" y1="8" x2="8" y2="8"/><line x1="16" y1="8" x2="16" y2="8"/></svg>
            </a>
            <a href="https://youtube.com/@mylapkart" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg className="w-7 h-7 text-red-600 hover:text-red-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  );
}
