/**
 *  Admin New Image template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import Cropper from 'cropperjs'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

// import '/imports/ui/stylesheets/admin/images/admin-new-image.less'
import { AdminNewImage } from '/imports/ui/pages/admin/images/admin-new-image.html'

import { AdminImageEdit } from '/imports/ui/pages/admin/images/admin-image-edit.js'

// let _selfAdminNewImage //-- Needs to be global for being called inside the cropper
let _subsAdminNewImage

// let uploadedImageIds
// let croppedDataURL

// let _cropper

Template.AdminNewImage.onCreated(function adminNewImageOnCreated() {
  _selfAdminNewImage = this

  uploadedImageIds = []

  _selfAdminNewImage.uploadedImageIds = new ReactiveVar([])
  // _selfAdminNewImage.uploadedImageId = new ReactiveVar([])

  _selfAdminNewImage.uploadedImagesReady = new ReactiveVar()
  _selfAdminNewImage.imageToEdit = new ReactiveVar()

  _selfAdminNewImage.imageToCrop = new ReactiveDict()

  _subsAdminNewImage = new SubsManager()

  _selfAdminNewImage.autorun(() => {

    if(_selfAdminNewImage.uploadedImageIds.get().length > 0) {
      let handleUploadedImagesCFS = _subsAdminNewImage.subscribe('training_module_images_cfs_w_ids', _selfAdminNewImage.uploadedImageIds.get())
      // let handleUploadedImages = _subsAdminNewImage.subscribe('all_training_module_images_cfs')
      _selfAdminNewImage.uploadedImagesReady.set(handleUploadedImagesCFS.ready())
    }

    // if(_selfAdminNewImage.uploadedImageId.get()) {
    //   let handleUploadedImageWId = _subsAdminNewImage.subscribe('training_module_image_w_id', _selfAdminNewImage.uploadedImageId.get())
    //   _selfAdminNewImage.uploadedImageReady.set(handleUploadedImageWId.ready())      
    // }

  })

  // Meteor.subscribe('all_training_module_images')

})

Template.AdminNewImage.onRendered(() => {
  // var myDropzone = new Dropzone(".col-admin-new-image-dropzone");
  // myDropzone.on("addedfile", function(file) {
  //   /* Maybe display some more file information on your page */
  //   console.log(file)
  // });  

  // $(".admin-new-image-dropzone").droppable({
  //     classes: {
  //       "ui-droppable-active": "ui-state-highlight"
  //     },
  //     drop: function(e, ui) {
  //       console.log('dropped', e)
  //     }

  // })
})

Template.AdminNewImage.helpers({
  uploadedImages() {
    let tmi = TrainingModuleImagesCFS.find()
    // console.log(tmi.fetch())
    // if(tmi.fetch().length > 0) {
      return TrainingModuleImagesCFS.find()
    // }
  },
  imageToEdit() {
    return _selfAdminNewImage.imageToEdit.get()
  }
})

