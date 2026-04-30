import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 32px; text-align: center; }
    .header h1 { color: #f59e0b; margin: 0; font-size: 28px; letter-spacing: 1px; }
    .header p { color: #94a3b8; margin: 6px 0 0; font-size: 13px; }
    .body { padding: 36px 32px; color: #1e293b; }
    .body h2 { font-size: 20px; margin-bottom: 8px; }
    .body p { color: #475569; line-height: 1.7; font-size: 15px; }
    .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #f59e0b; color: #0f172a; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 15px; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-confirmed { background: #d1fae5; color: #065f46; }
    .order-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .order-table th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; }
    .order-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .total-row td { font-weight: 700; color: #0f172a; border-top: 2px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🛒 ShopZone</h1>
      <p>Your trusted online store</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopZone. All rights reserved.</p>
      <p>You received this email because you have an account with us.</p>
    </div>
  </div>
</body>
</html>
`;

// ===== Verification Email =====
export async function sendVerificationEmail(email, name, token) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/users/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your ShopZone account",
        html: baseTemplate(`
      <h2>Hi ${name} 👋</h2>
      <p>Thanks for signing up! Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" class="btn">Verify Email Address</a>
      <hr class="divider"/>
      <p style="font-size:13px; color:#94a3b8;">
        This link expires in 24 hours. If you didn't create an account, you can ignore this email.
      </p>
    `),
    });
}

// ===== Order Confirmation Email =====
export async function sendOrderConfirmationEmail(email, order) {
    const itemsRows = order.items
        .map(
            (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>EGP ${item.price.toFixed(2)}</td>
        <td>EGP ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
        )
        .join("");

    await transporter.sendMail({
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
        html: baseTemplate(`
      <h2>Order Confirmed! 🎉</h2>
      <p>Your order has been placed successfully. Here's your summary:</p>

      <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
      <p><strong>Status:</strong> <span class="badge badge-confirmed">Confirmed</span></p>
      <p><strong>Payment:</strong> ${order.paymentMethod.replace(/_/g, " ").toUpperCase()}</p>

      <table class="order-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <td colspan="3">Shipping</td>
            <td>EGP ${order.shippingCost.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td>EGP ${order.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <hr class="divider"/>
      <p><strong>Shipping to:</strong><br/>
        ${order.shippingAddress.street}, ${order.shippingAddress.city},
        ${order.shippingAddress.country}
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" class="btn">
        Track Your Order
      </a>
    `),
    });
}

// ===== Order Status Update Email =====
export async function sendOrderStatusEmail(email, order) {
    const statusColors = {
        processing: "badge-pending",
        shipped: "badge-pending",
        delivered: "badge-confirmed",
        cancelled: "badge-pending",
    };

    await transporter.sendMail({
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Update #${order._id.toString().slice(-8).toUpperCase()}`,
        html: baseTemplate(`
      <h2>Order Status Updated</h2>
      <p>Your order status has been updated to:</p>
      <p>
        <span class="badge ${statusColors[order.orderStatus] || "badge-pending"}">
          ${order.orderStatus.toUpperCase()}
        </span>
      </p>
      <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" class="btn">
        View Order Details
      </a>
    `),
    });
}

// ===== Password Reset Email =====
export async function sendPasswordResetEmail(email, name, token) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: `"ShopZone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your ShopZone password",
        html: baseTemplate(`
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
      <hr class="divider"/>
      <p style="font-size:13px; color:#94a3b8;">
        This link expires in 1 hour. If you didn't request this, ignore this email.
      </p>
    `),
    });
}