import nodemailer from "nodemailer";

export const sendEmail = async (
  recipient: string,
  price: string | undefined
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: process.env.NEXT_PUBLIC_EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  }as any);

  const mailOptions = {
    from:process.env.NEXT_PUBLIC_EMAIL_USER,
    to: recipient,
    subject: "Price Update",
    text: `The current price of the product is ${price}`,
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
};
