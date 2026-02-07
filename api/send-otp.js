const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  
  // 1. Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // 2. Setup Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your App Password
    },
  });

  try {
    // 3. Send the email
    await transporter.sendMail({
      from: '"My Secure App" <your-email@gmail.com>',
      to: email,
      subject: "Your Registration OTP",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
      html: `<b>Your OTP code is: ${otp}</b><p>It expires in 5 minutes.</p>`,
    });

    // Note: In a real app, you'd save this OTP in a database (like MongoDB or Redis) 
    // associated with the email to verify it in the next step.
    
    return res.status(200).json({ success: true, message: 'OTP sent!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}