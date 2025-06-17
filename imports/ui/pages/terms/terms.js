import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import { getPrivacyPolicyContent } from '/both/api/methods/privacy-policy-content.js';

import './terms.html';

Template.Terms.onCreated(function() {
    Tracker.autorun(function() {
        getPrivacyPolicyContent.call({}, (err, res) => {
            // console.log(err, res);

            if(res.data) {                
                Session.set("Terms.content", res.data && res.data.content);
            }
        })
    })
});

Template.Terms.helpers({
	privacy_policy_content: function() {
        if(Session.get("Terms.content")) {
            return Session.get("Terms.content");
        }
	}
})
