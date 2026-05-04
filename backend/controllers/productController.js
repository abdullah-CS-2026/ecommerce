const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, brand, isFeatured, isNewArrival, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (brand) query.brand = brand;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sort === 'priceLowToHigh') productsQuery = productsQuery.sort({ discountPrice: 1 });
    else if (sort === 'priceHighToLow') productsQuery = productsQuery.sort({ discountPrice: -1 });
    else if (sort === 'popularity') productsQuery = productsQuery.sort({ numReviews: -1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery.lean();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('📥 Received request body:', req.body);
    console.log('📥 Received files:', req.files);

    let productData = { 
      ...req.body, 
      createdBy: req.user._id 
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const uploadedImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      // If there are uploaded images and no mainImage set, use the first one
      if (!productData.mainImage && uploadedImagePaths.length > 0) {
        productData.mainImage = uploadedImagePaths[0];
      }
      // Add uploaded images to the images array
      const existingImages = productData.images ? 
        (Array.isArray(productData.images) ? productData.images : JSON.parse(productData.images)) : [];
      productData.images = [...uploadedImagePaths, ...existingImages];
    }

    console.log('📥 Product data after file handling:', productData);

    // Parse JSON strings if they come from FormData
    if (typeof productData.colors === 'string' && productData.colors !== '') {
      try {
        productData.colors = JSON.parse(productData.colors);
      } catch (e) {
        productData.colors = productData.colors.split(',').map(c => c.trim()).filter(c => c !== '');
      }
    }
    
    if (typeof productData.sizes === 'string' && productData.sizes !== '') {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {
        productData.sizes = productData.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    }
    
    if (typeof productData.specifications === 'string' && productData.specifications !== '') {
      try {
        productData.specifications = JSON.parse(productData.specifications);
      } catch (e) {
        productData.specifications = [];
      }
    }
    
    if (typeof productData.mobileSpecs === 'string' && productData.mobileSpecs !== '') {
      try {
        productData.mobileSpecs = JSON.parse(productData.mobileSpecs);
      } catch (e) {
        productData.mobileSpecs = null;
      }
    }

    // Convert string type values to proper types
    if (productData.price !== undefined) productData.price = Number(productData.price);
    if (productData.originalPrice !== undefined) productData.originalPrice = Number(productData.originalPrice);
    if (productData.discountPrice !== undefined) productData.discountPrice = Number(productData.discountPrice);
    if (productData.countInStock !== undefined) productData.countInStock = Number(productData.countInStock);
    if (productData.shippingCost !== undefined) productData.shippingCost = Number(productData.shippingCost);
    if (productData.isFeatured !== undefined) productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
    if (productData.isNewArrival !== undefined) productData.isNewArrival = productData.isNewArrival === 'true' || productData.isNewArrival === true;

    // Convert specifications array/lines to object if needed
    if (Array.isArray(productData.specifications)) {
      const specObj = {};
      productData.specifications.forEach(spec => {
        if (typeof spec === 'string') {
          const [key, value] = spec.split(':').map(s => s.trim());
          if (key && value) specObj[key] = value;
        }
      });
      productData.specifications = specObj;
    }

    console.log('📥 Final product data to save:', productData);

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('❌ Product creation error:', error);
    const messages = [];
    if (error.errors) {
      Object.keys(error.errors).forEach(field => {
        messages.push(`${field}: ${error.errors[field].message}`);
      });
    }
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message,
      details: messages.length > 0 ? messages : undefined
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Handle uploaded images
      if (req.files && req.files.length > 0) {
        const uploadedImagePaths = req.files.map(file => `/uploads/${file.filename}`);
        // Add uploaded images to existing images
        const existingImages = product.images || [];
        product.images = [...uploadedImagePaths, ...existingImages];
      }

      let updateData = { ...req.body };

      // Parse JSON strings if they come from FormData
      if (typeof updateData.colors === 'string' && updateData.colors !== '') {
        try {
          updateData.colors = JSON.parse(updateData.colors);
        } catch (e) {
          updateData.colors = updateData.colors.split(',').map(c => c.trim()).filter(c => c !== '');
        }
      }
      
      if (typeof updateData.sizes === 'string' && updateData.sizes !== '') {
        try {
          updateData.sizes = JSON.parse(updateData.sizes);
        } catch (e) {
          updateData.sizes = updateData.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
        }
      }
      
      if (typeof updateData.specifications === 'string' && updateData.specifications !== '') {
        try {
          updateData.specifications = JSON.parse(updateData.specifications);
        } catch (e) {
          updateData.specifications = [];
        }
      }
      
      if (typeof updateData.mobileSpecs === 'string' && updateData.mobileSpecs !== '') {
        try {
          updateData.mobileSpecs = JSON.parse(updateData.mobileSpecs);
        } catch (e) {
          updateData.mobileSpecs = null;
        }
      }

      // Convert string type values to proper types
      if (updateData.price !== undefined) updateData.price = Number(updateData.price);
      if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
      if (updateData.discountPrice !== undefined) updateData.discountPrice = Number(updateData.discountPrice);
      if (updateData.countInStock !== undefined) updateData.countInStock = Number(updateData.countInStock);
      if (updateData.shippingCost !== undefined) updateData.shippingCost = Number(updateData.shippingCost);

      // Handle specifications transformation if needed
      if (updateData.specifications && Array.isArray(updateData.specifications)) {
        const specObj = {};
        updateData.specifications.forEach(spec => {
          if (typeof spec === 'string') {
            const [key, value] = spec.split(':').map(s => s.trim());
            if (key && value) specObj[key] = value;
          }
        });
        updateData.specifications = specObj;
      }

      // Update fields
      Object.assign(product, updateData);

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// ... keep existing CSV export/import logic but adapted if necessary ...
// For now focusing on core CRUD with new schema.
