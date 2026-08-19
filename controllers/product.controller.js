const { Product } = require("../models");
const sendResponse = require("../utils/response");

async function getProducts(req, res) {
  try {
    const products = await Product.findAll({
      order: [["id", "ASC"]],
    });

    return sendResponse(res, {
      message: "Berhasil mengambil produk",
      data: products,
    });

  } catch (error) {

    console.error(error);

    return sendResponse(res, {
      code: 500,
      success: false,
      message: "Gagal mengambil produk",
    });
  }
}


async function addProduct(req, res) {
  try {

    const {
      name,
      description,
      category,
      price,
      stock,
      image,
    } = req.body;

    if (!name || price === undefined) {

      return sendResponse(res, {
        code: 400,
        success: false,
        message: "Nama dan harga wajib diisi",
      });
    }

    const product = await Product.create({
      name,
      description,
      category: category || "Lainnya",
      price: Number(price),
      stock: Number(stock) || 0,
      image: image || null,
    });

    return sendResponse(res, {
      code: 201,
      message: "Produk berhasil ditambahkan",
      data: product,
    });

  } catch (error) {

    console.error(error);

    return sendResponse(res, {
      code: 500,
      success: false,
      message: error.message,
    });
  }
}


async function updateProduct(req, res) {

  try {

    const { id } = req.params;

    const {
      name,
      description,
      category,
      price,
      stock,
      image,
    } = req.body;

    const product =
      await Product.findByPk(id);

    if (!product) {

      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Produk tidak ditemukan",
      });
    }


    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (image !== undefined) {
      product.image = image;
    }


    await product.save();


    return sendResponse(res, {
      message: "Produk berhasil diperbarui",
      data: product,
    });

  } catch (error) {

    console.error(error);

    return sendResponse(res, {
      code: 500,
      success: false,
      message: error.message,
    });
  }
}


async function deleteProduct(req, res) {

  try {

    const { id } = req.params;

    const product =
      await Product.findByPk(id);

    if (!product) {

      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    await product.destroy();

    return sendResponse(res, {
      message: "Produk berhasil dihapus",
    });

  } catch (error) {

    console.error(error);

    return sendResponse(res, {
      code: 500,
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};