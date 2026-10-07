import { Router } from "express";
import { ProductController } from "../controllers/products.controller";

const productController = new ProductController();
const router = Router();

router.get('/getAll', productController.getAll);
router.get('/getById/:id', productController.getById);
router.post('/create', productController.create);
router.put('/update/:id', productController.update);
router.delete('/delete/:id', productController.delete);
router.patch('/change-price/:id', productController.changePrice);

export default router;