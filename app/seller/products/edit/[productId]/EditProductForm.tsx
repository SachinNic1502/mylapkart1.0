"use client"

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/models/Product'

interface EditProductFormProps {
  productId: string
}

interface Specification {
  key: string
  value: string
}

interface ProductImage {
  url: string;
  publicId: string;
  alt?: string;
}
interface ProductFormData {
  name: string
  description: string
  price: number | string
  category: 'laptop' | 'iphone' | 'desktop' | 'accessories' | ''
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'refurbished'
  stock: number | string
  images: ProductImage[]
  brand: string
  model: string
  subcategory: string
  status: 'active' | 'inactive' | 'discontinued'
  specifications: Specification[]
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    stock: '',
    images: [],
    brand: '',
    model: '',
    subcategory: '',
    status: 'active',
    specifications: [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/seller/products/${productId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to fetch product: ${response.statusText}`)
        }
        const data: Product & { specifications?: {key: string, value: string, _id?: string}[] } = await response.json()
        setProduct({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || '',
          condition: data.condition || 'new',
          stock: data.stock || '',
          images: data.images ? data.images.map((img: any) => ({
            url: img.url || '',
            publicId: img.publicId || '',
            alt: img.alt || '',
          })) : [],
          brand: data.brand || '',
          model: data.model || '',
          subcategory: data.subcategory || '',
          status: data.status || 'active',
          specifications: data.specifications ? data.specifications.map(spec => ({ key: spec.key, value: spec.value })) : [],
        })
      } catch (err: any) {
        console.error("Fetch product error:", err)
        setError(err.message || 'An unknown error occurred while fetching the product.')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Category/subcategory options
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'iphone', label: 'iPhone' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'accessories', label: 'Accessories' },
  ];
  const subcategoryOptionsMap: { [key: string]: { value: string, label: string }[] } = {
    laptop: [
      { value: 'new', label: 'New' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    iphone: [
      { value: 'second', label: 'Second' },
      { value: 'refurbished', label: 'Refurbished' },
      { value: 'open_box', label: 'Open Box' },
    ],
    desktop: [
      { value: 'gaming', label: 'Gaming' },
      { value: 'office', label: 'Office' },
      { value: 'workstation', label: 'Workstation' },
      { value: 'all_in_one', label: 'All-in-One' },
    ],
    accessories: [
      { value: 'mouse', label: 'Mouse' },
      { value: 'keyboard', label: 'Keyboard' },
      { value: 'headphones', label: 'Headphones' },
      { value: 'speakers', label: 'Speakers' },
      { value: 'webcam', label: 'Webcam' },
      { value: 'monitor', label: 'Monitor' },
      { value: 'cables', label: 'Cables' },
      { value: 'storage', label: 'Storage' },
      { value: 'cooling', label: 'Cooling' },
      { value: 'cleaning', label: 'Cleaning' },
    ],
  };
  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'refurbished', label: 'Refurbished' },
  ];
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setProduct(prev => ({
        ...prev,
        category: value as ProductFormData['category'],
        subcategory: '', // Reset subcategory when category changes
      }));
    } else if (name === 'condition') {
      setProduct(prev => ({ ...prev, condition: value as ProductFormData['condition'] }));
    } else if (name === 'status') {
      setProduct(prev => ({ ...prev, status: value as ProductFormData['status'] }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? (value === '' ? '' : Number(value)) : value,
      }));
    }
  }

  const handleImageChange = (index: number, field: keyof ProductImage, value: string) => {
    const newImages = [...product.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setProduct(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setProduct(prev => ({ ...prev, images: [...prev.images, { url: '', publicId: '', alt: '' }] }));
  };

  const removeImageField = (index: number) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecifications = [...product.specifications]
    newSpecifications[index] = { ...newSpecifications[index], [field]: value }
    setProduct(prev => ({ ...prev, specifications: newSpecifications }))
  }

  const addSpecificationField = () => {
    setProduct(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }))
  }

  const removeSpecificationField = (index: number) => {
    setProduct(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSuccessMessage(null)
    setLoading(true)

    if (!product.name || !product.price || !product.category || !product.stock || !product.brand || !product.model || !product.subcategory || !product.status) {
        setSubmitError('Please fill in all required fields including Name, Price, Category, Stock, Brand, Model, Subcategory, and Status.');
        setLoading(false);
        return;
    }
    // Validate subcategory for selected category
    if (
      product.category &&
      product.subcategory &&
      !subcategoryOptionsMap[product.category]?.some(opt => opt.value === product.subcategory)
    ) {
      setSubmitError('Invalid subcategory for the selected category.');
      setLoading(false);
      return;
    }
    if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
        setSubmitError('Price must be a positive number.');
        setLoading(false);
        return;
    }
    if (isNaN(Number(product.stock)) || Number(product.stock) < 0) {
        setSubmitError('Stock must be a non-negative number.');
        setLoading(false);
        return;
    }

    try {
      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        images: product.images.map(img => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || '',
        })),
      };

      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to update product: ${response.statusText}`)
      }

