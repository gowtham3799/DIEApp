const { connectRest } = require("./lib/connectionHandler");

module.exports = cds.service.impl(async function () {

    //Step 1: get the object of our odata entities
    const { schemas, Products, jobs } = this.entities;

    this.on('READ', Products, async (req, res) => {
        const connection = await cds.connect.to('Northwind');
        // res = connection.tx(req).run(req.query); 
        res = connection.get("Products");
        return res;
    })

    //Step 2: define generic handler for validation
    // this.on('READ', schemas, async (req, res) => {

    //     const params = {
    //         "clientId": "default"
    //     };
    //     const connectionGet = await cds.connect.to('RESTPOST');

    //     res = connectionGet.get("/schemas?clientId=default");
    //     return res;

    // });
    this.on('READ', schemas, async (req, res) => {
        const SapCfAxios = require('sap-cf-axios').default;
        const axios = SapCfAxios("doc-info-extraction");

        res = await axios({
            method: "get",
            url: "/schemas?clientId=default",
            //   data: {
            //     title: "Using Axios in SAP Cloud Foundry",
            //     author: "Joachim Van Praet"
            //   },
            headers: {
                "content-type": "application/json"
            }
        })
        return res.data;
    });

    this.on('READ', jobs, async (req, res) => {
        const SapCfAxios = require('sap-cf-axios').default;
        const axios = SapCfAxios("doc-info-extraction");

        res = await axios({
            method: "get",
            url: "/document/jobs?clientId=default",
            //   data: {
            //     title: "Using Axios in SAP Cloud Foundry",
            //     author: "Joachim Van Praet"
            //   },
            headers: {
                "content-type": "application/json"
            }
        })
        return res.data;
    });

    this.on('READ', jobs, async (req, res) => {
        res = connectRest();
        return res;
    });
    this.on('CREATE', jobs, async (request, response) => {
        const SapCfAxios = require('sap-cf-axios').default;
        const axios = SapCfAxios("doc-info-extraction");
        const formData = require('form-data');
        const fs = require('fs');
        const file = fs.createReadStream("./srv/invoice.jpeg")

        // data = new formData();

        // data.append('file', file, 'invoice.jpeg')


        // let options = {
        //     "clientId": "default",
        //     "extraction": {
        //         "headerFields": [
        //             "documentNumber",
        //             "grossAmount"
        //         ]
        //     },
        //     "documentType": "invoice"
        // }
        // data.append('options', JSON.stringify(options));
        let config = ({
            method: "post",
            url: "/document/jobs",
            data: request,
            headers: {
                'content-type': "multipart/form-data",
                'Accept': 'multipart/mixed'
            }
        });
        res = await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
        return res.data;

    });

}
);