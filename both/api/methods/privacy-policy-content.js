import { Method } from '/imports/api/lib/method.js';

export const getPrivacyPolicyContent = new Method('getPrivacyPolicyContent', function() {
    this.unblock()
    
    try {
      if(Meteor.isServer) {

        // import { CoreDB } from '/both/startup/config/db-config.js';

        // let _client = CoreDB.mongo.findOne('clients', { //-- Get simulations allotted
        //   _id: user.client_id
        // })

        // let _ppContent = PrivacyPolicy.findOne({
        // let _ppContent = CoreDB.mongo.findOne("privacy_policy_content", {
        let _ppContent = PrivacyPolicyContent.findOne({
            status: 2
        })

        return {data: _ppContent};

      }
    }
    catch(e) {
        return e;
    }
});
