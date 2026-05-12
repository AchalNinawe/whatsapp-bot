const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/queryPolicy", async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const policyNumber =
    String(
        req.body.policyNumber ||
        req.body.policyNo ||
        ""
    ).trim();

        console.log("Policy Number:", policyNumber);

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

        console.log(
            "API RESPONSE:",
            JSON.stringify(response.data, null, 2)
        );

        if (
            !response.data ||
            !response.data.policy ||
            !response.data.policy.policyInfo ||
            !response.data.policy.policyInfo.policyBasicInfo
        ) {

            return res.status(400).json({
                error: "Invalid policy response"
            });

        }

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
            "ERROR:",
            err.response?.data || err.message
        );

        res.status(500).json({
            error: err.response?.data || err.message
        });

    }

});

app.post("/freelook", async (req, res) => {

    try {

        const policyNumber =
            String(
                req.body.policyNumber ||
                req.body.policyNo ||
                ""
            ).trim();

        const response = await axios.post(
            "https://portal.insuremo.com/api/platform/1.0/v1/flow/FreeLookTrad",
            {
                policyNumber: policyNumber,
                effectiveDate: new Date()
                    .toISOString()
                    .replace("Z", "")
                    .split(".")[0],
                freelookInput: {
                    freelookReason: 1,
                    alteredCoverages: []
                }
            },
            {
                headers: {
                    "Authorization":
                        "Bearer MOATbu0LChDwAdlbynYOegcshxYsyRys",
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(
            "FREELOOK RESPONSE:",
            JSON.stringify(response.data, null, 2)
        );

        const data = response.data;

        res.json({
            message: "Freelook processed successfully ✅",
            policyNumber: data.Policy.PolicyNumber,
            refundAmount:
                data.FreelookResult.TotalRefundAmount,
            productCode: data.Policy.ProductCode,
            inceptionDate: data.Policy.InceptionDate,
            expiryDate: data.Policy.ExpiryDate
        });

    } catch (err) {

        console.log(
            "FREELOOK ERROR:",
            err.response?.data || err.message
        );

        res.status(500).json({
            error:
                err.response?.data || "Freelook API Failed"
        });

    }

});

app.post("/freelookQuotation", async (req, res) => {

    try {

        const policyNumber =
            String(
                req.body.policyNumber ||
                req.body.policyNo ||
                ""
            ).trim();

        const response = await axios.post(
            "https://portal.insuremo.com/api/platform/1.0/v1/flow/FreelookRefundQuotation",
            {
                policyNumber: policyNumber,
                effectiveDate: new Date()
                    .toISOString()
                    .replace("Z", "")
                    .split(".")[0],
                freelookInput: {
                    freelookReason: 1,
                    alteredCoverages: []
                }
            },
            {
                headers: {
                    "Authorization":
                        "Bearer MOATbu0LChDwAdlbynYOegcshxYsyRys",
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(
            "FREELOOK QUOTATION RESPONSE:",
            JSON.stringify(response.data, null, 2)
        );

        const data = response.data;

        res.json({
            result: data.result,
            totalCoverageRefund:
                data.totalCoverageRefund,
            totalAdminFee:
                data.totalAdminFee,
            totalRefundAmount:
                data.totalRefundAmount
        });

    } catch (err) {

        console.log(
            "FREELOOK QUOTATION ERROR:",
            err.response?.data || err.message
        );

        res.status(500).json({
            error:
                err.response?.data ||
                "Freelook Quotation API Failed"
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
