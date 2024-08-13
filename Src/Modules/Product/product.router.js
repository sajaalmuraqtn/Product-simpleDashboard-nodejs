import { Router } from "express";
import * as ProductController from './Controller/product.controller.js'
 import fileUpload, { fileValidation } from "../../Services/multer.js";

const router = Router()
router.get('/',ProductController.getProducts);
router.get('/:productId', ProductController.getSpecificProduct);
router.post('/',fileUpload(fileValidation.image).single('mainImage'),ProductController.createProduct);
router.put('/:productId',fileUpload(fileValidation.image).single('mainImage'), ProductController.updateProduct);
router.delete('/delete/:productId',ProductController.deleteProduct);
export default router;