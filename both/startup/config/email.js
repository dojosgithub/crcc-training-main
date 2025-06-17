if(Meteor.isServer) {
//-- Initial Email SMTP config 
const smtp = {
  //--  Signature Version 2 (expires on 03/27/2021)
  // username: 'AKIAIISDBEKJBKAD2ITA',
  // password: 'AjxG13bLoS2V1llpFVcDFx/7BuISOYgW/R5461KoO09U',
  //- Signature Version 4
  // AYAZ: Commented out the username and password mentioned below and added new keys as env 
    // username: 'AKIATT3YAI4A3KQEWZX5',
    // password: 'BC5xjs27J1sFATfrIQ6PQ3naPySJb4euAt6+hlpKxrD3',

    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  server:   'email-smtp.us-east-1.amazonaws.com',
  port: 465
}

// process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
process.env.MAIL_URL = 'smtps://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

}
	