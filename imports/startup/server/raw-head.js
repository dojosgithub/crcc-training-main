import { uuid } from 'uuidv4';

// const nonce = new Buffer(uuid()).toString('base64');
const nonce = uuid();

// console.log(nonce);

//-- this helps Material-UI injected styles avoid CSP unsafe-inline issue
const cachedPolicy = BrowserPolicy.content._constructCsp();
const hackedPolicy = cachedPolicy.replace('style-src \'self\' ', `style-src 'self' 'nonce-${nonce}' `);
BrowserPolicy.content.setPolicy(hackedPolicy);

// const hackedPolicy2 = cachedPolicy.replace('script-src \'self\' ', `script-src 'self' 'nonce-${nonce}' `);
// BrowserPolicy.content.setPolicy(hackedPolicy2);

Inject.rawHead('loadingScripts', '  <meta name="keywords" content="CRA Assessments, CRA performance, pharmaceutical research, CRA training, pharmaceutical research professionals, CRA monitoring quality">'+ "\n" +
                                    // '  <meta name="description" content="CRA Assessments is a more objective and cost effective method for evaluating CRA performance. The performance information provided by the Assessment can be used by pharmaceutical research professionals to determine whether or not CRAs meet the desired performance levels, training requirements, and remediation needs of any current or potential CRAs.">'+ "\n" +
                                    '  <meta name="description" content="CRA Assessments is a more objective and cost effective method for assessing CRA monitoring quality and evaluating CRA performance. The performance information provided by the Assessment can be used by pharmaceutical research professionals to determine whether or not CRAs meet the desired performance levels, training requirements, and remediation needs of any current or potential CRAs">'+ "\n" +
                                    '  <meta http-equiv="cleartype" content="on">'+ "\n" +
                                    '  <meta name="referrer" content="origin">'+ "\n" +
                                    '  <meta name="MobileOptimized" content="320">'+ "\n" +
                                    '  <meta name="HandheldFriendly" content="True">'+ "\n" +
                                    '  <meta name="apple-mobile-web-app-capable" content="yes">' + "\n" +
                                    '  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'+ "\n" +
                                    `  <meta property="csp-nonce" content="${nonce}"/>\n`+ 
                                    '  <script src="https://www.google.com/recaptcha/api.js?render=6LdQG_wUAAAAAMup-zrZwo0u8R1HCyayc4_SeFy7"></script>' + "\n" +
                                    '  <link rel="icon" href="/favicon.ico?v=2" />');

                                    
    /**
    Moves all javascripts to the end of the body, so we can inject the loading screen
    */
//    Inject.rawModHtml('moveScriptsToBottom', function(html) {
//     // get all scripts
//     var scripts = html.match(/<script type="text\/javascript" src.*"><\/script>\n/g);
//     // var styles = html.match(/<style type="text\/css">*<\/style>\n/g);
    
//     var styles = html.match(/<style type="text\/css">/);
//     // var styles = html.match(/<script type="text\/javascript">/g);
// console.log(scripts, styles)
//     // if found
//     // if(!_.isEmpty(styles)) {
//     if(styles) {
//         // remove all scripts
//         html = html.replace(/<style type="text\/css">/g, '<style type="text/css" nonce>');
//         // add scripts to the bottom
//         // html = html.replace(/<\/body>/, scripts.join('') + '\n</body>');
//         return html.replace(/[\n]+/g,"\n").replace(/ +/g,' ');

//     // otherwise pass the raw html through
//     } else {
//         return html.replace(/[\n]+/g,"\n").replace(/ +/g,' ');
//     }
// });        

        var fs = Npm.require('fs');
        var path = Npm.require('path');

        var mime = {
          lookup: (function() {

            var mimeTypes = {
                ".css":  "text/css",
                ".less":  "text/css",
                ".scss":  "text/css",
              ".html":  "text/html",
              ".js":    "application/javascript",
              ".json":  "application/json",
              ".png":   "image/png",
              ".gif":   "image/gif",
              ".jpg":   "image/jpg",
              ".wav":   "audio/wav",
              ".mp3":   "audio/mp3",
              ".xlsx":  "application/vnd.ms-excel",
              ".pdf":  "application/pdf"
            };

            return function(name) {
              var type = mimeTypes[path.extname(name)];
              return type || "text/html";
            };
          }()),
        };

        //-- This is to support <link> to avoid CSP issue with the default stylesheet injection.
        //-- MeteorJS' css import injects css into <style> and causes CSP unsafe-inlie style issue.
        WebApp.connectHandlers.use(function(req, res, next) {
            // console.log(req.url)
            // var re = /\/ui\/stylesheets\/(.*)$/.exec(req.url);
            var re = /(.*?)\.(less|css|scss)$/.exec(req.url);
            // console.log(re)
            if (re !== null) {   // Only handle URLs that start with /uploads_url_prefix/*
                // console.log(process.env.PWD)
                // var filePath = process.env.PWD + '/imports/ui/stylesheets/' + re[1];
                var filePath = process.env.PWD + '/imports/ui/stylesheets' + re[0];
                var data = fs.readFileSync(filePath);
                var mimeType = mime.lookup(filePath);
                res.writeHead(200, {                
                        'Content-Type': mimeType
                    });
                res.write(data);
                res.end();
            } else {  // Other urls will have default behaviors
                next();
            }
        });

