import type { Request, Response } from "express";
import { pool } from "../conf/dbConnection";

export class ProductController {
    
    private isValidId(id: any): boolean {
        const parsedId = Number(id);
        return Number.isInteger(parsedId) && parsedId > 0;
    }

    private isValidPrice(price: any): boolean {
        const parsedPrice = Number(price);
        return !isNaN(parsedPrice) && parsedPrice > 0;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const [rows] = await pool.query('SELECT * FROM products WHERE active = TRUE');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!this.isValidId(id)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }

        try {
            const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);
            if (rows.length === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, price, stock, description, brand, img } = req.body;

        if (!name || !price || stock === undefined || !description) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (!this.isValidPrice(price)) {
            res.status(400).json({ message: "Price must be a number greater than 0" });
            return;
        }

        try {
            const [result]: any = await pool.query(
                'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
                [name, price, stock, description, brand || null, img || null]
            );
            res.status(201).json({ message: "Product created", insertId: result.insertId });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, price, stock, description, brand, img } = req.body;

        if (!this.isValidId(id)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }
        if (!name || !price || stock === undefined || !description) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (!this.isValidPrice(price)) {
            res.status(400).json({ message: "Price must be a number greater than 0" });
            return;
        }

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
                [name, price, stock, description, brand || null, img || null, id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.json({ message: "Product updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!this.isValidId(id)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
                [id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or already inactive" });
                return;
            }
            res.json({ message: "Product deactivated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    changePrice = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { price } = req.body;

        if (!this.isValidId(id)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }
        if (!price || !this.isValidPrice(price)) {
            res.status(400).json({ message: "A valid price greater than 0 is required" });
            return;
        }

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
                [price, id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.json({ message: "Product price updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}