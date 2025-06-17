/**
 * Admin All Videos template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'

import { updateVideoStatus, countTotalVideos, countSearchResult } from '/both/api/methods/training-module-videos.js'

// import '/imports/ui/stylesheets/admin/videos/admin-all-videos.less'
import { AdminAllVideos } from '/imports/ui/pages/admin/videos/admin-all-videos.html'

import { AdminVideoEdit } from '/imports/ui/pages/admin/videos/admin-video-edit.js'

import { AdminVideoTemplate } from '/imports/ui/pages/admin/videos/admin-video-template.js'

let _selfAdminAllVideos
let _subsAdminAllVideos

Template.AdminAllVideos.onCreated(function adminAllVideosOnCreated() {

  _selfAdminAllVideos = this

  _subsAdminAllVideos = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 10,
    // any subscription will be expire after 1 minute, if it's not subscribed again
    expireIn: 1
  })

  // _selfAdminAllVideos.ready4Videos = new ReactiveVar() 
  _selfAdminAllVideos.ready = new ReactiveVar()
  _selfAdminAllVideos.videoToEdit = new ReactiveVar()

  _selfAdminAllVideos.searchReady = new ReactiveVar()

  _selfAdminAllVideos.total = new ReactiveVar(0)
  _selfAdminAllVideos.numPages = new ReactiveVar(0)
  _selfAdminAllVideos.curPage = new ReactiveVar(1)

  _selfAdminAllVideos.keyword = new ReactiveVar(null)

  _selfAdminAllVideos.table = new ReactiveVar(true)  
  
  _selfAdminAllVideos.pageLimit = new ReactiveDict()
  _selfAdminAllVideos.pageLimit.set('page', 1)
  _selfAdminAllVideos.pageLimit.set('limit', 10)

  _selfAdminAllVideos.autorun(() => {
    // let handleVideos = _subsAdminAllVideos.subscribe('all_training_module_videos')
    // _selfAdminAllVideos.ready4Videos.set(handleVideos.ready())


    let pageLimitObj = {
      page: _selfAdminAllVideos.pageLimit.get('page'),
      limit: _selfAdminAllVideos.pageLimit.get('limit')
    }

    if(_selfAdminAllVideos.keyword.get()) {

      pageLimitObj.keyword = _selfAdminAllVideos.keyword.get()

      // let handleSearchAdminAllVideos = _subsAdminAllVideos.subscribe('training_module_videos_w_keyword_limit', pageLimitObj)
      // _selfAdminAllVideos.searchReady.set(handleSearchAdminAllVideos.ready())
    } else {
      let handleAdminAllVideos = _subsAdminAllVideos.subscribe('training_module_videos_w_page_limit', pageLimitObj)
      _selfAdminAllVideos.ready.set(handleAdminAllVideos.ready())
    }

  })

  countTotalVideos.call(null, (err, res) => {    
    _selfAdminAllVideos.total.set(res)
  })

})

Template.AdminAllVideos.helpers({
  Videos() {

    if(_selfAdminAllVideos.ready.get() 
      || _selfAdminAllVideos.keyword.get()) {

      let videos = TrainingModuleVideos.find()

      if(videos.fetch().length > 0) {        

        return videos
      }
    }

  },
  videoToEdit() {
    return _selfAdminAllVideos.videoToEdit.get()
  },
  videoTableSelector() {
    return {
      status: {$ne: 4}
    }
  },
  viewTable() {
    return _selfAdminAllVideos.table.get()
  },
  total() {
    let total = _selfAdminAllVideos.total.get()
    let numPages = Math.floor(total / _selfAdminAllVideos.pageLimit.get('limit'))+1

    _selfAdminAllVideos.numPages.set(numPages)
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
  totalNumVideos() {
    return _selfAdminAllVideos.total.get()
  }      
})

Template.AdminAllVideos.events({
  'click .btn-view-video'(e, tpl) {
    alert("Play the video and make it fullscreen for this for now.")
  },
  'click .btn-delete-video'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this video?")) {
      let vid = $(e.currentTarget).parent().data('vid')

      let video = {
        _id: vid,
        status: 4
      }

      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })
    }
  },
  'click .btn-edit-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')

    _selfAdminAllVideos.videoToEdit.set(vid)

    $('.row-admin-video-edit').show()

  },
  'click .btn-activate-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')   
   
    if(confirm("Are you sure to activate this video?")) {

      let video = {
        _id: vid,
        status: 1
      }
      
      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully activated.")
        }
      })

    }
  },
  'click .btn-deactivate-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')   

    if(confirm("Are you sure to deactivate this video?")) {

      let video = {
        _id: vid,
        status: 2
      }
      
      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deactivated.")
        }
      })
 
    }
  },
  'click .btn-view-video-table'(e, tpl) {
    e.preventDefault()

    let tableOn = $(e.currentTarget).data('on')

    _selfAdminAllVideos.table.set(tableOn)
  }, 
  'change #sel_thumbs_per_page'(e, tpl) {
    e.preventDefault()

    _subsAdminAllVideos.clear()

    let thumbsPerPage = $(e.currentTarget).val()

    _selfAdminAllVideos.pageLimit.set('limit', parseInt(thumbsPerPage))
    _selfAdminAllVideos.pageLimit.set('page', 1)

    $('.ul-admin-all-videos-thumbs-page li').removeClass('active')

    $(".ul-admin-all-videos-thumbs-page li").eq(1).addClass('active')

  },
  'click .ul-admin-all-videos-thumbs-page li'(e, tpl) {
    e.preventDefault()

    let page = $(e.currentTarget).data('page')
    let numPages = _selfAdminAllVideos.numPages.get()
    let curPage = parseInt(_selfAdminAllVideos.curPage.get())
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

      _subsAdminAllVideos.clear()

      $('.ul-admin-all-videos-thumbs-page li').removeClass('active')

      _selfAdminAllVideos.curPage.set(nCurPage)    

      _selfAdminAllVideos.pageLimit.set('page', nCurPage)      
    }

    $(".ul-admin-all-videos-thumbs-page li").eq(_selfAdminAllVideos.curPage.get()).addClass('active')

  },
  'click .btn-search-thumbs-videos'(e, tpl) {
  // 'change #search_thumbs'(e, tpl) { //-- Too slow
    e.preventDefault()

    let keyword = $('#search_thumbs').val()

    if(keyword !== '') {

      _subsAdminAllVideos.clear()

      _selfAdminAllVideos.keyword.set(keyword)

      // if(_selfAdminAllVideos.searchReady.get()) {
        
      //   let total = TrainingModuleVideosCFS.find().fetch().length


      //   console.log(total, TrainingModuleVideosCFS.find().fetch())

      //   _selfAdminAllVideos.total.set(total)
      // }
      
    let pageLimitObj = {
      // page: _selfAdminAllVideos.pageLimit.get('page'),
      // limit: _selfAdminAllVideos.pageLimit.get('limit'),
      keyword: keyword
    }

// console.log(keyword)

      countSearchResult.call(pageLimitObj, (err, res) => {
        if(res) {
          // console.log(res)
          _selfAdminAllVideos.total.set(res)
        }
      })

    } else {
      _selfAdminAllVideos.keyword.set(null)
      countTotalVideos.call(null, (err, res) => {    
        _selfAdminAllVideos.total.set(res)
      })      
    }
  }    
})

Template.AdminAllVideos.onDestroyed(function adminAllVideosOnDestroyed() {
  // _subsAdminAllVideos.reset()
  _subsAdminAllVideos.clear()
})




