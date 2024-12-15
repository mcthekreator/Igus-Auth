import * as  jwt from "jsonwebtoken";

export const generateToken = (userId: number, userRole) => {
    return jwt.sign({ userId, userRole }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};
