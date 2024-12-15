import { NextFunction, Request, Response } from 'express';
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../config/dataSoruce";
import { generateToken } from "../utils/generateToken";
import { UserData } from '../entities/User';
import { Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret = process.env.JWT_SECRET;


export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const { email, password, role } = req.body;

      if (!email || !password) {
         res.status(400).json({ message: "Email and password are required" });
         return;
      }

      const repository = AppDataSource.getRepository(UserData);
      const user = await repository.createQueryBuilder("user")
         .where("user.email = :email", { email })
         .getOne();

      if (user) {
         res.status(400).json({ message: `User with email ${email} already exists` });
         return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = repository.create({
         email,
         password: hashedPassword,
         role,
         createdAt: new Date(),
      });

      await repository.save(newUser);

      res.status(201).json({
         message: "User registered successfully",
         user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
         },
      });
   } catch (err) {
      console.error("Error during registration:", err);
      next(err);
   }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({ message: "Email and password are required" });
         return;
      }

      const repository = AppDataSource.getRepository(UserData);
      const user = await repository.findOne({ where: { email } });

      if (!user) {
         res.status(400).json({ message: "Invalid Credentials" });
         return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
         res.status(400).json({ message: "Invalid Password" });
         return;
      }

      const token = generateToken(user.id, user.role);

      res.status(200).json({
         message: "Login successful",
         user: {
            id: user.id,
            email: user.email,
            role: user.role,
         },
         token,
      });
   } catch (error) {
      console.error("Error during login:", error);
      next(error);
   }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const repository = AppDataSource.getRepository(UserData);
      const users = await repository.find();

      if (users.length === 0) {
         res.status(404).json({ message: "No users found" });
         return;
      }
      res.status(200).json({
         message: "Users retrieved successfully",
         users: users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
         })),
      });
   } catch (err) {
      console.error("Error during fetching users:", err);
      next(err);
   }
};
