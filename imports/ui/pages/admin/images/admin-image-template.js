/**
 *  Admin Image template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'

import Cropper from 'cropperjs'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

import { updateImage, deleteImage } from '/both/api/methods/training-module-images.js'

// import '/imports/ui/stylesheets/admin/images/admin-image-template.less'
import '/imports/ui/pages/admin/images/admin-image-template.html'

let _selfAdminImageTemplate

Template.AdminImageThumbnail.events({
  'click .view-image'(e, tpl) {
    e.preventDefault()

    let iid = $(e.currentTarget).data('iid')
    let url = $(e.currentTarget).data('url')

    let imageObj = {
      _id: iid,
      url: url
    }

    Session.set('imageToView', imageObj)
  }
})

Template.AdminImageActions.onCreated(function adminImageActionsOnCreated() {
  _selfAdminImageTemplate = this

  _selfAdminImageTemplate.imageToCrop = new ReactiveDict()

})

Template.AdminImageActions.events({
  'click .btn-delete-table-image'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to remove this image?")) {
      let imageId = $(e.currentTarget).parent().parent().data('iid')    

      let objImage = {
        _id: imageId,
        status: 4
      }

      deleteImage.call(objImage, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }    

  },
  'click .btn-save-table-image'(e, tpl) {
    e.preventDefault()

    let iid = $(e.currentTarget).parent().parent().data('iid')
    let label = $('#input_table_image_label_'+iid).val()
    let desc = $('#txta_table_image_desc_'+iid).val()

    if(iid !== '') {

      let objImage = {
        _id: iid,
        label: label,
        description: desc
      }

      updateImage.call(objImage, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },
  'click .btn-crop-table-image'(e, tpl) {
    e.preventDefault()

    let imageId = $(e.currentTarget).parent().parent().data('iid')

    if(imageId !== '') {      

      _cropper = null
      _croppedDataURL = null

      let originImage = TrainingModuleImagesCFS.findOne(imageId)

      _selfAdminImageTemplate.imageToCrop.set('originId', imageId)
      _selfAdminImageTemplate.imageToCrop.set('originName', originImage.original.name)
      _selfAdminImageTemplate.imageToCrop.set('originType', originImage.original.type)

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
                  fileName: _selfAdminImageTemplate.imageToCrop.get('originName'),
                  fileFormat: _selfAdminImageTemplate.imageToCrop.get('originType'),
                  originId: _selfAdminImageTemplate.imageToCrop.get('originId')
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
  }  
})

Template.AdminImageModal.helpers({
  Image() {
    
    let image = Session.get('imageToView')
    if(image && image._id) {      
      $('#imageModalSrc > img').attr('src', image.url+'&store=base')
    }
  }
})

