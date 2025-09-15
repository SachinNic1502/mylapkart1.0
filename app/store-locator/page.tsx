import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function StoreLocatorPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Store Locator</h1>
          <p className="text-lg text-gray-700 mb-2">Find a Laptop House partner store near you!</p>
        </div>
        <Card className="mb-8 shadow-lg p-5 min-h-[400px] md:min-h-[500px] flex flex-col justify-center">
          <CardContent className="h-full flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
              {/* Left: Store Details */}
              <div className="flex flex-col justify-center">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Address:</span>
                  </div>
                  <div className="ml-6 text-gray-700">
                    Shop No 26, Navkar Plaza, Waki Road, Near Bank of Maharashtra, Mahavir Nagar, Jamner, Dist.-Jalgaon, Maharashtra 424206
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Phone:</span>
                    <a href="tel:+917219655222" className="text-blue-600 underline">+91 7219655222</a>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">Email:</span>
                    <a href="mailto:ssgorle@gmail.com" className="text-blue-600 underline">ssgorle@gmail.com</a>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-4">
                  <span className="font-semibold">Pan-India Free Shipping.</span><br />
                  For bulk/corporate inquiries, please <a href="/contact" className="text-blue-600 underline">contact our support team</a>.
                </p>
              </div>
              {/* Right: Map */}
              <div className="flex items-center h-full">
                <div className="rounded-lg overflow-hidden border shadow-sm w-full h-full min-h-[500px]">
                  <iframe
                    title="Laptop House Jamner Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3729.569227751761!2d75.7765517!3d20.8087083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd99f02182dfbaf%3A0xfd7d56ada3a5273b!2sMy%20Laptop%20House!5e0!3m2!1sen!2sin!4v1749445055229!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '250px', height: '100%', width: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
