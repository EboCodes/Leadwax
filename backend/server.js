// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
// Enable Cross-Origin Resource Sharing (CORS) for the frontend
app.use(cors()); 
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- API Endpoints ---

// Contact Form Submission Endpoint
app.post('/api/contact', async (req, res) => {
    console.log("Contact form submission received.");
    const { name, email, message } = req.body;

    // TODO: Replace with your actual email service credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use 'gmail' or another service provider (e.g., SendGrid, Outlook)
        auth: {
            user: 'your_email@gmail.com', // Your email address
            pass: 'your_email_password' // Your email password or app-specific password
        }
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'your_friends_email@example.com', // Your friend's email address
        subject: 'New Contact Form Message from Global FX Website',
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Contact email sent successfully.");
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

// Payment Form Submission Endpoint
app.post('/api/pay', async (req, res) => {
    console.log("Payment form submission received.");
    const { fullName, email, service } = req.body;

    // --- Payment Gateway Integration Logic ---
    // This is where you would integrate with Selar or Paystack's API.
    // For a real application, you would:
    // 1. Call the payment gateway's API to initiate a transaction.
    // 2. Redirect the user to the payment gateway's hosted payment page.
    // 3. Handle the webhook or callback from the payment gateway to confirm payment success.
    
    // For now, we will simulate a successful payment and send a receipt.
    const paymentSuccessful = true; // Placeholder for actual payment status

    if (paymentSuccessful) {
        // Create the receipt transporter
        const receiptTransporter = nodemailer.createTransport({
            service: 'gmail', // Or another service
            auth: {
                user: 'your_email@gmail.com', // Your email address
                pass: 'your_email_password' // Your email password
            }
        });

        const receiptMailOptions = {
            from: 'Your Company Name <your_email@gmail.com>',
            to: email, // The customer's email
            subject: 'Your Global FX Payment Receipt',
            html: `<p>Hello ${fullName},</p>
                   <p>Thank you for your payment for the <strong>${service}</strong> service.</p>
                   <p>This is a confirmation of your purchase. A team member will be in touch shortly with next steps.</p>
                   <p>Best regards,<br>The Global FX Team</p>`
        };

        try {
            await receiptTransporter.sendMail(receiptMailOptions);
            console.log("Payment receipt email sent successfully.");
            res.status(200).json({ success: true, message: 'Payment successful! A receipt has been sent to your email.' });
        } catch (error) {
            console.error('Error sending receipt email:', error);
            res.status(500).json({ success: false, message: 'Payment successful, but failed to send receipt.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Payment failed. Please try again.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