      setSuccessMessage('Product updated successfully!')
    } catch (err: any) {
      console.error("Update product error:", err)
      setSubmitError(err.message || 'An unknown error occurred while updating the product.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !product.name) { 
    return <div className="text-center py-10">Loading product details...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-xl rounded-lg max-w-3xl mx-auto">
      {submitError && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{submitError}</div>}
      {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">{successMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full input-class" />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} required className="mt-1 block w-full input-class" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
          <input type="text" name="model" id="model" value={product.model} onChange={handleChange} required className="mt-1 block w-full input-class" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" id="category" value={product.category} onChange={handleChange} required className="mt-1 block w-full input-class bg-white">
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
          <select name="subcategory" id="subcategory" value={product.subcategory} onChange={handleChange} required className="mt-1 block w-full input-class bg-white" disabled={!product.category}>
            <option value="">{product.category ? 'Select Subcategory' : 'Select Category First'}</option>
            {product.category && subcategoryOptionsMap[product.category]?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <select name="condition" id="condition" value={product.condition} onChange={handleChange} required className="mt-1 block w-full input-class bg-white">
            {conditionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" rows={4} value={product.description} onChange={handleChange} className="mt-1 block w-full input-class" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full input-class" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} required min="0" step="1" className="mt-1 block w-full input-class" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" id="status" value={product.status} onChange={handleChange} required className="mt-1 block w-full input-class bg-white">
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
        {product.specifications.map((spec, index) => (
          <div key={index} className="grid grid-cols-11 gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Key (e.g., RAM)"
              value={spec.key}
              onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
              className="col-span-5 block w-full input-class"
            />
            <input
              type="text"
              placeholder="Value (e.g., 16GB)"
              value={spec.value}
              onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
              className="col-span-5 block w-full input-class"
            />
            <button
              type="button"
              onClick={() => removeSpecificationField(index)}
              className="col-span-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecificationField}
          className="mt-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Specification
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Product Images</h3>
        {product.images.map((img, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
            <input
              type="url"
              value={img.url}
              onChange={(e) => handleImageChange(index, 'url', e.target.value)}
              placeholder="Image URL"
              className="col-span-4 block w-full input-class"
              required
            />
            <input
              type="text"
              value={img.publicId}
              onChange={(e) => handleImageChange(index, 'publicId', e.target.value)}
              placeholder="Public ID"
              className="col-span-4 block w-full input-class"
              required
            />
            <input
              type="text"
              value={img.alt || ''}
              onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
              placeholder="Alt text (optional)"
              className="col-span-3 block w-full input-class"
            />
            <button
              type="button"
              onClick={() => removeImageField(index)}
              className="col-span-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="mt-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Image
        </button>
      </div>

      <style jsx>{`
        .input-class {
          padding: 0.5rem 0.75rem;
          border: 1px solid #D1D5DB; 
          border-radius: 0.375rem; 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
        }
        .input-class:focus {
          outline: none;
          border-color: #6366F1; 
          box-shadow: 0 0 0 0.125rem rgba(99, 102, 241, 0.25); 
        }
      `}</style>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </div>
    </form>
  )
}
