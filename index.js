const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/webhook", (req, res) => {

    const incomingMsg = (req.body.Body || "").toLowerCase();

    const twiml = new twilio.twiml.MessagingResponse();

    if (incomingMsg === "hi") {

        twiml.message(
`Welcome 👋

Choose option:

👉 Reply with:
Freelook
or
Claims`
        );

    }

    else if (incomingMsg === "freelook") {

        twiml.message("Freelook request submitted successfully ✅");

    }

    else if (incomingMsg === "claims") {

        twiml.message("Claim registered successfully ✅");

    }

    else {

        twiml.message("Please type Hi");

    }

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());

});

app.get("/", (req, res) => {
    res.send("WhatsApp Bot Running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
