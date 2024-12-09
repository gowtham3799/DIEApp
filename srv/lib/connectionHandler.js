const cds = require("@sap/cds");
const axios = require('axios');
const FormData = require('form-data');
async function connectbackend(req){
    const connection = await cds.connect.to('carcareMetadata');
    const tx = connection.tx(req).run(req.query);
    return tx;
}
async function connectRest(req){
    
    //const tx2 = connection2.tx(req).run(req.query);
    // get all the necessary destination service parameters from the  
    // service binding in the VCAP_SERVICES env variable
    const vcapServices = JSON.parse(process.env.VCAP_SERVICES)
    const destinationServiceUrl =  vcapServices.destination[0].credentials.uri + '/destination-configuration/v1/destinations/'
    const destinationServiceClientId =  vcapServices.destination[0].credentials.clientid
    const destinationServiceClientSecret = vcapServices.destination[0].credentials.clientsecret
    const destinationServiceTokenUrl = vcapServices.destination[0].credentials.url + '/oauth/token?grant_type=client_credentials'

    // before we can fetch the destination from the destination 
    // service, we need to retrieve an auth token
    const token = await axios.post(
        destinationServiceTokenUrl, 
        null, 
        {
            headers: {
                authorization: 'Basic ' + 
                    Buffer.from(
                        destinationServiceClientId + 
                        ':' +            
                        destinationServiceClientSecret
                    ).toString('base64'),
            },
        }
    )
    const destinationServiceToken = token.data.access_token

    // with this token, we can now request the "Server" destination 
    // from the destination service
    const headers = {
        authorization: 'Bearer ' + destinationServiceToken,
    }
    const destinationResult = await axios.get(
        destinationServiceUrl + 'doc-info-extraction', 
        { headers }
    )
    const destination = destinationResult.data

    // now, we use the retrieved the destination information to send // a HTTP request to the token service endpoint;
    // to authenticate, we take the Client ID attribute and the 
    // Client Secret attribute from the destination,
    // encode ClientId:ClientSecret to Base64 and send the resulting 
    // string prefixed with "Basic " as Authorization
    // header of the request;
    // as a response, we receive a JWT token that we can then use to 
    // authenticate against the server
    // alternatively, the JWT token could directly be fetched from 
    // destination.authTokens[0].value
    let clientId = destination.destinationConfiguration.clientId;
    let clientSec = destination.destinationConfiguration.clientSecret;
    // let scope = destination.destinationConfiguration.scope;
    let parameter = 'client_id=' + clientId +'&client_secret=' + clientSec; 
    let oAuthURL = destination.destinationConfiguration.tokenServiceURL + 
    '?grant_type=client_credentials';
    let oAuthParam = clientId + ':' + clientSec;
    // const authResponse = await axios.get(destination.destinationConfiguration.tokenServiceURL, 
    //     {
    //      Body:{
    //             grant_type: 'client_credentials',
    //             client_id: clientId,
    //             client_secret: clientSec,
    //             scope:scope
    //    }
    //   });

    
    // const authResponse = await axios.get(destination.destinationConfiguration.tokenServiceURL,{
    //     headers: {
    //         'Authorization': 'Basic ' + Buffer.from(oAuthParam).toString('base64'),
    //         'Content-type': 'application/x-www-form-urlencoded'
    //     },
    //     form: {
    //         'client_id': clientId,
    //         'grant_type': 'client_credentials'
    //     }
    // })
    let data = new FormData();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', clientId);
        data.append('client_secret', clientSec);
        // data.append('scope', scope);

    
    let config = {
        method: 'post',
        url: destination.destinationConfiguration.tokenServiceURL,    
        data : data
      };

      const jwtTokenResponse = await axios.request(config);

  
   
    
    const jwtToken = jwtTokenResponse.data.access_token;


    // here we call the server instance with the bearer token we 
    // received from the token service endpoint
    let postdata = JSON.stringify({
        "input": {
          "postingDate": "2024-09-24"
        }
      });
      config = {
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + jwtToken,
        },
        url: destination.destinationConfiguration.URL + '/schemas',    
        // data : {
        //     "input": {
        //       "postingDate": "2024-09-24"
        //     }
        //   }
      }; 
    const destinationResponse = await axios.request(config);
    return destinationResponse.data
   // return tx2;
}
module.exports = {
     connectRest
}