import { NextFunction, Request, Response } from 'express';
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../config/dataSoruce";
import { generateToken } from "../utils/generateToken";
import { UserData } from '../entities/User';
import { Secret } from "jsonwebtoken";
import * as jwt from 'jsonwebtoken';

export const SECRET_KEY: Secret = process.env.JWT_SECRET;

// Register function (unchanged)
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

// Login function (unchanged)
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

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const { email } = req.body;

      if (!email) {
         res.status(400).json({ message: "Email is required" });
         return;
      }

      const repository = AppDataSource.getRepository(UserData);

      // Check if user exists with the given email
      const user = await repository.findOne({ where: { email } });

      if (!user) {
         res.status(404).json({ message: "User with the given email does not exist" });
         return;
      }

      // Generate a reset token
      const resetToken = generateToken(user.id, "1h"); // Example: token expires in 1 hour
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

      await repository.save(user);

      res.status(200).json({
         message: "Password reset token generated successfully. Use this token to reset your password.",
         resetToken, // In real-world scenarios, do not send the token in the response; email it instead.
      });
   } catch (err) {
      console.error("Error requesting password reset:", err);
      next(err);
   }
};


export const resetPassword = async (
   req: Request,
   res: Response,
   next: NextFunction
 ): Promise<void> => {
   try {
     const { token, newPassword } = req.body;
 
     if (!token || !newPassword) {
       res.status(400).json({ message: "Token and new password are required." });
       return;
     }
 
     const repository = AppDataSource.getRepository(UserData);
 
     // Decode and verify the token
     let payload;
     try {
       payload = jwt.verify(token, SECRET_KEY);
     } catch (err) {
       res.status(400).json({ message: "Invalid or expired reset token." });
       return;
     }
 
     // Find the user by ID from the token
     const user = await repository.findOne({ where: { id: payload.id } });
 
     if (!user || user.resetPasswordToken !== token) {
       res.status(400).json({ message: "Invalid reset token or user not found." });
       return;
     }
 
     // Check if the reset token is expired
     if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
       res.status(400).json({ message: "Reset token has expired." });
       return;
     }
 
     // Hash the new password
     const hashedPassword = await bcrypt.hash(newPassword, 10);
 
     // Update the user's password and clear reset token fields
     user.password = hashedPassword;
     user.resetPasswordToken = null;
     user.resetPasswordExpires = null;
 
     await repository.save(user);
 
     res.status(200).json({
       message: "Password reset successfully. You can now log in with your new password."
     });
   } catch (err) {
     console.error("Error resetting password:", err);
     next(err);
   }
 };
 