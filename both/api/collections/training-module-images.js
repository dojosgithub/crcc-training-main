/**
 * CFS based TrainingModuleImages collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import { Template } from 'meteor/templating';

import Tabular from 'meteor/aldeed:tabular'

import { s3Config } from '/both/startup/config/s3-config.js'

import { Util } from '/imports/api/lib/util.js'

// export const TrainingModuleImages = new Mongo.Collection('training_module_images')


let baseDir = '';
if (Meteor.isServer) {
  baseDir = process.env.PWD;
}

let createBase = function(fileObj, readStream, writeStream) {

  gm(readStream).size({ bufferStream: true }, function(err, value) {
      let w = value.width, h = value.height, ratio = 1

      //modify logic here to set the desired output width/height, based on the source width/height
      if (value && value.width > 1660) {
           w = 1660;
           ratio = 1660/value.width
           h = value.height * ratio           
      } 
      if(value && value.height > 900 && h === 150) {
        h = 900;
        ratio = 900/value.height
        w = value.width * ratio
      }

      //"this" is the gm context, so you can chain gm functions to "this" inside the size callback.
      this.resize(w, h).stream().pipe(writeStream);
  });

}

//-- This is for Module Cover Image (230*150), but, cannot be sure if this is needed...
//-- Let's load the base image into the cover image for now, that way the quality
//-- of the cover can be good enough, and the size of the base image itself is not that big... 
//-- (base 100k+ vs. thumb 20k+-)
let createThumb = function(fileObj, readStream, writeStream) {
  gm(readStream).size({ bufferStream: true }, function(err, value) {
      let w = value.width, h = value.height, ratio = 1

      //modify logic here to set the desired output width/height, based on the source width/height
      if (value && value.width > 250) {
           w = 250;
           ratio = 250/value.width
           h = value.height * ratio           
      } 
      if(value && value.height > 250 && h > 250) {
        h = 250;
        ratio = 250/value.height
        w = value.width * ratio
      }

      //"this" is the gm context, so you can chain gm functions to "this" inside the size callback.
      this.autoOrient().resize(w, h).gravity('Center').extent(w, h).stream('PNG').pipe(writeStream);
  });
};

let createSquareThumb = function(fileObj, readStream, writeStream) {
  let size = '100'
  // console.log('gm.isAvailable => ', gm.isAvailable)
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
};

let createSquareThumb2 = function(fileObj, readStream, writeStream) {
  // var size = '96';
  let size = '130' //-- currently, 127*127 is the thumbnail images in All Images, so, this'd be better than 96?
  // console.log('gm.isAvailable => ', gm.isAvailable)
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
};

let s3ImageStoreBase
let s3ImageStoreThumb
// console.log(___isOnAWS)
if(process.env.NODE_ENV === "production" && ___isOnAWS === true) { 

  s3ImageStoreBase = new FS.Store.S3('base', {
    region: s3Config && s3Config.region, //optional in most cases
    accessKeyId: s3Config && s3Config.accessKeyId, //"account or IAM key", //required if environment variables are not set
    secretAccessKey: s3Config && s3Config.secretAccessKey, //"account or IAM secret", //required if environment variables are not set
    bucket: s3Config && s3Config.bucket, // "mybucket", //required
    // ACL: 'public-read-write', // "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
    folder: 'images/base', // "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
    // fileKey: function(fileObj) { return new Date().getTime() + "-" + fileObj.name(); },
    fileKeyMaker(fileObj) {
      // console.log(fileObj)
      // Lookup the copy
      // let store = fileObj && fileObj._getInfo(name) //-- name is not defined?
      // let store = fileObj
      // If the store and key is found return the key
      // if (store && store.key) {return store.key} //-- cannot be sure if this really works

      let filename = fileObj.name()
      // let filenameInStore = fileObj.name({store: name})

      // If no store key found we resolve / generate a key
      // return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename)    
      return fileObj._id + '-base-' + filename 
    },
    // The rest are generic store options supported by all storage adapters
    transformWrite: createBase, //optional
    // transformRead: myTransformReadFunction, //optional
    // maxTries: 1 //optional, default 5
  });

  s3ImageStoreThumb = new FS.Store.S3('thumbs', {
    region: s3Config && s3Config.region, //optional in most cases
    accessKeyId: s3Config && s3Config.accessKeyId, //"account or IAM key", //required if environment variables are not set
    secretAccessKey: s3Config && s3Config.secretAccessKey, //"account or IAM secret", //required if environment variables are not set
    bucket: s3Config && s3Config.bucket, // "mybucket", //required
    // ACL: 'public-read-write', // "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
    folder: 'images/thumbs', // "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
    // fileKey: function(fileObj) { return new Date().getTime() + "-" + fileObj.name(); },
    fileKeyMaker(fileObj) {
      // Lookup the copy
      // let store = fileObj && fileObj._getInfo(name)
      // If the store and key is found return the key
      // if (store && store.key) {return store.key} //-- cannot be sure if this really works

      let filename = fileObj.name()
      // let filenameInStore = fileObj.name({store: name})

      // If no store key found we resolve / generate a key
      // return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename)    
      return fileObj._id + '-thumb-' + filename
    },
    beforeWrite: function(fileObj) {
      // We return an object, which will change the
      // filename extension and type for this store only.
      return {
        extension: 'png',
        type: 'image/png'
      };
    },
    // The rest are generic store options supported by all storage adapters
    transformWrite: createSquareThumb, //-- 96*96
    // transformWrite: createThumb, //-- 250*
    // transformWrite: createSquareThumb2, //-- 130*130
    // transformRead: myTransformReadFunction, //optional
    // maxTries: 1 //optional, default 5
  });

}

//-- We are not going for GF for now.
// let gridfs = new FS.Store.GridFS('gridfsimages', {
//     transformWrite: function(fileObj, readStream, writeStream) {
//         // Store 10x10 px images
//         this.gm(readStream, fileObj.name).resize('10', '10').stream().pipe(writeStream);
//         // To pass through stream:
//         //readStream.pipe(writeStream);
//     }     
// });

let stores = []

if(process.env.NODE_ENV === "production") { 
  stores = [s3ImageStoreBase, s3ImageStoreThumb]
} else {
  stores = [ 
      new FS.Store.FileSystem('thumbs', {
        // path: baseDir + '/temp/craa_tr_images/thumbs',
        // path: '/temp/craa_tr_images/thumbs',
        // path: baseDir + 'public/temp/images/thumbs~',
        path: 'temp/images/thumbs', //-- this will be .meteor/local/build/programs/server/temp/images/thumbs
        transformWrite: createSquareThumb 
      }),
      new FS.Store.FileSystem('base', { 
        // path: baseDir + '/temp/craa_tr_images/base',
        // path: '/temp/craa_tr_images/base',
        // path: baseDir + 'public/temp/images/base~',
        path: 'temp/images/base',
        transformWrite: createBase
      })
  ]
}

if(___isOnAWS) {

  export const TrainingModuleImagesCFS = new FS.Collection('training_module_images_cfs', {
    stores: stores,
    filter: {
      maxSize: 5242880, // 5M in bytes
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
  });


//-- Images collection table
TabularTables = {};

TabularTables.TrainingModuleImagesCFS = new Tabular.Table({
 name: "TrainingModuleImagesCFS",
 collection: TrainingModuleImagesCFS.files,
 order: [[9, 'desc'], [6, 'desc']],
 pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  // skipCount: true,
// pagingType: 'simple', 
// infoCallback: (settings, start, end) => `Showing ${start} to ${end}`,
 language: {
     lengthMenu: "Showing _MENU_ images per page",
     zeroRecords: "No image Data",
     info: "Showing _START_ to _END_ of _TOTAL_ images",
     infoEmpty: "No image records available",
     infoFiltered: "(filtered from _MAX_ total images)",
     processing: ""
 },
 columns: [
  {width: 70, title: "Image",
    createdCell: Meteor.isClient && function (cell, cellData, rowData) {
      return Blaze.renderWithData(Template.AdminImageThumbnail, {
        data: rowData
      }, cell);
    },  
  },
  {data: "label", title: "Name / File", width: 250, render(v,t,d) {
    let label = v || ''
    let nameFile = '<input type="text" class="input-table-image-label" id="input_table_image_label_'+d._id+'" value="'+label+'">'
        nameFile += '<br />'
        nameFile += '<span class="image-table-file-name">' + d.original.name + '</span>'
    return nameFile 
  }},
  {data: "description", title: "Caption", width: 450, render(v, t, d) {
    let desc = v || ''
    return '<textarea class="txta-table-image-desc" id="txta_table_image_desc_'+d._id+'">' + desc + '</textarea>'
  }},
  {data: "original.size", title: "Original", width: 90, render(v,t,d) {
    return '<span class="image-size">' + Util.formatBytes(v) + '</span>'
  }},
  {data: "copies.base.size", title: "Base", width: 90, render(v,t,d) {
    return '<span class="image-size">' + Util.formatBytes(v)+ '</span>'
  }},
  {data: "copies.thumbs.size", title: "Thumb", width: 90, render(v,t,d) {
    return '<span class="image-size">' + Util.formatBytes(v)+ '</span>'
  }},
  {data: "uploadedAt", title: "Created / Modified", width: 200, render(v,t,d) {
    let date
    if(d.modifiedAt) {
      date = '<span class="image-date">' + Util.dateFormatN(v) + '<br />' + Util.dateFormatN(d.modifiedAt) + '</span>'
    } else {
      date = '<span class="image-date">' + Util.dateFormatN(v) + '</span>'
    }
    return date 
  }},
  {width: 150,
    createdCell: Meteor.isClient && function (cell, cellData, rowData) {      
      return Blaze.renderWithData(Template.AdminImageActions, {
        _id: rowData._id
      }, cell);
    },  
  },
  {data: "_id", visible: false},
  {data: "modifiedAt", visible: false},
  {data: "original.name", visible: false},
  {data: "url", visible: false},
 ]   
})

}



