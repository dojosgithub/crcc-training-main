/**
 * Common start-up logic block (server-side)
 */

// global.Buffer = global.Buffer || require("buffer/").Buffer;

// var Buffer = require('buffer/').Buffer

import { Meteor } from 'meteor/meteor';

WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains;'); //-- comment this to avoid multiple header issue? as LB has this in there as well...
    // res.setHeader('Cache-Control', 'public, max-age=10000');    
    res.setHeader('Cache-Control', 'no-cache; no-store; must-revalidate');
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    res.setHeader('Feature-Policy', "vibrate 'self'; sync-xhr 'self';");
    res.setHeader('Pragma', 'no-cache');    
    next();
});

Meteor.startup(() => {

  let _CDN_URL = CDN.get_cdn_url()

  // if(process.env.NODE_ENV === "production") {
    BrowserPolicy.content.allowOriginForAll("https://www.google-analytics.com")
    BrowserPolicy.content.allowOriginForAll("https://www.google.com")
    BrowserPolicy.content.allowOriginForAll("https://www.gstatic.com")
    BrowserPolicy.content.allowOriginForAll("https://videos.sproutvideo.com");
    // BrowserPolicy.content.allowOriginForAll("//videos.sproutvideo.com");
    BrowserPolicy.content.allowOriginForAll("https://c.sproutvideo.com")
    BrowserPolicy.content.allowOriginForAll("https://fonts.googleapis.com")
    BrowserPolicy.content.allowOriginForAll("https://fonts.gstatic.com")
    BrowserPolicy.content.allowOriginForAll("https://stats.g.doubleclick.net")
    BrowserPolicy.content.allowOriginForAll("https://d6jtpec20q1a9.cloudfront.net")

    BrowserPolicy.content.allowOriginForAll("blob:")
    BrowserPolicy.content.allowOriginForAll("https://cdnjs.cloudflare.com/")

    // BrowserPolicy.content.allowOriginForAll("https://www.googleapis.com/");
    // BrowserPolicy.content.allowOriginForAll("http://www.googletagmanager.com/")
    BrowserPolicy.content.allowOriginForAll("https://www.googletagmanager.com/");
    // BrowserPolicy.content.allowOriginForAll("https://craa-dev-01-default-rtdb.firebaseio.com/");

    // BrowserPolicy.content.allowOriginForAll("http://localhost:3500")

    // BrowserPolicy.content.allowOriginForAll("https://ipapi.co") //-- Meteor 1.8+ seems to need this(?), not implemented to Training site yet
  // }

      //-- this is critical to avoid 'unsafe-inline' issue, and, invoke 
    //-- converting meteor_runtime_config from inline to a 'src' based 
    //-- one (see, /imports/startup/server/index.js)
    BrowserPolicy.content.disallowInlineScripts();
    // BrowserPolicy.content.disallowEval();
    
    //-- on the other hand, this doesn't seem necessary when nginx site conf 
    //-- doesn't have 'unsafe-inline', so, commentize this, but need to take
    //-- care of all jquery.show/hide() cases to make console warnings disappear
    BrowserPolicy.content.disallowInlineStyles();

  if(process.env.NODE_ENV === "development") {
      BrowserPolicy.content.allowOriginForAll('*')
      // BrowserPolicy.content.allowOriginForAll("http://www.google-analytics.com") //-- local dev
      // BrowserPolicy.content.allowOriginForAll() //-- local dev
      BrowserPolicy.content.allowDataUrlForAll() //-- for the image logo or font?
  }  

  if(_CDN_URL) {
      BrowserPolicy.content.allowOriginForAll(_CDN_URL)    
  }

  //-- Code to run on server at startup
  // Accounts.onCreateUser(function(options, user) {
  //     _.extend(user, { trainingModules : [] }); // OR user.someField = 'initialValue';
  // });  
  // global.Buffer = global.Buffer || require("buffer").Buffer;

  // This is critical to get the real ip headers (X-Real-IP, X-Forwarded-For) in nginx properly.
  // It should be 2: Meteor itself has one proxy behind, another from nginx (upstream).
  // process.env.HTTP_FORWARDED_COUNT = 1; // With mupx, 1, without mupx 2; with Nginx 2, otherwise 1
  process.env.HTTP_FORWARDED_COUNT = 1; // With mupx, 1, without mupx 2; with Nginx 2, otherwise 1 (<- if it's 1, Amazon IP will be recorded)         

})

// import { Method } from '/imports/api/lib/method.js'
// 
// remoteSetPwd = new Method('accounts.remoteSetPwd', function(obj) {
//   
//     if(Meteor.isServer) {
// 
//       try { 
// 
//         check(obj, {
//             uid: String,
//             password: String
//         })        
// 
//         return new Promise((resolve, reject) => {
// 
//             if(obj.uid && obj.password) {
//                 Accounts.setPassword(obj.uid, obj.password, (err) => {
//                     if(err) {
//                         resolve({success: false})
//                     } else {
//                         resolve({success: true})
//                     }
//                 })
//             } else {
//                 resolve({success: false})
//             }
//         })
//       } catch(e) {
//           console.log( "Cannot get result data...", e )
//       }  
//     }
// })

