// Server component that handles params extraction
import EditProductForm from "./EditProductForm";
import Link from "next/link";

/**
 * Server component that unwraps the params object from Next.js dynamic route
 * and passes the productId as a prop to the client component
 */
export default async function EditProductPage({ params }: { params: { productId: string } }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/seller/dashboard" className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">&larr; Back to Seller Dashboard</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Product</h1>
      <EditProductForm productId={resolvedParams.productId} />
    </div>
  );
}