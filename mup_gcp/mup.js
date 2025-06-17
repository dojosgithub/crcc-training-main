module.exports = {
  servers: {
    one: {
      host: '34.105.244.153',
      username: 'david_kim',      
      "pem": "/Users/david/.ssh/gcp-craa-dr-dev-ce-03.pem",
      opts: {
        // port: 
      }
    },
  },
  meteor: {
    name: 'craa-v2-tr-dr-gcp-01-2020',
    path: '../',
    servers: {
      one: {},
    },
    port: 3200,
    env: {
      ROOT_URL: 'https://gcptrfkpekdbnzcvlykp5mqfylnlzbnetu6tag0nc.craassessments.com',
      // ROOT_URL: 'https://trfkpekdbnzcvlykp5mqfylnlzbnetu6tag0nc.craassessments.com',
      // CDN_URL: "https://d6jtpec20q1a9.cloudfront.net",
      // MONGO_URL: "mongodb://craaTR17DBAdmin:tbR*7#bHh1B@34.206.143.130:3201/craa-v2-tr"
      // MONGO_URL: 'mongodb://CRAATrainingDBUser:mQ5z80Mk9YgCPxuR@craatrainingcluster-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-02-mnnwl.mongodb.net:27017/craa-v2-tr?ssl=true&replicaSet=CRAATrainingCluster-shard-0&authSource=admin',
      // MONGO_URL: 'mongodb://CRAATrainingDBAdmin:TrbWYe8JzmTEGYcn@craatrainingcluster-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-02-mnnwl.mongodb.net:27017/craa-v2-tr?ssl=true&replicaSet=CRAATrainingCluster-shard-0&authSource=admin',
      // MONGO_URL: 'mongodb://CRAATrainingDBAdmin:TrbWYe8JzmTEGYcn@craatrainingcluster2-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster2-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster2-shard-00-02-mnnwl.mongodb.net:27017/test?ssl=true&replicaSet=craatrainingcluster2-shard-0&authSource=admin',
      // MONGO_URL: 'mongodb://CRAATrainingDBAdmin:TrbWYe8JzmTEGYcn@craatrainingcluster-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-02-mnnwl.mongodb.net:27017/craa-v2-tr?ssl=true&replicaSet=CRAATrainingCluster-shard-0&authSource=admin',
      // MONGO_OPLOG_URL: 'mongodb://CRAATrainingOpLogUser:hXe0W3bBeZOj3ZEC@craatrainingcluster-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster-shard-00-02-mnnwl.mongodb.net:27017/local?ssl=true&replicaSet=CRAATrainingCluster-shard-0&authSource=admin'
      // MONGO_OPLOG_URL: 'mongodb://CRAATrainingOpLogUser:hXe0W3bBeZOj3ZEC@craatrainingcluster2-shard-00-00-mnnwl.mongodb.net:27017,craatrainingcluster2-shard-00-01-mnnwl.mongodb.net:27017,craatrainingcluster2-shard-00-02-mnnwl.mongodb.net:27017/local?ssl=true&replicaSet=CRAATrainingCluster-shard-0&authSource=admin'
      // MONGO_URL: 'mongodb://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/craa_v21_db?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin',
      // MONGO_OPLOG_URL: 'mongodb://CRAADBOpLogUser:MVwLMRwWmNFU10cS@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/local?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin'
      // MONGO_URL: 'mongodb://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/craa-v2-tr?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin',
      // MONGO_OPLOG_URL: 'mongodb://CRAADBOpLogUser:MVwLMRwWmNFU10cS@craaclusterv2-shard-00-00-dsxea.mongodb.net:27017,craaclusterv2-shard-00-01-dsxea.mongodb.net:27017,craaclusterv2-shard-00-02-dsxea.mongodb.net:27017/local?ssl=true&replicaSet=CRAAClusterV2-shard-0&authSource=admin'      
      MONGO_URL: "mongodb+srv://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2-dsxea.mongodb.net/craa-v2-tr",
      MONGO_OPLOG_URL: "mongodb+srv://CRAADBOpLogUser:MVwLMRwWmNFU10cS@craaclusterv2-dsxea.mongodb.net/local"       
    },
    docker: {
      // image: 'abernix/meteord:node-4.7.0-base', // use this image for Meteor 1.4+ 
      // image: 'davidqwk/meteord-graphicsmagick:base', // use this image for Meteor 1.4+ 
      // image: 'abernix/meteord:node-8.9.4-base' //-- use this image for Meteor 1.6+  
      // image: 'davidqwk/meteord-8.9.4-graphicsmagick' //-- use this image for Meteor 1.6+  
      image: 'abernix/meteord:node-8.11.3-base', //-- use this image if using Meteor 1.6+, 1.7+  
      buildInstructions: [
        'RUN apt-get update && apt-get install -y imagemagick'
      ],
      // bind: '127.0.0.1'
    },
    volumes: {
      '/temp/craa_tr_images':'/temp/craa_tr_images'
    },       
    // ssl: {
    //   port: 443,
    //   crt: '/Users/david/Dev/ssl/2017_2/craassessments.chained.crt',
    //   key: '/Users/david/Dev/ssl/2017_2/craassessments.key',
    // },   
    deployCheckWaitTime: 120,
    enableUploadProgressBar: true
  },
  // proxy: {
  //   domains: 'training.craassessments.com',
  //   ssl: {
  //     // Enable let's encrypt to create free certificates.
  //     // The email is used by Let's Encrypt to notify you when the
  //     // certificates are close to expiring.
  //     letsEncryptEmail: 'david.kim@craassessments.com',
  //     forceSSL: true
  //   }
  // }
  proxy: {
    // domains: 'craassessments.com,trfkpekdbnzcvlykp5mqfylnlzbnetu6tag0nc.craassessments.com,training.craassessments.com', //-- this is critical, otherwise 503 error will happen..
    domains: 'craatrainingdr.craassessments.com,gcptrfkpekdbnzcvlykp5mqfylnlzbnetu6tag0nc.craassessments.com', //-- this is critical, otherwise 503 error will happen..
    ssl: {
      // Enable let's encrypt to create free certificates.
      // The email is used by Let's Encrypt to notify you when the
      // certificates are close to expiring.
      // letsEncryptEmail: 'david.kim@craassessments.com',
      crt: '/Users/david/Dev_app1/keys/fullchain.cer',
      key: '/Users/david/Dev_app1/keys/craassessments.com.key',      
      forceSSL: true
    }
  },   

  // mongo: {
  //   oplog: true,
  //   // port:  3901, // not working
  //   port:  27017, 
  //   servers: {
  //     one: {},
  //   },
  // }   
};

