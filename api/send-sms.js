module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust in production if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, body } = req.body;

    if (!to || !body) {
        return res.status(400).json({ error: "Missing 'to' or 'body'" });
    }

    // Twilio Init
    const client = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        console.log(`[Vercel API] Sending SMS to ${to}`);
        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        return res.status(200).json({ success: true, sid: message.sid });
    } catch (error) {
        console.error("Twilio Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
