import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address." });

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
  quantity: z.number().int().positive("Quantity must be at least 1."),
  price: z.number().nonnegative("Price must be non-negative.")
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  email: emailSchema,
  phone: z.string().trim().min(7, "Phone number is required."),
  address: z.string().trim().min(5, "Address is required."),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  country: z.string().trim().min(2, "Country is required."),
  postalCode: z.string().trim().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required."),
  deliveryMethod: z.enum(["standard", "express"]).optional(),
  paymentMethod: z.string().trim().optional()
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: emailSchema,
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters.")
});

export const newsletterSchema = z.object({
  email: emailSchema
});

export const paymentInitializeSchema = z.object({
  email: emailSchema,
  amount: z.number().positive("Amount must be a positive number."),
  orderId: z.string().trim().min(1, "Order ID is required."),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
});

export const paymentVerifySchema = z.object({
  reference: z.string().trim().min(1, "Reference is required."),
  orderId: z.string().trim().optional()
});

export const tailoringSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: emailSchema,
  phone: z.string().trim().min(7, "Phone number is required."),
  outfitType: z.string().trim().optional().or(z.literal("")),
  styleReference: z.string().trim().optional().or(z.literal("")),
  fabric: z.string().trim().optional().or(z.literal("")),
  fit: z.string().trim().optional().or(z.literal("")),
  gender: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  preferredDeliveryDate: z.string().trim().optional().or(z.literal("")),
  measurements: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string()).optional(),
  budget: z.string().trim().optional().or(z.literal("")),
  occasion: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal(""))
});

export function formatZodIssues(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path[0]?.toString() ?? "root";
    acc[key] = issue.message;
    return acc;
  }, {});
}
