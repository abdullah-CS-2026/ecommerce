const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      if (item.productId) {
        total += item.productId.discountPrice * item.quantity;
      }
    });

    res.json({ cart, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    
    // Repopulate for client
    cart = await Cart.findById(cart._id).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }
    
    cart = await Cart.findById(cart._id).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    
    cart = await Cart.findById(cart._id).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};
