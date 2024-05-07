const router = require("express").Router();
const Product = require("../models/poductModel");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("../config/clpudinaryConfig");
const multer = require("multer");
const User = require("../models/userModel");
const Notification = require("../models/notificationsModel");
// add new products
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const newProducts = new Product(req.body);
    await newProducts.save();

    // send notification to admin
    const admins = await User.find({ role: "admin" });

    admins.forEach(async () => {
      const newNotification = new Notification({
        user: admin._id,
        message: `New product add by ${req.user.name}`,
        title: "New product",
        onClick: `/admin`,
        read: false,
      });
      await newNotification.save();
    });
    res.send({
      success: true,
      message: "products added Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all the products
router.post("/get-products", async (req, res) => {
  try {
    const { seller, category = [], age = [], status } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }

    // filter by category
    if (category.length > 0) {
      filters.category = { $in: category };
    }

    // filter by Age
    if (age.length > 0) {
      age.forEach((item) => {
        const fromAge = item.split("-")[0];
        const toAge = item.split("-")[1];
        filters.age = { $gte: fromAge, $lte: toAge };
      });
    }
    const products = await Product.find(filters)
      .populate("seller")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get-product-by-id
router.get("/get-product-by-id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product Updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get image from pc
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
router.post(
  "/upload-image-to-product",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "sheymp",
      });
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { image: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

/// update product status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      status,
    });

    //send notifiication to seller
    const newNotification = new Notification({
      user: updatedProduct.seller,
      message: `Your product ${updatedProduct.name} has been ${status}`,
      title: "Product Status Updated",
      onClick: `/profile`,
      read: false,
    });
    await newNotification.save();
    res.send({
      success: true,
      message: "Product status update successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
