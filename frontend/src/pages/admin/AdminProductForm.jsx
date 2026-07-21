import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Image as ImageIcon, 
  Plus, 
  Box,
  CheckCircle2,
  AlertCircle,
  Loader2,
  List,
  Type,
  DollarSign,
  Truck,
  Zap,
  Tag,
  Palette,
  Maximize2
} from 'lucide-react';

const categories = [
  'Mobiles', 'Laptops', 'TV', 'Audio', 'Wearables', 'Accessories', 'Tablets', 'Monitors', 'Gaming'
];

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPrice: '',
    currency: 'PKR',
    category: 'Mobiles',
    mainImage: '',
    images: '', // comma separated string for input
    countInStock: '',
    isFeatured: false,
    isNewArrival: true,
    shippingCost: '0',
    deliveryTime: '3-5 business days',
    colors: '',
    sizes: '',
    specifications: '', // Format: Key:Value per line
    mobileSpecs: {
      basic: {
        brand: '',
        modelName: '',
        releaseDate: '',
        operatingSystem: ''
      },
      performance: {
        processorBrand: '',
        cpuModel: '',
        gpu: '',
        chipset: '',
        ram: '',
        ramType: '',
        storage: '',
        expandableStorage: false,
        maxExpandable: '',
        coolingSystem: ''
      },
      display: {
        screenSize: '',
        displayType: '',
        resolution: '',
        refreshRate: '',
        aspectRatio: '',
        ppi: '',
        protection: '',
        touchSamplingRate: ''
      },
      camera: {
        rearSetup: '',
        rearCount: '',
        frontCamera: '',
        flash: '',
        flashType: '',
        videoRecording: '',
        features: '',
        zoom: ''
      },
      battery: {
        capacity: '',
        type: '',
        fastCharging: '',
        wirelessCharging: false,
        reverseCharging: false,
        charger: ''
      },
      connectivity: {
        network: '',
        simType: '',
        bluetooth: '',
        wifi: '',
        gps: '',
        gpsAccuracy: '',
        nfc: '',
        usb: '',
        headphoneJack: ''
      },
      multimedia: {
        speakers: '',
        audioJack: '',
        audioFormats: '',
        videoFormats: '',
        audioJackType: ''
      },
      security: {
        fingerprint: '',
        faceUnlock: '',
        faceID: '',
        sensors: ''
      },
      design: {
        dimensions: '',
        weight: '',
        weightGrams: '',
        material: '',
        ipRating: ''
      },
      additional: {
        aiFeatures: '',
        gamingFeatures: '',
        cooling: '',
        stylus: '',
        foldType: ''
      },
      commercial: {
        sku: '',
        warranty: '',
        warrantyPeriod: '',
        boxContents: '',
        origin: '',
        manufacturer: ''
      }
    },
    uploadedImages: [] // File[] from file input
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    // Ensure mobileSpecs exists when category toggles
    if (formData.category === 'Mobiles' && !formData.mobileSpecs) {
      setFormData(prev => ({ ...prev, mobileSpecs: prev.mobileSpecs || {} }));
    }
  }, [formData.category]);

  const fetchProduct = async () => {
    try {
      setFetching(true);
      
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
      const p = res.data;
      
      // Convert specifications object back to string for easier editing
      const specString = p.specifications 
        ? Object.entries(p.specifications).map(([k, v]) => `${k}:${v}`).join('\n')
        : '';

      setFormData({
        name: p.name || '',
        brand: p.brand || '',
        description: p.description || '',
        price: p.price || '',
        originalPrice: p.originalPrice || '',
        discountPrice: p.discountPrice || '',
        currency: p.currency || 'PKR',
        category: p.category || 'Mobiles',
        mainImage: p.mainImage || '',
        images: p.images ? p.images.join(', ') : '',
        countInStock: p.countInStock || '',
        isFeatured: p.isFeatured || false,
        isNewArrival: p.isNewArrival !== undefined ? p.isNewArrival : true,
        shippingCost: p.shippingCost || '0',
        deliveryTime: p.deliveryTime || '3-5 business days',
        colors: p.colors ? p.colors.join(', ') : '',
        sizes: p.sizes ? p.sizes.join(', ') : '',
        specifications: specString,
        mobileSpecs: p.mobileSpecs || {
          basic: { brand: '', modelName: '', releaseDate: '', operatingSystem: '' },
          performance: { processorBrand: '', cpuModel: '', gpu: '', chipset: '', ram: '', ramType: '', storage: '', expandableStorage: false, maxExpandable: '', coolingSystem: '' },
          display: {}, camera: {}, battery: {}, connectivity: {}, multimedia: {}, security: {}, design: {}, additional: {}, commercial: {}
        },
        uploadedImages: []
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error loading product data' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Reusable input component
  const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '', className = '' }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${className}`}
      />
    </div>
  );

  const handleMobileSpecChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      mobileSpecs: {
        ...prev.mobileSpecs,
        [section]: {
          ...(prev.mobileSpecs?.[section] || {}),
          [field]: value
        }
      }
    }));
  };

  // File upload handlers for gallery images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, uploadedImages: [...(prev.uploadedImages || []), ...files] }));
  };

  const removeUploadedImage = (index) => {
    setFormData(prev => ({ ...prev, uploadedImages: prev.uploadedImages.filter((_, i) => i !== index) }));
  };

  const uploadedPreviews = useMemo(() => {
    return (formData.uploadedImages || []).map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [formData.uploadedImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate required fields
    const validationErrors = [];
    
    if (!formData.name.trim()) {
      validationErrors.push('Product name is required');
    }
    if (!formData.category.trim()) {
      validationErrors.push('Category is required');
    }
    if (!formData.description.trim()) {
      validationErrors.push('Description is required');
    }
    if (!formData.mainImage.trim()) {
      validationErrors.push('Main image URL is required');
    }
    if (!formData.discountPrice || Number(formData.discountPrice) <= 0) {
      validationErrors.push('Selling price must be greater than 0');
    }
    if (!formData.originalPrice || Number(formData.originalPrice) <= 0) {
      validationErrors.push('Market price must be greater than 0');
    }
    if (formData.countInStock === '' || Number(formData.countInStock) < 0) {
      validationErrors.push('Quantity in stock is required and must be 0 or greater');
    }

    if (validationErrors.length > 0) {
      setMessage({ 
        type: 'error', 
        text: validationErrors.join(' • ') 
      });
      return;
    }

    setLoading(true);

    try {
      // Build payload with ALL required fields explicitly
      const payload = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        price: Number(formData.price) || Number(formData.discountPrice),
        originalPrice: Number(formData.originalPrice),
        discountPrice: Number(formData.discountPrice),
        currency: formData.currency,
        category: formData.category,
        mainImage: formData.mainImage,
        countInStock: Number(formData.countInStock),
        isFeatured: Boolean(formData.isFeatured),
        isNewArrival: Boolean(formData.isNewArrival),
        shippingCost: Number(formData.shippingCost),
        deliveryTime: formData.deliveryTime,
        images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        specifications: formData.specifications ? formData.specifications.split('\n').map(s => s.trim()).filter(s => s !== '') : []
      };

      // Add mobileSpecs only if category is Mobiles
      if (formData.category === 'Mobiles') {
        payload.mobileSpecs = formData.mobileSpecs;
      }

      console.log('📤 Payload Name:', payload.name);
      console.log('📤 Payload Category:', payload.category);
      console.log('📤 Payload MainImage:', payload.mainImage);
      console.log('📤 Payload DiscountPrice:', payload.discountPrice);
      console.log('📤 Full Payload:', JSON.stringify(payload, null, 2));

      // If user uploaded files, send multipart/form-data
      if (formData.uploadedImages && formData.uploadedImages.length > 0) {
        const fd = new FormData();
        
        // Append files first
        formData.uploadedImages.forEach(file => fd.append('images', file));
        
        // Append all form fields
        fd.append('name', payload.name);
        fd.append('brand', payload.brand);
        fd.append('description', payload.description);
        fd.append('price', payload.price);
        fd.append('originalPrice', payload.originalPrice);
        fd.append('discountPrice', payload.discountPrice);
        fd.append('currency', payload.currency);
        fd.append('category', payload.category);
        fd.append('mainImage', payload.mainImage);
        fd.append('countInStock', payload.countInStock);
        fd.append('isFeatured', payload.isFeatured);
        fd.append('isNewArrival', payload.isNewArrival);
        fd.append('shippingCost', payload.shippingCost);
        fd.append('deliveryTime', payload.deliveryTime);
        fd.append('colors', JSON.stringify(payload.colors));
        fd.append('sizes', JSON.stringify(payload.sizes));
        fd.append('specifications', JSON.stringify(payload.specifications));
        
        if (formData.category === 'Mobiles') {
          fd.append('mobileSpecs', JSON.stringify(payload.mobileSpecs));
        }

        console.log('📤 FormData submission with files');

        if (isEditMode) {
          await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, fd);
          setMessage({ type: 'success', text: 'Product updated successfully!' });
        } else {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, fd);
          setMessage({ type: 'success', text: 'Product created successfully!' });
        }
      } else {
        // Send as JSON (no files)
        console.log('📤 JSON submission');

        if (isEditMode) {
          await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, payload);
          setMessage({ type: 'success', text: 'Product updated successfully!' });
        } else {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, payload);
          setMessage({ type: 'success', text: 'Product created successfully!' });
        }
      }
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || err.response?.data?.error || 'Error saving product' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading professional product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-40 sm:pb-32 px-4 sm:px-0">
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <Link to="/admin/products" className="flex items-center text-slate-500 hover:text-primary transition-colors group mb-2">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Return to Inventory</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Professional Product' : 'Create New Professional Product'}
          </h2>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 sm:mb-10 p-4 sm:p-5 rounded-2xl flex items-start sm:items-center space-x-3 sm:space-x-4 border-l-8 animate-slide-up ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-500' : 'bg-red-50 text-red-700 border-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
          <p className="font-bold text-sm sm:text-base">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Core Info & Media */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col space-y-6">
            <div className="flex items-center space-x-3 text-primary mb-2">
              <div className="p-2 bg-primary/10 rounded-lg"><Type size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Basic Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base sm:text-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Apple"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe your product in detail..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-green-600 mb-6">
              <div className="p-2 bg-green-50 rounded-lg"><DollarSign size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Pricing & Inventory</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Selling Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
                  <input
                    required
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Market Price (MRP)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
                  <input
                    required
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Base Cost (Internal)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs</span>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity in Stock <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold ${Number(formData.countInStock) === 0 ? 'text-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Currency Code</label>
                <input
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="PKR"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-indigo-600 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg"><ImageIcon size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Product Media</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Main Image (Thumbnail) <span className="text-red-500">*</span></label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50">
                    {formData.mainImage ? (
                      <img src={formData.mainImage} className="w-full h-full object-cover" alt="Thumb" onError={(e) => e.target.src = 'https://via.placeholder.com/100'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32} /></div>
                    )}
                  </div>
                  <input
                    required
                    name="mainImage"
                    value={formData.mainImage}
                    onChange={handleChange}
                    placeholder="Paste main image URL here..."
                    className="flex-grow px-5 py-3 sm:h-12 sm:my-auto bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Gallery Images</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Or paste image URLs (comma separated)</label>
                    <textarea
                      name="images"
                      value={formData.images}
                      onChange={handleChange}
                      rows="2"
                      placeholder="url1, url2, url3..."
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm"
                    ></textarea>
                  </div>

                  {formData.uploadedImages && formData.uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {uploadedPreviews.map((p, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                          <img src={p.url} alt={p.file.name} className="w-full h-28 object-cover" />
                          <button type="button" onClick={() => removeUploadedImage(idx)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"> <X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Specifications - shown only for Mobiles category */}
          {formData.category === 'Mobiles' && (
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center space-x-3 text-sky-600 mb-2">
                <div className="p-2 bg-sky-50 rounded-lg"><Tag size={20} /></div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Mobile Specifications</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">📱</span><h4 className="font-semibold">Basic Information</h4></div>
                  <InputField label="Brand" name="basic.brand" value={formData.mobileSpecs.basic.brand} onChange={(e) => handleMobileSpecChange('basic', 'brand', e.target.value)} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <InputField label="Model Name" value={formData.mobileSpecs.basic.modelName} onChange={(e) => handleMobileSpecChange('basic', 'modelName', e.target.value)} />
                    <InputField label="Release Date" type="date" value={formData.mobileSpecs.basic.releaseDate} onChange={(e) => handleMobileSpecChange('basic', 'releaseDate', e.target.value)} />
                  </div>
                  <InputField label="Operating System" value={formData.mobileSpecs.basic.operatingSystem} onChange={(e) => handleMobileSpecChange('basic', 'operatingSystem', e.target.value)} className="mt-3" />
                </div>

                {/* Performance */}
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">⚙️</span><h4 className="font-semibold">Performance</h4></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Processor Brand" value={formData.mobileSpecs.performance.processorBrand} onChange={(e) => handleMobileSpecChange('performance', 'processorBrand', e.target.value)} />
                    <InputField label="CPU Model" value={formData.mobileSpecs.performance.cpuModel} onChange={(e) => handleMobileSpecChange('performance', 'cpuModel', e.target.value)} />
                    <InputField label="GPU" value={formData.mobileSpecs.performance.gpu} onChange={(e) => handleMobileSpecChange('performance', 'gpu', e.target.value)} />
                    <InputField label="Chipset" value={formData.mobileSpecs.performance.chipset} onChange={(e) => handleMobileSpecChange('performance', 'chipset', e.target.value)} />
                    <InputField label="RAM" value={formData.mobileSpecs.performance.ram} onChange={(e) => handleMobileSpecChange('performance', 'ram', e.target.value)} />
                    <InputField label="RAM Type" value={formData.mobileSpecs.performance.ramType} onChange={(e) => handleMobileSpecChange('performance', 'ramType', e.target.value)} />
                    <InputField label="Storage" value={formData.mobileSpecs.performance.storage} onChange={(e) => handleMobileSpecChange('performance', 'storage', e.target.value)} />
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="flex items-center"><input type="checkbox" checked={formData.mobileSpecs.performance.expandableStorage} onChange={(e) => handleMobileSpecChange('performance', 'expandableStorage', e.target.checked)} className="mr-2" />Expandable</label>
                      <InputField label="Max Expandable" value={formData.mobileSpecs.performance.maxExpandable} onChange={(e) => handleMobileSpecChange('performance', 'maxExpandable', e.target.value)} />
                    </div>
                    <InputField label="Cooling System" value={formData.mobileSpecs.performance.coolingSystem} onChange={(e) => handleMobileSpecChange('performance', 'coolingSystem', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Next rows: Display, Camera, Battery, Connectivity, Multimedia, Security, Design, Additional, Commercial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">📺</span><h4 className="font-semibold">Display</h4></div>
                  <InputField label="Screen Size" value={formData.mobileSpecs.display.screenSize} onChange={(e) => handleMobileSpecChange('display', 'screenSize', e.target.value)} />
                  <InputField label="Display Type" value={formData.mobileSpecs.display.displayType} onChange={(e) => handleMobileSpecChange('display', 'displayType', e.target.value)} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <InputField label="Resolution" value={formData.mobileSpecs.display.resolution} onChange={(e) => handleMobileSpecChange('display', 'resolution', e.target.value)} />
                    <InputField label="Refresh Rate" value={formData.mobileSpecs.display.refreshRate} onChange={(e) => handleMobileSpecChange('display', 'refreshRate', e.target.value)} />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">📷</span><h4 className="font-semibold">Camera</h4></div>
                  <InputField label="Rear Setup" value={formData.mobileSpecs.camera.rearSetup} onChange={(e) => handleMobileSpecChange('camera', 'rearSetup', e.target.value)} />
                  <InputField label="Rear Count" value={formData.mobileSpecs.camera.rearCount} onChange={(e) => handleMobileSpecChange('camera', 'rearCount', e.target.value)} />
                  <InputField label="Front Camera" value={formData.mobileSpecs.camera.frontCamera} onChange={(e) => handleMobileSpecChange('camera', 'frontCamera', e.target.value)} />
                  <InputField label="Flash" value={formData.mobileSpecs.camera.flashType} onChange={(e) => handleMobileSpecChange('camera', 'flashType', e.target.value)} className="mt-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">🔋</span><h4 className="font-semibold">Battery</h4></div>
                  <InputField label="Capacity (mAh)" value={formData.mobileSpecs.battery.capacity} onChange={(e) => handleMobileSpecChange('battery', 'capacity', e.target.value)} />
                  <InputField label="Type" value={formData.mobileSpecs.battery.type} onChange={(e) => handleMobileSpecChange('battery', 'type', e.target.value)} />
                  <InputField label="Charger" value={formData.mobileSpecs.battery.charger} onChange={(e) => handleMobileSpecChange('battery', 'charger', e.target.value)} className="mt-3" />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">🌐</span><h4 className="font-semibold">Connectivity</h4></div>
                  <InputField label="Network" value={formData.mobileSpecs.connectivity.network} onChange={(e) => handleMobileSpecChange('connectivity', 'network', e.target.value)} />
                  <InputField label="Sim Type" value={formData.mobileSpecs.connectivity.simType} onChange={(e) => handleMobileSpecChange('connectivity', 'simType', e.target.value)} />
                  <InputField label="GPS" value={formData.mobileSpecs.connectivity.gps} onChange={(e) => handleMobileSpecChange('connectivity', 'gps', e.target.value)} className="mt-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">🎵</span><h4 className="font-semibold">Multimedia</h4></div>
                  <InputField label="Speakers" value={formData.mobileSpecs.multimedia.speakers} onChange={(e) => handleMobileSpecChange('multimedia', 'speakers', e.target.value)} />
                  <InputField label="Audio Jack" value={formData.mobileSpecs.multimedia.audioJackType} onChange={(e) => handleMobileSpecChange('multimedia', 'audioJackType', e.target.value)} className="mt-3" />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">🔐</span><h4 className="font-semibold">Security</h4></div>
                  <InputField label="Fingerprint" value={formData.mobileSpecs.security.fingerprint} onChange={(e) => handleMobileSpecChange('security', 'fingerprint', e.target.value)} />
                  <InputField label="Face ID" value={formData.mobileSpecs.security.faceID} onChange={(e) => handleMobileSpecChange('security', 'faceID', e.target.value)} className="mt-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">📦</span><h4 className="font-semibold">Design & Build</h4></div>
                  <InputField label="Dimensions" value={formData.mobileSpecs.design.dimensions} onChange={(e) => handleMobileSpecChange('design', 'dimensions', e.target.value)} />
                  <InputField label="Weight (g)" value={formData.mobileSpecs.design.weightGrams} onChange={(e) => handleMobileSpecChange('design', 'weightGrams', e.target.value)} className="mt-3" />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center mb-3"><span className="font-bold mr-2">📊</span><h4 className="font-semibold">Additional Features</h4></div>
                  <InputField label="AI Features" value={formData.mobileSpecs.additional.aiFeatures} onChange={(e) => handleMobileSpecChange('additional', 'aiFeatures', e.target.value)} />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center mb-3"><span className="font-bold mr-2">💰</span><h4 className="font-semibold">Commercial Info</h4></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField label="SKU" value={formData.mobileSpecs.commercial.sku} onChange={(e) => handleMobileSpecChange('commercial', 'sku', e.target.value)} />
                  <InputField label="Warranty" value={formData.mobileSpecs.commercial.warranty} onChange={(e) => handleMobileSpecChange('commercial', 'warranty', e.target.value)} />
                  <InputField label="Origin" value={formData.mobileSpecs.commercial.origin} onChange={(e) => handleMobileSpecChange('commercial', 'origin', e.target.value)} />
                  <InputField label="Manufacturer" value={formData.mobileSpecs.commercial.manufacturer} onChange={(e) => handleMobileSpecChange('commercial', 'manufacturer', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Specifications, Shipping & Status */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Status & Options */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-amber-500 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg"><Zap size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Visibility & Status</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-700">Featured Product</span>
                </div>
                <input 
                  type="checkbox" 
                  name="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={handleChange}
                  className="w-6 h-6 rounded-md text-primary focus:ring-primary border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-700">Is New Arrival</span>
                </div>
                <input 
                  type="checkbox" 
                  name="isNewArrival" 
                  checked={formData.isNewArrival} 
                  onChange={handleChange}
                  className="w-6 h-6 rounded-md text-primary focus:ring-primary border-slate-300"
                />
              </label>
            </div>
          </div>

          {/* Logistics */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-blue-500 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg"><Truck size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Shipping Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Shipping Cost (PKR)</label>
                <input
                  type="number"
                  name="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Time</label>
                <input
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="e.g. 3-5 business days"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-purple-600 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg"><Maximize2 size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Variants</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Palette size={14} className="mr-2" /> Colors
                </label>
                <input
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Red, Blue, Black (comma separated)"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Box size={14} className="mr-2" /> Sizes / Options
                </label>
                <input
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="Small, Medium, Large (comma separated)"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 text-slate-600 mb-6">
              <div className="p-2 bg-slate-50 rounded-lg"><List size={20} /></div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Specifications</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">One per line (Format: Key:Value)</label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows="8"
                placeholder="Processor:Apple A17 Pro&#10;Memory:8GB RAM&#10;Display:LTPO Super Retina XDR"
                className="w-full px-5 py-4 bg-slate-900 text-green-400 font-mono text-sm border-none rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none shadow-inner"
              ></textarea>
            </div>
          </div>
        </div>
      </form>

      {/* Floating Action Button - full-width bar on mobile, floating pill on larger screens */}
      <div className="fixed bottom-0 inset-x-0 sm:bottom-10 sm:inset-x-auto sm:right-10 z-50 flex items-center flex-col-reverse sm:flex-row-reverse p-4 sm:p-0 bg-white/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-slate-100 sm:border-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex items-center justify-center space-x-3 sm:space-x-4 w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-2xl sm:rounded-full shadow-2xl shadow-primary/40 hover:bg-blue-700 sm:hover:scale-105 active:scale-95 transition-all font-black text-base sm:text-lg group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <Save size={22} className="group-hover:rotate-12 transition-transform" />
          )}
          <span>{isEditMode ? 'Save Global Update' : 'Publish Product'}</span>
        </button>
        <div className="mr-0 sm:mr-6 mb-2 sm:mb-0 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-xl hidden md:flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Global Sync Active</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;