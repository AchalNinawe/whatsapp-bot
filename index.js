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

    console.log("BODY:", req.body);

    const policyNumber =
        String(
            req.body.policyNumber ||
            req.body.policyNo ||
            ""
        ).trim();

    console.log("Policy Number:", policyNumber);

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

    // BUSINESS ERROR RESPONSE
    if (data.result === 0) {

        return res.json({
            result: 0,
            message: data.message
        });

    }

    // SUCCESS RESPONSE
    res.json({
        result: 1,
        message: "Freelook processed successfully ✅",
        policyNumber:
            data.Policy?.PolicyNumber,
        refundAmount:
            data.FreelookResult?.TotalRefundAmount,
        productCode:
            data.Policy?.ProductCode,
        inceptionDate:
            data.Policy?.InceptionDate,
        expiryDate:
            data.Policy?.ExpiryDate
    });

} catch (err) {

    console.log(
        "FREELOOK ERROR:",
        err.response?.data || err.message
    );

    res.status(500).json({
        error:
            err.response?.data ||
            err.message
    });

}

});

app.post("/freelookQuotation", async (req, res) => {

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

    // BUSINESS ERROR
    if (data.result === 0) {

        return res.json({
            result: 0,
            message: data.message
        });

    }

    // SUCCESS
    res.json({
        result: data.result,
        totalCoverageRefund:
            data.totalCoverageRefund || 0,
        totalAdminFee:
            data.totalAdminFee || 0,
        totalRefundAmount:
            data.totalRefundAmount || 0
    });

} catch (err) {

    console.log(
        "FREELOOK QUOTATION ERROR:",
        err.response?.data || err.message
    );

    res.status(500).json({
        error:
            err.response?.data ||
            err.message
    });

}

});

app.post("/claimReject", async (req, res) => {

try {

    console.log(
        "CLAIM REJECT BODY:",
        JSON.stringify(req.body, null, 2)
    );

    const response = await axios.post(
        "https://portal.insuremo.com/api/platform/1.0/v1/flow/ClaimRegistrationRejectBusinessApi",
        req.body,
        {
            headers: {
                "Authorization":
                    "Bearer MOATbu0LChDwAdlbynYOegcshxYsyRys",
                "Content-Type":
                    "application/json"
            }
        }
    );

    console.log(
        "CLAIM REJECT RESPONSE:",
        JSON.stringify(
            response.data,
            null,
            2
        )
    );

    const data = response.data;

    res.json({
        success: data.success,
        message: data.message,
        caseNo: data.caseNo
    });

} catch (err) {

    console.log(
        "CLAIM REJECT ERROR:",
        err.response?.data || err.message
    );

    res.status(500).json({
        error:
            err.response?.data ||
            err.message
    });

}

});

app.post('/claimRegistration', async (req, res) => {

  try{

    console.log(
      '\n=============================='
    );

    console.log(
      'CLAIM REGISTRATION START'
    );

    console.log(
      'TIME:',
      new Date().toISOString()
    );

    console.log(
      'RAW BODY:',
      JSON.stringify(req.body,null,2)
    );

    const text =
      req.body.claimFormText || '';

    console.log(
      'RAW claimFormText:',
      text
    );

    const insuredName =
      text.match(
        /Insured Name:\s*(.*)/i
      )?.[1]?.trim() || '';

    const insuredIdNo =
      text.match(
        /Insured ID No:\s*(.*)/i
      )?.[1]?.trim() || '';

    const incidentDate =
      text.match(
        /Incident Date:\s*(.*)/i
      )?.[1]?.trim() || '';

    const notificationDate =
      text.match(
        /Notification Date:\s*(.*)/i
      )?.[1]?.trim() || '';

    const reporterName =
      text.match(
        /Reporter Name:\s*(.*)/i
      )?.[1]?.trim() || '';

    console.log(
      '\nPARSED VALUES:'
    );

    console.log({
      insuredName,
      insuredIdNo,
      incidentDate,
      notificationDate,
      reporterName
    });

    if(
      !insuredName ||
      !incidentDate ||
      !notificationDate
    ){

      console.log(
        'VALIDATION FAILED'
      );

      return res.status(400).json({
        success:false,
        message:'Missing required fields'
      });
    }

    const payload = {

      claimCase: {

        claimCaseBasic: {

          claimType:11,
          claimNature:1,
          claimChannel:1,

          accidentTime:
            incidentDate +
            'T00:00:00Z',

          caseLevel:'1',

          notificationDate:
            notificationDate +
            'T00:00:00Z',

          originalCaseNo:''

        },

        claimInsured: {

          partyId:27723919,

          firstName:
            insuredName,

          lastName:
            insuredName,

          fullName:
            insuredName,

          gender:'M',

          dob:'1996-03-31',

          idType:3,

          idNo:
            insuredIdNo,

          nameFormat:'O'

        },

        claimReporter: {

          partyId:27723919,
          addressId:1257214

        },

        claimComments:[
          {
            commentType:1,
            commentsText:
              'Claim registered via WhatsApp'
          }
        ]

      }

    };

    console.log(
      '\nFINAL INSUREMO PAYLOAD:'
    );

    console.log(
      JSON.stringify(payload,null,2)
    );

    console.log(
      '\nCALLING INSUREMO API...'
    );

    const response =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/ClaimRegistrationSubmitBusinessApi',
        payload,
        {
          headers:{
            Authorization:
              'Bearer MOATbu0LChDwAdlbynYOegcshxYsyRys',
            'Content-Type':
              'application/json'
          }
        }
      );

    console.log(
      '\nINSUREMO RESPONSE STATUS:',
      response.status
    );

    console.log(
      '\nINSUREMO RESPONSE BODY:'
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    console.log(
      '\nCLAIM REGISTRATION SUCCESS'
    );

    console.log(
      '==============================\n'
    );

    const data =
      response.data;

    return res.json({

      success:data.success,
      message:data.message,
      caseNo:data.caseNo,
      caseId:data.caseId

    });

  }catch(error){

    console.log(
      '\nCLAIM REGISTRATION ERROR'
    );

    console.error(
      error.response?.data ||
      error.message
    );

    console.log(
      '==============================\n'
    );

    return res.status(500).json({

      success:false,

      error:
        error.response?.data ||
        error.message

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
