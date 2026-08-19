require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const { sequelize } = require('./models');

const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const pageRoutes = require('./routes/page.routes');

const app = express();

const PORT = Number(process.env.PORT) || 3000;

// ========================================
// VIEW ENGINE
// ========================================

app.set('view engine', 'ejs');

app.set(
  'views',
  path.join(__dirname, 'views')
);

// ========================================
// STATIC FILES
// ========================================

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// SESSION
// ========================================

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'secret-default',

    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);

// ========================================
// ROUTES
// ========================================

app.use(
  '/api/admin',
  adminRoutes
);

app.use(
  '/api/products',
  productRoutes
);

app.use(
  '/',
  pageRoutes
);

// ========================================
// START SERVER
// ========================================

async function start() {
  try {
    // Cek koneksi database
    await sequelize.authenticate();

    console.log(
      'Koneksi database berhasil'
    );

    // Sinkronisasi model
    await sequelize.sync({
      alter: true,
    });

    console.log(
      'Sync model selesai'
    );

    // Jalankan server
    app.listen(PORT, () => {
      console.log(
        `Server jalan di http://localhost:${PORT}`
      );
    });

  } catch (err) {
    console.error(
      'Gagal menjalankan aplikasi:'
    );

    console.error(err.message);

    process.exit(1);
  }
}

start();