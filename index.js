const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/webhook", (req, res) => {

    const msg = (req.body.Body || "").toLowerCase().trim();

    let reply = "";

    if (msg === "hi") {

        reply =
`Welcome 👋

Choose option:

1. Freelook
2. Claims`;

    }

    else if (msg === "1" || msg === "freelook") {

        reply = "Freelook request submitted successfully ✅";

    }

    else if (msg === "2" || msg === "claims") {

        reply = "Claim registered successfully ✅";

    }

    else {

        reply = "Please type Hi";

    }

    res.set("Content-Type", "text/xml");

    res.send(`
<Response>
    <Message>${reply}</Message>
</Response>
`);

});

app.get("/", (req, res) => {
    res.send("WhatsApp Bot Running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});