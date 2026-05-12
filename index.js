const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/queryPolicy", async (req, res) => {

    try {

        const policyNumber = req.body.policyNumber;

        const response = await axios.post(
            "https://portal.insuremo.com/api/platform/1.0/v1/flow/Gry_QueryPolicyByNumber",
            {
                policyNumber: policyNumber
            },
            {
                headers: {
                    "Authorization": "Bearer MOATbu0LChDwAdlbynYOegcshxYsyRys",
                    "Content-Type": "application/json"
                }
            }
        );

        const data =
            response.data.policy.policyInfo.policyBasicInfo;

        res.json({
            result: response.data.result,
            policyNumber: data.policyNumber,
            policyId: data.policyId,
            productCode: data.productCode,
            inceptionDate: data.inceptionDate,
            expiryDate: data.expiryDate,
            issueDate: data.issueDate,
            currency: data.premiumCurrencyCode
        });

    } catch (err) {

        console.log(
            err.response?.data || err.message
        );

        res.status(500).json({
            error: "Policy API Failed"
        });

    }

});

app.get("/", (req, res) => {
    res.send("Insurance Bot Running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