Template.AdminNewImage.events({
  // 'change .admin-new-image-single'(e, tpl) {
  //   e.preventDefault()

  //   if (e.currentTarget.files && e.currentTarget.files[0]) {

  //     let file = e.currentTarget.files[0]

  //     let newFile = new FS.File(file);
  //     // newFile.uploadedFrom = Meteor.userId();
  //     newFile.status = 1
  //     newFile.metadata = {
  //       owner: Meteor.userId()
  //     }

  //     let maxChunk = 2097152; //-- 2M
  //     // var maxChunk = 10240; //-- 10K? (this will consume CPU a lot, both server and user browser?)
  //     FS.config.uploadChunkSize =
  //       ( newFile.original.size < 10*maxChunk ) ? newFile.original.size/10 : maxChunk;

  //     TrainingModuleImagesCFS.insert(newFile, function (err, fileObj) {
  //       //If !err, we have inserted new doc with ID fileObj._id, and
  //       //kicked off the data upload using HTTP
  //       if(err) {
  //         // console.log("err => ", err)
  //         toastr.error("Something went wrong. Please try again.")
  //       } else {
  //         // console.log(fileObj)
  //         if(fileObj && fileObj._id) {
  //           // toastr.info("Successfully done.")
  //           // console.log(fileObj.uploadProgress())

  //           let myInterval = setInterval(function () {
  //               // console.log(fileObj.uploadProgress());
  //               if( fileObj.uploadProgress() === 100 
  //                   && fileObj.hasStored('thumbs') 
  //                   && fileObj.hasStored('base')) {
  //                 // console.log('done')
  //                   clearInterval(myInterval);     

  //                   $('.li-image-being-uploaded-'+fileObj._id).fadeOut(1000)

  //               }
  //           }, 100)

  //           uploadedImageIds.push(fileObj._id)
  //           _selfAdminNewImage.uploadedImageIds.set(uploadedImageIds)

  //           // let f = new FS.File(file);
  //           // TrainingModuleImages.insert(f)
  //         } else {
  //           sAlert.error("Something went wrong. Please try again.")
  //         }
  //       }
  //     })
  //   }
  // },
  'change .admin-new-image-multiple'(e, tpl) {
    e.preventDefault()

    if (e.currentTarget.files && e.currentTarget.files[0]) {

      //   let file = e.currentTarget.files[0]
      FS.Utility.eachFile(e, function(file) {

        let newFile = new FS.File(file);
        // newFile.uploadedFrom = Meteor.userId();
        newFile.status = 1
        newFile.metadata = {
          owner: Meteor.userId()
        }

        let maxChunk = 2097152; //-- 2M
        // var maxChunk = 10240; //-- 10K? (this will consume CPU a lot, both server and user browser?)
        FS.config.uploadChunkSize =
          ( newFile.original.size < 10*maxChunk ) ? newFile.original.size/10 : maxChunk;

        TrainingModuleImagesCFS.insert(newFile, function (err, fileObj) {
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
          if(err) {
            // console.log("err => ", err)
            toastr.error("Something went wrong. Please try again.")
          } else {
            // console.log(fileObj)
            if(fileObj && fileObj._id) {
              // toastr.info("Successfully done.")
              // console.log(fileObj.uploadProgress())

              let myInterval = setInterval(function () {
                  // console.log(fileObj.uploadProgress());
                  if( fileObj.uploadProgress() === 100 
                      && fileObj.hasStored('thumbs') 
                      && fileObj.hasStored('base')) {
                    // console.log('done')
                      clearInterval(myInterval);     

                      $('.li-image-being-uploaded-'+fileObj._id).fadeOut(1000)

                  }
              }, 100)

              uploadedImageIds.push(fileObj._id)
              _selfAdminNewImage.uploadedImageIds.set(uploadedImageIds)

              // let f = new FS.File(file);
              // TrainingModuleImages.insert(f)
            } else {
              toastr.error("Something went wrong. Please try again.")
            }
          }
        })
      }) //-- FS.Utility.eachFile
    }
  },
  'dragover .admin-new-image-dropzone'(e, tpl) {
    e.preventDefault()
    $(e.target).addClass('admin-new-image-dragover')
  }, 
  'dragleave .admin-new-image-dropzone'(e, tpl) {
    e.preventDefault()
    $(e.target).removeClass('admin-new-image-dragover')
  },    
  'dropped .admin-new-image-dropzone'(e, tpl) {
    // console.log('dropped', e.target, FS)

    FS.Utility.eachFile(e, function(file) {
      // console.log(file)

      let newFile = new FS.File(file);
      // newFile.uploadedFrom = Meteor.userId();
      newFile.status = 1
      newFile.metadata = {
        owner: Meteor.userId()
      }      

      let maxChunk = 2097152; //-- 2M
      // var maxChunk = 10240; //-- 10K? (this will consume CPU a lot, both server and user browser?)
      FS.config.uploadChunkSize =
        ( newFile.original.size < 10*maxChunk ) ? newFile.original.size/10 : maxChunk;

      TrainingModuleImagesCFS.insert(newFile, function (err, fileObj) {
        //If !err, we have inserted new doc with ID fileObj._id, and
        //kicked off the data upload using HTTP
        if(err) {
          // console.log("err => ", err)
          toastr.error("Please check the file size/format and try again.")
        } else {
          // console.log(fileObj)
          if(fileObj && fileObj._id) {
            // toastr.info("Successfully done.")
            // console.log(fileObj.uploadProgress())

            let myInterval = setInterval(function () {
                // console.log(fileObj.uploadProgress());
                if( fileObj.uploadProgress() === 100 
                    && fileObj.hasStored('thumbs') 
                    && fileObj.hasStored('base')) {
                  // console.log('done')
                    clearInterval(myInterval);     

                    $('.li-image-being-uploaded-'+fileObj._id).fadeOut(1000)

                }
            }, 100)

            uploadedImageIds.push(fileObj._id)
            _selfAdminNewImage.uploadedImageIds.set(uploadedImageIds)

            // let f = new FS.File(file);
            // TrainingModuleImages.insert(f)
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }
      })

    })
  },
   // 'dropped .admin-new-image-dropzone1': cfsInsertFiles(TrainingModuleImages, {
   //    metadata: function (fileObj) {
   //      return {
   //        owner: Meteor.userId(),
   //        foo: "bar"
   //      };
   //    },
   //    after: function (error, fileObj) {
   //      console.log("Inserted", fileObj.name);
   //    }
   //  })
 'click .btn-crop-image'(e, tpl) {
    e.preventDefault()

    // if(typeof _cropper !== 'undefined') {
    //   _cropper.destroy()
    // }
    // _croppedDataURL = null

    let imageId = $(e.target).data('iid')

    if(imageId !== '') {
      _cropper = null
      _croppedDataURL = null

      let originImage = TrainingModuleImagesCFS.findOne(imageId)

      _selfAdminNewImage.imageToCrop.set('originId', imageId)
      _selfAdminNewImage.imageToCrop.set('originName', originImage.original.name)
      _selfAdminNewImage.imageToCrop.set('originType', originImage.original.type)
//       if(typeof _cropper !== 'undefined') {
// console.log(imageId, originImage)
//         // let myCroppedDataURL = {
//         //     dataURL: _cropper.getCroppedCanvas().toDataURL(originImage.original.type),//.toDataURL("image/png"),
//         //     fileName: originImage.original.name,
//         //     fileFormat: originImage.original.type,
//         //     originId: imageId          
//         // }
//         let myCroppedDataURL = Session.get('_croppedDataURL')
//         myCroppedDataURL.fileName = originImage.original.name
//         myCroppedDataURL.fileFormat = originImage.original.type
//         myCroppedDataURL.originId = imageId

//         Session.set('_croppedDataURL', myCroppedDataURL)
// // console.log("my => "+ myCroppedDataURL)
//         _cropper.replace('/cfs/files/training_module_images_cfs/' + imageId)
//         $('.row-image-cropper').show() 

//       } else {

        let imageToCrop = document.getElementById('imageCropperSrc')

        $('#imageCropperSrc').on('load', function() {

          // if(typeof _cropper !== 'undefined') {
          //   _cropper.replace('/cfs/files/training_module_images_cfs/' + imageId)
          // } else {
          _cropper = new Cropper(imageToCrop, {
            autoCrop: true,
            preview: '.image-cropper-preview',
            crop(e) {
              
              if(this.cropper && this.cropper.getCroppedCanvas()) {

                _croppedDataURL = { //-- Will be shared for CFS inside the ImageCropper template 
                  dataURL: this.cropper.getCroppedCanvas().toDataURL(originImage.original.type),//.toDataURL("image/png"),
                  fileName: _selfAdminNewImage.imageToCrop.get('originName'),
                  fileFormat: _selfAdminNewImage.imageToCrop.get('originType'),
                  originId: _selfAdminNewImage.imageToCrop.get('originId')
                }                

                const elements = document.getElementsByClassName("cropper-container");          
                while (elements.length > 1) elements[0].remove();                
              }
            }
          })          

        }).attr('src', '/cfs/files/training_module_images_cfs/'+imageId+'/'+originImage.original.name+'?store=base')       

        $('.row-image-cropper').show()      

      // }
    }
 },
 'click .btn-delete-image'(e, tpl) {
    e.preventDefault()

    let imageId = $(e.target).data('iid')

    if(imageId !== '') {
      if(confirm('Are you sure to delete the image?')) {
        TrainingModuleImagesCFS.update(imageId, {
          $set: {
            status: 2,            
            metadata: {
              deletedAt: new Date,
              deletedBy: Meteor.userId()
            }
          }
        })
      }
    }
 },
 'click .btn-edit-image'(e, tpl) {
  e.preventDefault()

    let imageId = $(e.currentTarget).data('iid')

    _selfAdminNewImage.imageToEdit.set(imageId)

    $('.row-admin-image-edit').show()
 }
})

Template.AdminNewImage.onDestroyed(function adminNewImageOnDestroyed() {
  // _croppedDataURL = null
  _subsAdminNewImage.clear()
})

// function cfsInsertFiles(collection, options) {
//   options = options || {};
//   var afterCallback = options.after;
//   var metadataCallback = options.metadata;

//   function insertFilesHandler(event) {
//     FS.Utility.eachFile(event, function (file) {
//       var f = new FS.File(file);
//       var maxChunk = 2097152;
//       FS.config.uploadChunkSize =
//         (f.original.size < 10 * maxChunk) ? f.original.size / 10 : maxChunk;
//       if (metadataCallback) {
//         FS.Utility.extend(f, metadataCallback(f));
//       }
//       collection.insert(f, afterCallback);
//     });
//   }

//   return insertFilesHandler;
// }

