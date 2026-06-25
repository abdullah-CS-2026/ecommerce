require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const migrateProducts = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check...`);

    for (let product of products) {
      let changed = false;
      
      // Use direct object access for fields not in new schema but in raw doc
      const rawDoc = product.toObject({ virtuals: false });

      if (rawDoc.title && !product.name) {
        product.name = rawDoc.title;
        changed = true;
      }
      
      if (rawDoc.imageUrl && !product.mainImage) {
        product.mainImage = rawDoc.imageUrl;
        changed = true;
      }

      if (product.originalPrice === undefined) {
        product.originalPrice = product.discountPrice || 0;
        changed = true;
      }

      if (product.price === undefined || product.price === 0) {
        product.price = product.discountPrice || 0;
        changed = true;
      }

      if (!product.currency) {
        product.currency = 'PKR';
        changed = true;
      }

      if (changed) {
        // We use findOneAndUpdate to bypass some validation if necessary, 
        // or just save if we can. 
        // But since we are updating to a new schema, we might need to use 
        // collection.updateOne to be safe with renamed fields.
        await mongoose.connection.collection('products').updateOne(
          { _id: product._id },
          { 
            $set: { 
              name: product.name || rawDoc.title,
              mainImage: product.mainImage || rawDoc.imageUrl,
              originalPrice: product.originalPrice,
              price: product.price,
              currency: product.currency,
              isNewArrival: rawDoc.isNew !== undefined ? rawDoc.isNew : true
            },
            $unset: { title: "", imageUrl: "", isNew: "" }
          }
        );
        console.log(`Migrated product: ${product._id}`);
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateProducts();
