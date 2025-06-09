import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Terms & Conditions</h1>
          <p className="text-lg text-gray-700 mb-2">Please read our terms and conditions carefully before using MyLapKart.</p>
        </div>
        <Card className="mb-8 shadow p-5 flex flex-col gap-8">
  <CardContent>
    <section>
      <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>
      <ul className="list-disc list-inside ml-6 mb-4">
        <li>Use Mylapkart for lawful purchases only</li>
        <li>Accept updates to prices or product listings</li>
        <li>Abide by local regulations during usage</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 mb-2">Product Accuracy</h3>
      <p className="mb-4">While we try to be accurate, errors may occur in descriptions or images.</p>
      <h3 className="text-lg font-semibold mt-6 mb-2">Limitation of Liability</h3>
      <p className="mb-2">We are not responsible for delays, indirect losses, or service interruptions.</p>
    </section>
  </CardContent>
</Card>
      </div>
      <Footer />
    </>
  );
}
