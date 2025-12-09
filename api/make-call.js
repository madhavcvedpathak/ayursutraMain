module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' phone number or 'message'" });
    }

    // Twilio Client
    const client = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        // Construct the absolute URL for the TwiML handler
        // In production (Vercel), we need the actual deployed domain.
        // For now, we'll try to use the request host if available, or fall back to a configured Env Var.
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host;
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://${host}`;

        const twimlUrl = `${baseUrl}/api/voice-response?message=${encodeURIComponent(message)}`;

        console.log(`[Voice API] Initiating call to ${to} using TwiML at ${twimlUrl}`);

        const call = await client.calls.create({
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
            url: twimlUrl
        });

        return res.status(200).json({ success: true, sid: call.sid });

    } catch (error) {
        console.error("Twilio Voice Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
