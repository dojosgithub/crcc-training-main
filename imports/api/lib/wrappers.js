/**
 * Wrapper functions
 *
 * @author David Kim <david.kim@craassessments.com>
 */
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

export const Wrapper = {
  /**
   *  wrapAsync wrapper for HTTP call
   *
   *  @param {String|Array} URL string or Array as in [URL, RequestType]
   *  @param {Object}       Header object, (eg.) {X-Auth-Token: XAuthToken, X-User-Id: XUserId}
   */
  httpWrapAsync(url, headers) {

    let apiURL = '' 
    let requestType = 'GET'

    if(typeof url === 'Array') { //-- If Array, it'd be [url, requestType]
      apiURL = url[0]
      requestType = url[1]
    } else {
      apiURL = url
    }

    let requestSync = Meteor.wrapAsync(function(apiURL, callback) {
      
        //-- HTTP.call can be async if callback is omitted, but, when 
        //-- it's placed inside ValidatedMethod with no explicit callback expliclty, 
        //-- issues can be raised, (e.g.)  
        //-- 'Error: Can't make a blocking HTTP call from the client; callback required'.
        //-- Then, we need to wrap it with 'wrapAsync' to deliver its response/resut 
        //-- data to the client safely.
        HTTP.call(requestType, apiURL, {
            headers: headers
        }, function(error, response) {            
            callback(error, response)

        })      
    });

    let result = requestSync(apiURL)

    if(result) {
        return result
    }    
  },
  /**
   *  wrapAsync wrapper for HTTP call
   *
   *  @param {String|Array} URL string or Array as in [URL, RequestType]
   *  @param {Object}       Header object, (eg.) {X-Auth-Token: XAuthToken, X-User-Id: XUserId}
   */
  httpWrapAsyncPOST(url, headers, data) {

    let apiURL = '' 
    let requestType = 'POST'

    if(typeof url === 'Array') { //-- If Array, it'd be [url, requestType]
      apiURL = url[0]
      requestType = url[1]
    } else {
      apiURL = url
    }

    let requestSync = Meteor.wrapAsync(function(apiURL, callback) {
      
        //-- HTTP.call can be async if callback is omitted, but, when 
        //-- it's placed inside ValidatedMethod with no explicit callback expliclty, 
        //-- issues can be raised, (e.g.)  
        //-- 'Error: Can't make a blocking HTTP call from the client; callback required'.
        //-- Then, we need to wrap it with 'wrapAsync' to deliver its response/resut 
        //-- data to the client safely.
        HTTP.call(requestType, apiURL, {
            headers: headers,
            data: data
        }, function(error, response) {            
            callback(error, response)

        })      
    });

    let result = requestSync(apiURL)

    if(result) {
        return result
    }    
  }  
}

//-- Dom selector to get the selected dom object
export const Dom  = {
  elem(selector) {
    return document.getElementById(selector) || document.querySelectorAll(selector)
  }
}

