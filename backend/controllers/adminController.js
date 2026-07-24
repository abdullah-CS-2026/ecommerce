
const Product = require("../models/Product");
const Order = require("../models/Order");
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name mainImage')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};



exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      isFeatured,
      isNewArrival,
      search,
      sort,
      page = 1,
      limit = 5,
    } = req.query;

    let query = {};

    if (category && category !== "All") query.category = category;
    if (brand) query.brand = brand;
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (isNewArrival) query.isNewArrival = isNewArrival === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const totalProducts = await Product.countDocuments(query);

    let productsQuery = Product.find(query)
      .skip(skip)
      .limit(limitNumber);

    // Sorting
    if (sort === "priceLowToHigh")
      productsQuery = productsQuery.sort({ discountPrice: 1 });
    else if (sort === "priceHighToLow")
      productsQuery = productsQuery.sort({ discountPrice: -1 });
    else if (sort === "popularity")
      productsQuery = productsQuery.sort({ numReviews: -1 });
    else
      productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery.lean();

    res.json({
      products,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};
