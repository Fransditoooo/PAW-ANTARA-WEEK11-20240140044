const { Product } = require('../models');

// ======================================================
// DATABASE IMAGE MAP
// ======================================================

const productImages = {
  // Fashion
  'Kaos Polos Cotton Combed':
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',

  'Kemeja Flanel':
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85',

  'Celana Chino Slim Fit':
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85',

  'Sepatu Sneakers Canvas':
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',

  'Topi Baseball':
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85',

  'Jaket Bomber':
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85',

  'Hoodie Premium':
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85',

  'Sweater Rajut':
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85',

  'Kaos Oversize':
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85',

  'Cargo Pants':
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',

  'Sandal Casual':
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=85',

  'Sepatu Running Sport':
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=85',

  // Accessories
  'Jam Tangan Classic':
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',

  'Tas Backpack Urban':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',

  'Kacamata Fashion':
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85',

  'Dompet Kulit':
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85',

  'Ikat Pinggang Kulit':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',

  // Electronics
  'Headphone Wireless':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',

  'Smartphone Pro Max':
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85',

  'Laptop Ultrabook':
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',

  'Smartwatch Series 9':
    'https://images.unsplash.com/photo-1546868871-7041f2a55e50?auto=format&fit=crop&w=800&q=85',

  'Keyboard Mechanical RGB':
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',

  'Mouse Gaming':
    'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=85',

  'Speaker Bluetooth':
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85',

  'Kamera Digital':
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85',

  // Home
  'Tumbler Stainless':
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',

  'Botol Minum Sport':
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',

  'Mug Keramik Minimalis':
    'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=800&q=85',

  'Lampu Meja LED':
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',

  'Bantal Sofa Premium':
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',

  'Jam Dinding Minimalis':
    'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=85'
};

// ======================================================
// FALLBACK IMAGE
// ======================================================

const fallbackImage =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=85';

// ======================================================
// RENDER HOME
// ======================================================

async function renderHome(req, res) {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });

    const mappedProducts = products.map((product) => {
      const data = product.toJSON();

      return {
        ...data,

        image:
          productImages[data.name] ||
          fallbackImage
      };
    });

    const storeName =
      process.env.STORE_NAME || 'Toko Kita';

    res.render('index', {
      products: mappedProducts,
      storeName
    });

  } catch (err) {
    console.error('Render home error:', err);

    res.status(500).send(
      'Gagal memuat halaman: ' + err.message
    );
  }
}

module.exports = {
  renderHome
};