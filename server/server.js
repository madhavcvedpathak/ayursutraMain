import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 3001;

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
    console.warn("⚠️  Twilio credentials missing in .env using placeholders");
}

const client = twilio(accountSid, authToken);

app.post('/api/send-sms', async (req, res) => {
    const { to, body } = req.body;

    if (!to || !body) {
        return res.status(400).json({ success: false, error: "Missing 'to' or 'body'" });
    }

    try {
        console.log(`[Server] Attempting SMS to ${to}: ${body}`);
        const message = await client.messages.create({
            body: body,
            from: fromNumber,
            to: to
        });
        console.log(`[Server] SMS Sent! SID: ${message.sid}`);
        res.json({ success: true, sid: message.sid });
    } catch (error) {
        console.error("[Server] SMS Failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 SMS Server running on http://localhost:${PORT}`);
});
