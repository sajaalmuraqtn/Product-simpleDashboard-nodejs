import slugify from "slugify";
import ProductModel from "../../../../DB/model/product.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const getProducts = async (req, res) => {
   try {
       const products=await ProductModel.find(); 
    return res.status(201).json({ message: 'success', products });
   } catch (error) {
   return res.json({message:"cash Error",Error:error.stack});
   }
}

export const createProduct =async (req, res) => {
    try {
    const { price, discount } = req.body;
    const name = req.body.name.toLowerCase();
    if (await ProductModel.findOne({ name }).select('name')) {
        return res.json({message:"product title already exist"});
    }
    req.body.slug = slugify(name);
    
    req.body.finalPrice = (price - (price * (discount || 0) / 100)).toFixed(2);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/Products`
    })
    req.body.mainImage = { secure_url, public_id };
    console.log(req.body.mainImage);
    
    
    const newProduct = await ProductModel.create(req.body);
    if (!newProduct) {
       return res.json({message:"error while creat product"});
    }
    return res.status(201).json({ message: 'success', newProduct });
} catch (error) {
    return res.json({message:"cash Error",Error:error.stack});
    }
}

export const getSpecificProduct = async (req, res, next) => {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
        return res.json({message:"product not found"});
    }
    return res.status(201).json({ message: 'success', product});
}

export const updateProduct = async (req, res) => {
    try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
        return res.json({message:"product not found"});
    }
    
    if (req.body.name) {
        const name = req.body.name.toLowerCase();
        if (await ProductModel.findOne({ name }).select('name')) {
            return res.json({message:"product title already exist"});
        }
        product.name = name;
        product.slug = slugify(name);
    }
    if (req.body.description) {
        product.description = req.body.description;
    }

    if (req.body.price) {
        product.price = req.body.price;
        product.finalPrice = (req.body.price - (req.body.price * (product.discount || 0) / 100)).toFixed(2);
    }

    if (req.body.discount) {
        product.discount = req.body.discount;
        product.finalPrice = (product.price - (product.price * (req.body.discount || 0) / 100)).toFixed(2);
    }
   
    if (req.body.status) {
        product.status = req.body.status;
    }
           
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/Products`
        })
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        product.mainImage = { secure_url, public_id };
    }
    
    await product.save()
    return res.status(201).json({ message: 'success', product });
} catch (error) {
    return res.json({message:"cash Error",Error:error.stack});
}
}


export const deleteProduct = async (req, res, next) => {
    const ProductDeleted = await ProductModel.findByIdAndDelete(req.params.productId);
    if (!ProductDeleted) {
        return res.json({message:"product not found"});
    }
    await cloudinary.uploader.destroy(ProductDeleted.mainImage.public_id);
    return res.status(201).json({ message: 'success', ProductDeleted});
}