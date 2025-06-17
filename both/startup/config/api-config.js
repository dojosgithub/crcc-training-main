// if(Meteor.isServer) {
//-- Initial API configuration

const apiVersion = "v1"

let __XAuthToken  = 'fBmSSUsBswdP7AgEdWtyroTgfhGzYSSBBdJNBZV3C8J'
let __XUserId     = 'Q7YLK782sBxcPZ9vc'

if(process.env.NODE_ENV === 'development') { //-- Override when in the local dev env.
  __XAuthToken  = 'N_gHnYXAfV-WXCAbp_6H5ZQQniajUrqODcnquh273cR'
  __XUserId     = '3kha3Zwtmg9hkNyMQ'
}

export const APIConfig = {
  apiVersion: apiVersion,
  production: {   
    apiURL: "https://api.craassessments.com/" + apiVersion
  },
  development: {    
    apiURL: "http://localhost:3900/" + apiVersion
  },
  XAuthToken: __XAuthToken,
  XUserId: __XUserId
}

// }
