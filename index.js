const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/webhook", (req, res) => {

    const msg = (req.body.Body || "").toLowerCase();

    res.set('Content-Type', 'text/xml');

    if(msg === "hi"){

        res.send(`
<Response>
<Message>
Welcome 👋

Type:
Freelook
or
Claims
</Message>
</Response>
`);
    }

    else if(msg === "freelook"){

        res.send(`
<Response>
<Message>
Freelook request submitted successfully ✅
</Message>
</Response>
`);
    }

    else if(msg === "claims"){

        res.send(`
<Response>
<Message>
Claim registered successfully ✅
</Message>
</Response>
`);
    }

    else{

        res.send(`
<Response>
<Message>
Please type Hi
</Message>
</Response>
`);
    }

});

app.listen(process.env.PORT || 3000);
