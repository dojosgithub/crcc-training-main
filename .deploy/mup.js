module.exports = {
  servers: {
    one: {
      host: '54.174.250.26',
      username: 'ubuntu',      
      // "pem": "/Users/david/.ssh/craa_tr_17.pem",
      pem: 'E:\\.ssh\\craa_tr_17.pem',
      opts: {
        // port: 
      }
    },
  },
  meteor: {
    name: 'craa-v2-tr',
    path: '../',
    servers: {
      one: {},
    },
    port: 3200,
    env: {
      ROOT_URL: 'https://training.craassessments.com',      
      CDN_URL: "https://d6jtpec20q1a9.cloudfront.net",
      MONGO_URL: "mongodb+srv://CRAADBUser:1IN76KjEVnmlthPB@craaclusterv2.dsxea.mongodb.net/craa_v21_db?retryWrites=true&w=majority",
      MONGO_OPLOG_URL: "mongodb+srv://CRAADBOpLogUser:MVwLMRwWmNFU10cS@craaclusterv2-dsxea.mongodb.net/local"       
    },
    docker: {
      image: 'abernix/meteord:node-12-base', //-- use this image for Meteor 1.10+
      buildInstructions: [
        'RUN apt-get update && apt-get install -y imagemagick'
      ],
      // bind: '127.0.0.1'
    },
    volumes: {
      '/temp/craa_tr_images':'/temp/craa_tr_images'
    },        
    deployCheckWaitTime: 120,
    enableUploadProgressBar: true
  },
  proxy: {
    domains: 'training.craassessments.com',
    ssl: {
      // Enable let's encrypt to create free certificates.
      // The email is used by Let's Encrypt to notify you when the
      // certificates are close to expiring.
      // letsEncryptEmail: 'david.kim@craassessments.com',
      // crt: '/Users/david/Dev_core/Dev_app/keys/fullchain.cer',
      // key: '/Users/david/Dev_core/Dev_app/keys/craassessments.com.key',      
      crt: 'E:\\Dev_core\\Dev_app\\keys\\fullchain.cer',
      key: 'E:\\Dev_core\\Dev_app\\keys\\craassessments.com.key', 
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

