/**
 *  Admin All Images template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import Cropper from 'cropperjs'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

// import '/imports/ui/stylesheets/admin/images/admin-all-images.less'
import { AdminAllImages } from '/imports/ui/pages/admin/images/admin-all-images.html'

import { deleteImage, countTotalImages, countSearchResult } from '/both/api/methods/training-module-images.js'

import { AdminImageEdit } from '/imports/ui/pages/admin/images/admin-image-edit.js'

import { AdminImageTemplate } from '/imports/ui/pages/admin/images/admin-image-template.js'

let _selfAdminAllImages
let _subsAdminAllImages

Template.AdminAllImages.onCreated(function adminAllImagesOnCreated() {

  _selfAdminAllImages = this
  _subsAdminAllImages = new SubsManager()

  _selfAdminAllImages.ready = new ReactiveVar()
  _selfAdminAllImages.searchReady = new ReactiveVar()

  _selfAdminAllImages.total = new ReactiveVar(0)
  _selfAdminAllImages.numPages = new ReactiveVar(0)
  _selfAdminAllImages.curPage = new ReactiveVar(1)

  _selfAdminAllImages.keyword = new ReactiveVar(null)

  _selfAdminAllImages.table = new ReactiveVar(true)  

  _selfAdminAllImages.imageToCrop = new ReactiveDict()
  _selfAdminAllImages.imageToEdit = new ReactiveVar()
  
  _selfAdminAllImages.pageLimit = new ReactiveDict()
  _selfAdminAllImages.pageLimit.set('page', 1)
  _selfAdminAllImages.pageLimit.set('limit', 20)

  _selfAdminAllImages.autorun(() => {
    // let handleAdminAllImages = _subsAdminAllImages.subscribe('all_training_module_images_cfs')
    let pageLimitObj = {
      page: _selfAdminAllImages.pageLimit.get('page'),
      limit: _selfAdminAllImages.pageLimit.get('limit')
    }

    if(_selfAdminAllImages.keyword.get()) {

      pageLimitObj.keyword = _selfAdminAllImages.keyword.get()

      let handleSearchAdminAllImages = _subsAdminAllImages.subscribe('training_module_images_cfs_w_keyword_limit', pageLimitObj)
      _selfAdminAllImages.searchReady.set(handleSearchAdminAllImages.ready())
    } else {
      let handleAdminAllImages = _subsAdminAllImages.subscribe('training_module_images_cfs_w_page_limit', pageLimitObj)
      _selfAdminAllImages.ready.set(handleAdminAllImages.ready())
    }
  })

  countTotalImages.call(null, (err, res) => {    
    _selfAdminAllImages.total.set(res)
  })

})

Template.AdminAllImages.onRendered(function adminAllImageOnRendered() {
})

Template.AdminAllImages.helpers({
  Images() {
    if(_selfAdminAllImages.ready.get() 
      || _selfAdminAllImages.keyword.get()) {
      let images = TrainingModuleImagesCFS.find()

      // if(_selfAdminAllImages.keyword.get()) {
      //   _selfAdminAllImages.total.set(images.fetch().length)
      // }

      if(images.fetch().length > 0) {        

        return images        
      }
    }
  },
  imageToEdit() {
    return _selfAdminAllImages.imageToEdit.get()
  },
  imageTableSelector() {
    return {
      status: {$ne: 4}
    }
  },
  viewTable() {
    return _selfAdminAllImages.table.get()
  },
  total() {
    let total = _selfAdminAllImages.total.get()
    let numPages = Math.floor(total / _selfAdminAllImages.pageLimit.get('limit'))+1

    _selfAdminAllImages.numPages.set(numPages)
    // return Array.apply(null, {length: numPages+2}).map(()=> null)

    let initPageArray = Array.apply(null, {length: numPages}).map(()=> null)
    let length = initPageArray.length

    let pageArray = []

    let li = '<li data-page="prev">Prev</li>'
    pageArray.push(li)

    if(length > 0) {
      for(i = 0; i < length; i++) {
        let p = i+1

        let active = i === 0 ? 'active' : ''
        
        li = '<li data-page="'+p+'" class="'+active+'">' + p + '</li>'

        pageArray.push(li)        
      }
    }

    li = '<li data-page="next">Next</li>'
    pageArray.push(li)

    return pageArray
  },
  totalNumImages() {
    return _selfAdminAllImages.total.get()
  }
})

Template.AdminAllImages.events({
  'click .btn-crop-image'(e, tpl) {
    e.preventDefault()

    let imageId = $(e.currentTarget).parent().parent().data('iid')

    if(imageId !== '') {
      _cropper = null
      _croppedDataURL = null

      let originImage = TrainingModuleImagesCFS.findOne(imageId)

      _selfAdminAllImages.imageToCrop.set('originId', imageId)
      _selfAdminAllImages.imageToCrop.set('originName', originImage.original.name)
      _selfAdminAllImages.imageToCrop.set('originType', originImage.original.type)

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
                  fileName: _selfAdminAllImages.imageToCrop.get('originName'),
                  fileFormat: _selfAdminAllImages.imageToCrop.get('originType'),
                  originId: _selfAdminAllImages.imageToCrop.get('originId')
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
  'click .btn-edit-image'(e, tpl) {
    e.preventDefault()

    let imageId = $(e.currentTarget).parents('.admin-all-images-edit-icons').data('iid')

    _selfAdminAllImages.imageToEdit.set(imageId)

    $('.row-admin-image-edit').show()    

  },
  'click .btn-delete-image'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to remove this image?")) {
      let imageId = $(e.currentTarget).parents('.admin-all-images-edit-icons').data('iid')    

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
  'click .btn-view-image-table'(e, tpl) {
    e.preventDefault()

    let tableOn = $(e.currentTarget).data('on')

    _selfAdminAllImages.table.set(tableOn)
  },
  'change #sel_thumbs_per_page'(e, tpl) {
    e.preventDefault()

    _subsAdminAllImages.clear()

    let thumbsPerPage = $(e.currentTarget).val()

    _selfAdminAllImages.pageLimit.set('limit', parseInt(thumbsPerPage))
    _selfAdminAllImages.pageLimit.set('page', 1)

    $('.ul-admin-all-images-thumbs-page li').removeClass('active')

    $(".ul-admin-all-images-thumbs-page li").eq(1).addClass('active')

  },
  'click .ul-admin-all-images-thumbs-page li'(e, tpl) {
    e.preventDefault()

    let page = $(e.currentTarget).data('page')
    let numPages = _selfAdminAllImages.numPages.get()
    let curPage = parseInt(_selfAdminAllImages.curPage.get())
    let nCurPage = curPage

    if(page === 'next') {
      if(curPage < numPages) {
        nCurPage = curPage +1
      }
    }
    else if(page === 'prev') {
      if(curPage > 1) {
        nCurPage = curPage -1
      }
    } else {
      nCurPage = parseInt(page)
    }

    if(curPage !== nCurPage) {

      _subsAdminAllImages.clear()

      $('.ul-admin-all-images-thumbs-page li').removeClass('active')

      _selfAdminAllImages.curPage.set(nCurPage)    

      _selfAdminAllImages.pageLimit.set('page', nCurPage)      
    }

    $(".ul-admin-all-images-thumbs-page li").eq(_selfAdminAllImages.curPage.get()).addClass('active')

  },
  'click .btn-search-thumbs-images'(e, tpl) {
  // 'change #search_thumbs'(e, tpl) { //-- Too slow
    e.preventDefault()

    let keyword = $('#search_thumbs').val()

    if(keyword !== '') {

      _subsAdminAllImages.clear()

      _selfAdminAllImages.keyword.set(keyword)

      // if(_selfAdminAllImages.searchReady.get()) {
        
      //   let total = TrainingModuleImagesCFS.find().fetch().length


      //   console.log(total, TrainingModuleImagesCFS.find().fetch())

      //   _selfAdminAllImages.total.set(total)
      // }
      
    let pageLimitObj = {
      // page: _selfAdminAllImages.pageLimit.get('page'),
      // limit: _selfAdminAllImages.pageLimit.get('limit'),
      keyword: keyword
    }

// console.log(keyword)

      countSearchResult.call(pageLimitObj, (err, res) => {
        if(res) {
          _selfAdminAllImages.total.set(res)
        }
      })

    } else {
      _selfAdminAllImages.keyword.set(null)
      countTotalImages.call(null, (err, res) => {    
        _selfAdminAllImages.total.set(res)
      })      
    }
  },
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

Template.AdminAllImages.onDestroyed(function adminAllImagesOnDestroyed() {
  _subsAdminAllImages.clear()
})

