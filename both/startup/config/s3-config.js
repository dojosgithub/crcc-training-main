console.log("s3-config isDemo: ", ___isDemo);

if (Meteor.isServer) {
  let s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucket: "craav2-training",
    bucket_media: "craav2-media",
    cfdomain: "https://d384ifhlhq9jlf.cloudfront.net",
    region: "us-east-1",
    // region: 'eu-west-1' // Only needed if not "us-east-1" or "us-standard"
  };

  if (___isDemo) {
    s3Config = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      bucket: "elasticbeanstalk-us-east-1-248822908673",
      bucket_media: "elasticbeanstalk-us-east-1-248822908673",
      cfdomain: "https://d384ifhlhq9jlf.cloudfront.net",
      region: "us-east-1",
      // region: 'eu-west-1' // Only needed if not "us-east-1" or "us-standard"
    };
  }

  export { s3Config };
}

//-- when this app is deployed to GCP, cfs-s3 package crashes the app, so, it should be removed,
//-- and also logic blocks (eg. FS.store.S3() in training-module-images.js training-module-audios.js
//-- should be blocked accordingly...
___isOnAWS = true;
