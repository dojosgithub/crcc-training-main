import { Mongo } from 'meteor/mongo';
  
___isDemo = false;

let configVar = {  
  production: {    
    // coreDBURL: 'mongodb://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/craa_v21_db?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin',
    coreDBURL: "mongodb+srv://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-dsxea.mongodb.net/craa_v21_db",
    fbDBConfig: {
      apiKey: "AIzaSyAFfFkyZ6It1K_2IbP0PNxtMN3TYx58WWw",
      authDomain: "craa-dev-01.firebaseapp.com",
      databaseURL: "https://craa-dev-01-default-rtdb.firebaseio.com",
      projectId: "craa-dev-01",
      storageBucket: "craa-dev-01.appspot.com",
      messagingSenderId: "283612933764",
      appId: "1:283612933764:web:52bf01a7b611401fab9cd1",
      measurementId: "G-SKD11X7THW"
    }
  },
  development: {
    coreDBURL: "mongodb://localhost:27017/craa_v21_db",
    fbDBConfig: {
      // databaseURL: "http://localhost:4000/?ns=dqk-fbtest-01"  
      // databaseURL: "https://dqk-fbtest-01-default-rtdb.firebaseio.com/"  
      // databaseURL: "https://craa-dev-01-default-rtdb.firebaseio.com",
      apiKey: "AIzaSyDNrejKKsUVm05IUy9XNFAVGZVYol7Y1dQ",
      authDomain: "dqk-fbtest-01.firebaseapp.com",
      databaseURL: "https://dqk-fbtest-01-default-rtdb.firebaseio.com",
      projectId: "dqk-fbtest-01",
      storageBucket: "dqk-fbtest-01.appspot.com",
      messagingSenderId: "884164269515",
      appId: "1:884164269515:web:bee5816bf7fe924cd5124e"
    }
    // coreDBURL: 'mongodb://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/craa_v21_db?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin',  
  },
  demo: {
    coreDBURL: "mongodb://localhost:27017/craa_v21_db",
    fbDBConfig: {
      // databaseURL: "http://localhost:4000/?ns=dqk-fbtest-01"  
      // databaseURL: "https://dqk-fbtest-01-default-rtdb.firebaseio.com/"  
      // databaseURL: "https://craa-dev-01-default-rtdb.firebaseio.com",
      apiKey: "AIzaSyDNrejKKsUVm05IUy9XNFAVGZVYol7Y1dQ",
      authDomain: "dqk-fbtest-01.firebaseapp.com",
      databaseURL: "https://dqk-fbtest-01-default-rtdb.firebaseio.com",
      projectId: "dqk-fbtest-01",
      storageBucket: "dqk-fbtest-01.appspot.com",
      messagingSenderId: "884164269515",
      appId: "1:884164269515:web:bee5816bf7fe924cd5124e"
    }
    // coreDBURL: 'mongodb://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/craa_v21_db?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin',  
  }  
}

console.log("db-config isDemo: ", ___isDemo);

if(___isDemo) {

  // if(Meteor.isServer) {

  //   let _coreDBURL = configVar['demo'].coreDBURL
  
  //   export const CoreDB = new MongoInternals.RemoteCollectionDriver(_coreDBURL);  
  
  // }
  
  // export const FBDBConfig = configVar['demo'].fbDBConfig;   

} else {

if(Meteor.isServer) {

  let _coreDBURL = configVar[process.env.NODE_ENV].coreDBURL

  export const CoreDB = new MongoInternals.RemoteCollectionDriver(_coreDBURL);  

}

export const FBDBConfig = configVar[process.env.NODE_ENV].fbDBConfig;   
// export const FBDBConfig = configVar.production.fbDBConfig;   

}
