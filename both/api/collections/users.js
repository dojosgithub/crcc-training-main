/**
 * Users collection
 */

import { Meteor } from 'meteor/meteor'
// import { SimpleSchema } from 'meteor/aldeed:simple-schema'
// const SimpleSchema = require('simpl-schema') //-- not working

// if(Meteor.isServer) {
  import { CoreDB } from '//both/startup/config/db-config.js'

  // export const Users = new Mongo.Collection("users", { _driver: CoreDB })

// }

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import Tabular from 'meteor/aldeed:tabular'

//-- Initial global schema variable/placeholder for collections
MySchema = {}

MySchema.UserCountry = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String,
        regEx: /^[A-Z]{2}$/
    }
});

MySchema.UserProfile = new SimpleSchema({
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    organization : {
        type: String,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    country: {
        type: MySchema.UserCountry,
        optional: true
    },
    status: {
        type: Number,
        optional: true        
    }
});

// MySchema.TrainingQuizzes = new SimpleSchema({
//     quizId: {
//         type: String
//     },
//     questions: {
//         type: Array,
//     }
// });

MySchema.User = new SimpleSchema({
    _id: {
        type: String        
    },
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    email: { //-- This is critical to get the email value correctly.
        type: String,
        optional: false
    },     
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    },
    modifiedAt: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    },
    addedAt: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    },
    profile: {
        type: MySchema.UserProfile,
        optional: true,
        blackbox: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    password: { //-- This is also critical to get the password value correctly.
        type: String,
        optional: false
    },    
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    },
    trainingModules: {
        type: Array,
        optional: true
    },
    // trainingQuizzes: {
    //     type: Array,
    //     optional: true
    // }
});

TabularTables = {};

TabularTables.AdminAllUsers = new Tabular.Table({
 name: "AdminAllUsers",
 collection: Meteor.users,
 // pub: 'all_module_users_w_modules', //-- not working...
 order: [[7, 'desc']],
 pageLength: 20,
 lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
 processing: false,
 language: {
    // search: "Quick Search: ",
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ users per page",
     zeroRecords: "No User Data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ users",
     infoEmpty: "No user records available",
     infoFiltered: "(filtered from _MAX_ total users)",
     processing: ""
 },
 columns: [
    {data: "profile.lastname", title: "Last Name", width: 150},
    {data: "profile.firstname", title: "First Name", width: 150},
    {data: "emails[0].address", title: "Email", render(v,t,d) {        
        if(d.emails && d.emails[0].verified === true) {
            return '<span class="email-verified">' + v + '</span>'
        } else {
            return '<span class="email-not-verified">' + v + '</span>'
        }
    }},
    {data: "profile.country", title: "Country", width: 100},
    {data: "username", title: "Username", width: 150},
    {title: "Modules", 
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {
        // console.log(rowData)
        return Blaze.renderWithData(Template.AdminAllUsersModules, {
          data: rowData
        }, cell);
      },
    },
    // {title: "Progress", 
    //   createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
    //     return Blaze.renderWithData(Template.AdminAllUsersProgress, {
    //       data: rowData
    //     }, cell);
    //   },
    // },    
    // {data: "profile.trainingModules", title: "Modules", render(v, t, d) {
    //   let modules = ''

    //   if(v && v.length > 0) {
    //     v.forEach(function(m) {

    //     })
    //   }
    //   return modules
    // },    
    {class: 'col-xs-2',
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {
        return Blaze.renderWithData(Template.AdminAllUsersActions, {
          data: rowData
        }, cell);
      },
    },        
    {data: "createdAt", visible: false},
    {data: "profile.online", visible: false},    
    {data: "profile.addedAt", visible: false},
    {data: "_id", visible: false},    
    {data: "profile.trainingModules", visible: false},
    {data: "emails[0].verified", visible: false},
    {data: "profile.status", visible: false}    

 ]   
})

