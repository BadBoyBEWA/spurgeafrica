export const orderConfirmationTemplate = (name: string, orderId: string, amount: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #111;">Order Confirmed</h1>
  <p>Dear ${name},</p>
  <p>Thank you for your order with Spurge Africa. Your order <strong>#${orderId}</strong> for <strong>${amount}</strong> has been confirmed.</p>
  <p>We will notify you once your order is ready for dispatch or fitting.</p>
  <br>
  <p>Best regards,</p>
  <p>Spurge Africa Atelier</p>
</div>
`;

export const tailoringEnquiryTemplate = (name: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #111;">Tailoring Enquiry Received</h1>
  <p>Dear ${name},</p>
  <p>We have received your custom tailoring request.</p>
  <p>One of our tailors will review your details and get back to you shortly to schedule a consultation or confirm measurements.</p>
  <br>
  <p>Best regards,</p>
  <p>Spurge Africa Atelier</p>
</div>
`;

export const contactMessageTemplate = (name: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #111;">Message Received</h1>
  <p>Dear ${name},</p>
  <p>Thank you for reaching out to us. We have received your message and our team will get back to you within 24-48 hours.</p>
  <br>
  <p>Best regards,</p>
  <p>Spurge Africa Atelier</p>
</div>
`;
