require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Consider using environment variables instead
    }
});

app.use(cors());
app.use(express.json());

app.post('/api/book-order', (req, res) => {
    const orderData = req.body;

    let itemsTable = `
    <div style="width: 100%; overflow-x: auto;">
        <table style=" width: 98%; border-collapse: collapse; border: 1px solid #ddd;">
            <tr style="background-color: #f4f4f4;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item Name</th>
                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>
            </tr>
    `;


    for (let i = 0; i < orderData.items.length; i++) {
        itemsTable += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">
                ${orderData.items[i].food.name}
                </td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${orderData.items[i].quantity}
                </td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                ${orderData.items[i].food.price}
                </td>
            </tr>
        `;
    };

    itemsTable += `</table></div>`;

    const emailHtml = `
        <h2 style="color: #333;">New Order Received</h2>
        <p><strong>Customer:</strong> ${orderData.name}</p>
        <p><strong>Order Time:</strong> ${orderData.time}</p>
        <p><strong>Customer Number:</strong> ${orderData.mobile_number}</p>
        <p><strong>Total:</strong> $${orderData.total_price}</p>
        ${itemsTable}
    `;

    // email deails which email recieve order and and which send
    const mailOptions = {
        from: 'shetzain95@gmail.com',
        replyTo: orderData.email,
        to: 'waqarahmed1995dob@gmail.com',
        subject: 'New Order Received',
        html: emailHtml 
    };

    // email send method
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error:', error);
            return res.status(500).send({ message: 'Email not sent' });
        }
        res.status(200).send({ message: 'Order received', order: orderData });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
