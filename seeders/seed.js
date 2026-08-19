require('dotenv').config();

const bcrypt = require('bcrypt');

const {
  sequelize,
  Admin,
  Product
} = require('../models');


const SALT_ROUNDS = 10;


// ======================================================
// PRODUCTS
// ======================================================

const products = [

  // ================================
  // FASHION
  // ================================

  {
    name: 'Kaos Polos Cotton Combed',
    description: 'Kaos premium bahan cotton combed yang adem dan nyaman digunakan sehari-hari.',
    price: 75000,
    stock: 50
  },

  {
    name: 'Kemeja Flanel',
    description: 'Kemeja flanel motif kotak dengan bahan lembut dan nyaman.',
    price: 150000,
    stock: 25
  },

  {
    name: 'Celana Chino Slim Fit',
    description: 'Celana chino slim fit dengan bahan stretch dan desain modern.',
    price: 180000,
    stock: 20
  },

  {
    name: 'Sepatu Sneakers Canvas',
    description: 'Sneakers canvas ringan untuk gaya kasual sehari-hari.',
    price: 220000,
    stock: 30
  },

  {
    name: 'Topi Baseball',
    description: 'Topi baseball adjustable dengan desain minimalis.',
    price: 45000,
    stock: 0
  },

  {
    name: 'Jaket Bomber',
    description: 'Jaket bomber premium dengan bahan tebal dan hangat.',
    price: 250000,
    stock: 15
  },

  {
    name: 'Hoodie Premium',
    description: 'Hoodie premium dengan bahan fleece lembut dan nyaman.',
    price: 185000,
    stock: 20
  },

  {
    name: 'Sweater Rajut',
    description: 'Sweater rajut stylish untuk digunakan saat cuaca dingin.',
    price: 165000,
    stock: 12
  },

  {
    name: 'Kaos Oversize',
    description: 'Kaos oversize dengan potongan modern dan bahan cotton.',
    price: 95000,
    stock: 35
  },

  {
    name: 'Cargo Pants',
    description: 'Celana cargo dengan banyak kantong dan desain streetwear.',
    price: 210000,
    stock: 18
  },

  {
    name: 'Sandal Casual',
    description: 'Sandal casual ringan dengan desain nyaman untuk aktivitas harian.',
    price: 85000,
    stock: 25
  },

  {
    name: 'Sepatu Running Sport',
    description: 'Sepatu olahraga ringan dengan bantalan nyaman untuk berlari.',
    price: 325000,
    stock: 10
  },


  // ================================
  // ACCESSORIES
  // ================================

  {
    name: 'Jam Tangan Classic',
    description: 'Jam tangan dengan desain klasik dan elegan.',
    price: 275000,
    stock: 15
  },

  {
    name: 'Tas Backpack Urban',
    description: 'Tas backpack modern dengan ruang laptop dan banyak kompartemen.',
    price: 225000,
    stock: 18
  },

  {
    name: 'Kacamata Fashion',
    description: 'Kacamata fashion dengan frame modern dan ringan.',
    price: 125000,
    stock: 25
  },

  {
    name: 'Dompet Kulit',
    description: 'Dompet kulit sintetis premium dengan desain minimalis.',
    price: 95000,
    stock: 30
  },

  {
    name: 'Ikat Pinggang Kulit',
    description: 'Ikat pinggang dengan desain klasik yang cocok untuk berbagai outfit.',
    price: 85000,
    stock: 22
  },


  // ================================
  // ELECTRONICS
  // ================================

  {
    name: 'Headphone Wireless',
    description: 'Headphone wireless dengan suara jernih dan baterai tahan lama.',
    price: 450000,
    stock: 12
  },

  {
    name: 'Smartphone Pro Max',
    description: 'Smartphone modern dengan layar besar dan performa tinggi.',
    price: 8999000,
    stock: 8
  },

  {
    name: 'Laptop Ultrabook',
    description: 'Laptop tipis dan ringan untuk bekerja, kuliah, dan produktivitas.',
    price: 11500000,
    stock: 6
  },

  {
    name: 'Smartwatch Series 9',
    description: 'Smartwatch modern untuk aktivitas dan produktivitas sehari-hari.',
    price: 1250000,
    stock: 10
  },

  {
    name: 'Keyboard Mechanical RGB',
    description: 'Keyboard mechanical RGB dengan switch responsif.',
    price: 650000,
    stock: 15
  },

  {
    name: 'Mouse Gaming',
    description: 'Mouse gaming ergonomis dengan sensor presisi tinggi.',
    price: 350000,
    stock: 20
  },

  {
    name: 'Speaker Bluetooth',
    description: 'Speaker Bluetooth portable dengan suara powerful.',
    price: 425000,
    stock: 15
  },

  {
    name: 'Kamera Digital',
    description: 'Kamera digital untuk fotografi dan dokumentasi berkualitas.',
    price: 6250000,
    stock: 5
  },


  // ================================
  // HOME & LIFESTYLE
  // ================================

  {
    name: 'Tumbler Stainless',
    description: 'Tumbler stainless steel dengan desain modern dan tahan panas.',
    price: 120000,
    stock: 30
  },

  {
    name: 'Botol Minum Sport',
    description: 'Botol minum olahraga ringan dan mudah dibawa.',
    price: 75000,
    stock: 40
  },

  {
    name: 'Mug Keramik Minimalis',
    description: 'Mug keramik minimalis untuk kopi dan minuman favorit.',
    price: 65000,
    stock: 30
  },

  {
    name: 'Lampu Meja LED',
    description: 'Lampu meja LED dengan desain minimalis dan hemat energi.',
    price: 175000,
    stock: 15
  },

  {
    name: 'Bantal Sofa Premium',
    description: 'Bantal sofa lembut untuk membuat ruangan semakin nyaman.',
    price: 90000,
    stock: 20
  },

  {
    name: 'Jam Dinding Minimalis',
    description: 'Jam dinding minimalis untuk dekorasi rumah modern.',
    price: 135000,
    stock: 10
  }

];


// ======================================================
// SEED
// ======================================================

async function seed() {

  try {

    await sequelize.authenticate();

    console.log(
      'Koneksi database berhasil'
    );


    await sequelize.sync();


    // ==================================================
    // ADMIN
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        'admin123',
        SALT_ROUNDS
      );


    const [admin] =
      await Admin.findOrCreate({

        where: {
          username: 'admin'
        },

        defaults: {

          password:
            hashedPassword

        }

      });


    console.log(
      'Admin siap:',
      admin.username
    );


    // ==================================================
    // PRODUCT
    // ==================================================

    const existingProducts =
      await Product.count();


    if (existingProducts === 0) {

      await Product.bulkCreate(
        products
      );

      console.log(
        `Berhasil menambahkan ${products.length} produk.`
      );

    } else {

      console.log(
        `Database sudah memiliki ${existingProducts} produk.`
      );

      console.log(
        'Seed produk dilewati agar tidak terjadi duplikasi.'
      );

    }


    console.log('\nSeeding selesai ✅');

    console.log(
      'Login admin: username=admin password=admin123'
    );


    process.exit(0);

  } catch (error) {

    console.error(
      'Gagal seeding:',
      error
    );

    process.exit(1);

  }

}


seed();