require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── MongoDB Connection ──────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rahul_portfolio')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

// ── Contact Message Schema ──────────────────────
const messageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  message:   { type: String, required: true },
  createdAt: { type: Date,   default: Date.now },
  read:      { type: Boolean, default: false },
});
const Message = mongoose.model('Message', messageSchema);

// ── Routes ──────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Save contact message to MongoDB
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'All fields are required.' });

    const msg = await Message.create({ name, email, message });

    // Optional: send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true' ? true : false, // true for 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'rahulyad62005@gmail.com',
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        html: `<h3>New message from your portfolio</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`,
      });
    }

    res.status(201).json({ success: true, id: msg._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Get all messages (for admin use)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
