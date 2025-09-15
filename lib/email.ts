import nodemailer, { Transporter } from "nodemailer"

interface Order {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
  totalPrice: number
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    phone: string
  }
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: Date
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderConfirmationEmail(order: Order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured, skipping order confirmation email")
    return
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@Laptop House.com",
    to: order.user.email,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmation</h1>
        <p>Dear ${order.user.name},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice.toLocaleString()}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${order.orderItems
            .map(
              (item: any) => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: ₹${item.price.toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
        </div>

        <div style="margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>${order.shippingAddress.fullName}</p>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
          <p>Phone: ${order.shippingAddress.phone}</p>
        </div>

        <p>You can track your order status by logging into your account on our website.</p>
        <p>Thank you for choosing Laptop House!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated email. Please do not reply to this email.</p>
          <p>© 2024 Laptop House. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
  }
}

export async function sendOrderStatusEmail(order: Order, status: 'confirmed' | 'processing' | 'shipped' | 'delivered') {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured, skipping status update email")
    return
  }

  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is now being processed and will be shipped soon.",
    shipped: "Great news! Your order has been shipped and is on its way to you.",
    delivered: "Your order has been delivered successfully. Thank you for shopping with us!",
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@Laptop House.com",
    to: order.user.email,
    subject: `Order Update - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Status Update</h1>
        <p>Dear ${order.user.name},</p>
        <p>${statusMessages[status as keyof typeof statusMessages] || "Your order status has been updated."}</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ""}
          ${order.carrier ? `<p><strong>Carrier:</strong> ${order.carrier}</p>` : ""}
          ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ""}
        </div>

        <p>You can track your order status by logging into your account on our website.</p>
        <p>Thank you for choosing Laptop House!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated email. Please do not reply to this email.</p>
          <p>© 2024 Laptop House. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Failed to send order status email:", error)
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured, skipping password reset email")
    return
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@Laptop House.com",
    to: email,
    subject: "Password Reset Request - Laptop House",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>You have requested to reset your password for your Laptop House account.</p>
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
        
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated email. Please do not reply to this email.</p>
          <p>© 2024 Laptop House. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Failed to send password reset email:", error)
  }
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured, skipping contact email")
    return
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@Laptop House.com",
    to: "support@Laptop House.com",
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Contact Form Submission</h1>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Contact Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Message:</h3>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This message was sent from the Laptop House contact form.</p>
          <p>Reply directly to this email to respond to the customer.</p>
        </div>
      </div>
    `,
    replyTo: email,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Failed to send contact email:", error)
  }
}
