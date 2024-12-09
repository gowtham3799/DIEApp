const cds = require("@sap/cds");

const { connectbackend, connectRest } = require('./lib/connectionHandler');

class CatalogService extends cds.ApplicationService {
    init() {
        this.on("READ", "schemas", (req) => this.onReadVinay(req));
        this.before("CREATE", "schemas", (req) => this.onPostVinay(req));
        return super.init();
    }
    async onReadVinay(req) {

        const connectionGet = await cds.connect.to('RESTPOST');
        const tx = await connectionGet.get('/schemas?clientId=default')
        
        const tx2 = connectionGet.tx(req).run(req.query);
        return tx;


    }
    async onPostVinay(req) {

        const connectionPost = await cds.connect.to('RESTPOST');
        const tx = await connectionPost.post('/p24_er6_getPeriodStatus', {
            "input": {
                  "postingDate": "2024-09-24"
                }
        })
        
        const tx2 = connectionPost.tx(req).run(req.query);
        return tx;
    }

}

class RootService extends cds.ApplicationService {
    init() {
        this.on("p24_er6_getPeriodStatus", (req) => this.onReadAction(req));
        return super.init();
    }
    async onReadAction(req) {
        // var payload = {
        //     "input": {
        //           "postingDate": "2024-09-24"
        //         }
        // };
        const connectionPost = await cds.connect.to('RESTPOST');
       // const tx = connectionPost.tx(req).run(req.query);
        
        const tx2 = await connectionPost.post('/p24_er6_getPeriodStatus', req.data)
        return tx2.output;
    }

}
module.exports = { CatalogService,RootService }


// module.exports  = cds.service.impl(function () {
//     const { Material }  = this.entities;
//     console.log(this.entities);
//     this.on("READ",Material,connectbackend );

//     const { RestAPI } = this.entities;
//     this.on("READ",RestAPI,connectRest );


// })