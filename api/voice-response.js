module.exports = (req, res) => {
    const { message } = req.query;

    // TwiML XML Response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Say voice="alice" language="en-IN">Namaste from Ayursutra Center.</Say>
        <Pause length="1"/>
        <Say voice="alice" language="en-IN">${message || 'Please follow your therapy instructions carefully. Have a healthy day.'}</Say>
        <Pause length="1"/>
        <Say voice="alice" language="en-IN">Thank you.</Say>
    </Response>`;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml);
};
