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

const rawBody =
  req.body.body || '';

console.log(
  'RAW BODY STRING:',
  rawBody
);

const text =
  rawBody.replace(
    'claimFormText=',
    ''
  );

console.log(
  'RAW claimFormText:',
  JSON.stringify(text)
);

const lines =
  text
    .split(/\r?\n/)
    .map(line => line.trim());

console.log('LINES:', lines);

const insuredName =
  lines[0]?.split(':')[1]?.trim() || '';

const insuredIdNo =
  lines[1]?.split(':')[1]?.trim() || '';

const incidentDate =
  lines[2]?.split(':')[1]?.trim() || '';

const notificationDate =
  lines[3]?.split(':')[1]?.trim() || '';

const reporterName =
  lines[4]?.split(':')[1]?.trim() || '';

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

app.post('/claimAcceptance', async (req, res) => {

  try{

    console.log(
      '\n=============================='
    );

    console.log(
      'CLAIM ACCEPTANCE START'
    );

    console.log(
      'BODY:',
      JSON.stringify(req.body,null,2)
    );

    const caseId =
      req.body.caseId;

    const caseNo =
      req.body.caseNo;

    if(
      !caseId ||
      !caseNo
    ){

      return res.status(400).json({
        success:false,
        message:'caseId and caseNo required'
      });
    }

    /*
    ==================================================
    1. QUERY BUSINESS API
    ==================================================
    */

    console.log(
      '\n1. CLAIM QUERY BUSINESS API'
    );

    const queryResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/ClaimCaseQueryBusinessAPI',
        {
          claimCaseNo:caseNo
        },
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
      JSON.stringify(
        queryResponse.data,
        null,
        2
      )
    );

    const claimCase =
      queryResponse.data.claimCase;

    /*
    ==================================================
    2. LOAD ACCEPTANCE
    ==================================================
    */

    console.log(
      '\n2. LOAD ACCEPTANCE'
    );

    const loadResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/claim/acceptance/v2/load',
        {
          caseId:caseId
        },
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
      JSON.stringify(
        loadResponse.data,
        null,
        2
      )
    );

    /*
    ==================================================
    3. SAVE BUSINESS API
    ==================================================
    */

    console.log(
      '\n3. CLAIM CASE SAVE BUSINESS API'
    );

    const savePayload = {

      claimCase:claimCase

    };

    const saveResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/ClaimCaseSaveBusinessAPI',
        savePayload,
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
      JSON.stringify(
        saveResponse.data,
        null,
        2
      )
    );

    /*
    ==================================================
    4. COPY POLICIES
    ==================================================
    */

    console.log(
      '\n4. COPY POLICIES'
    );

    const insuredPartyId =
      claimCase
      ?.claimInsured
      ?.partyId;

    const accidentTime =
      claimCase
      ?.claimCaseBasic
      ?.accidentTime;

    const copyPoliciesPayload = {

      caseId:
        caseId,

      insuredPartyId:
        insuredPartyId,

      accidentTime:
        accidentTime

    };

    console.log(
      JSON.stringify(
        copyPoliciesPayload,
        null,
        2
      )
    );

    const copyPoliciesResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/claim/acceptance/v2/copyPolicies',
        copyPoliciesPayload,
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
      JSON.stringify(
        copyPoliciesResponse.data,
        null,
        2
      )
    );

    /*
    ==================================================
    5. SAVE POLICY PRODUCT
    ==================================================
    */

    console.log(
      '\n5. SAVE POLICY PRODUCT'
    );

    const savePolicyResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/claim/acceptance/v2/savePolicyProduct',
        {
          caseId:caseId
        },
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
      JSON.stringify(
        savePolicyResponse.data,
        null,
        2
      )
    );

    /*
    ==================================================
    6. SUBMIT ACCEPTANCE
    ==================================================
    */

    console.log(
      '\n6. SUBMIT ACCEPTANCE'
    );

    const submitPayload = {

      caseId:
        caseId,

      acceptDecision:1,

      commentsToClient:
        'Accepted via WhatsApp'

    };

    console.log(
      JSON.stringify(
        submitPayload,
        null,
        2
      )
    );

    const submitResponse =
      await axios.post(
        'https://portal.insuremo.com/api/platform/1.0/v1/flow/claim/acceptance/v2/submit',
        submitPayload,
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
      JSON.stringify(
        submitResponse.data,
        null,
        2
      )
    );

    console.log(
      '\nCLAIM ACCEPTANCE COMPLETE'
    );

    console.log(
      '==============================\n'
    );

    return res.json({

      success:true,

      message:
        'Claim accepted successfully',

      caseId:
        caseId,

      caseNo:
        caseNo,

      query:
        queryResponse.data,

      load:
        loadResponse.data,

      save:
        saveResponse.data,

      copyPolicies:
        copyPoliciesResponse.data,

      savePolicyProduct:
        savePolicyResponse.data,

      submit:
        submitResponse.data

    });

  }catch(error){

    console.log(
      '\nCLAIM ACCEPTANCE ERROR'
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
