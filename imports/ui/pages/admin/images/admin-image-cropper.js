/**
 * Image Cropper template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

// import '/imports/ui/stylesheets/admin/images/admin-image-cropper.less'
import { ImageCropper } from '/imports/ui/pages/admin/images/admin-image-cropper.html' 


Template.ImageCropper.onRendered(function imageCropperOnRendered() {
  // let imageToCrop = document.getElementById('imageCropperSrc')

  // _cropper = new Cropper(imageToCrop)  
})

Template.ImageCropper.events({
 'click .btn-save-cropped-image'(e, tpl) {
    e.preventDefault()

    let opt = $(e.target).data('opt')

    let fileObj = new FS.File()

    // let _croppedDataURL = Session.get('_croppedDataURL')

    if(_croppedDataURL && _croppedDataURL.dataURL) {

      fileObj.attachData(_croppedDataURL.dataURL, {type: _croppedDataURL.fileFormat}, function(err) {
        //-- Set original version
        fileObj.name(_croppedDataURL.fileName),
        fileObj.type(_croppedDataURL.fileFormat),
        fileObj.updatedAt(new Date),
        fileObj.status = 1

        //-- Set for the version in a store (this doesn't get the exact metadata for size etc.)
        // fileObj.name(_croppedDataURL.fileName, {store: 'thumbs'}),
        // fileObj.type(_croppedDataURL.fileFormat, {store: 'thumbs'}),
        // fileObj.updatedAt(new Date, {store: 'thumbs'})

        fileObj.metadata = {
          owner: Meteor.userId()
        }

        TrainingModuleImagesCFS.insert(fileObj, function (err, fileObj) {
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
          if(err) {
            // console.log("err => ", err)
            sAlert.error("Something went wrong. Please try again.")
          } else {
            
            if(fileObj && fileObj._id) {
              sAlert.info("Successfully done.")
              
              if(typeof uploadedImageIds !== 'undefined') {
                uploadedImageIds.push(fileObj._id)
                _selfAdminNewImage.uploadedImageIds.set(uploadedImageIds)
              }

              if(opt === 'update') {
                TrainingModuleImagesCFS.update(_croppedDataURL.originId, {
                  $set: {status: 4}
                })
              }
            } else {
              sAlert.error("Something went wrong. Please try again.")
            }
          }
        });
      })
    } else {
      sAlert.warning("Data is not enough to process. Please crop again.")
    }
 },
 'click .btn-close-image-cropper'(e, tpl) {
    e.preventDefault()    

    // _croppedDataURL= null

    //-- This is tricky, but, critical to renew the target image
    //-- in the cropper area
    if(_cropper) {
      _cropper.destroy()
      // _cropper.reset()
      // _cropper.clear()
    }
    
    $('.cropper-container').remove()

    // $('#imageCropperSrc').removeAttr('src')

    $('.row-image-cropper').hide()

    // Template.AdminNewImage.__helpers.get("test").call();
    // Meteor._reload.reload();
 }, 
})
