import { ReactiveVar } from 'meteor/reactive-var'

import './viewport-test-01.html'

import Viewport from '/imports/components/viewport/Viewport.jsx';


let _selfViewportTest01

Template.ViewportTest01.onCreated(() => {
    _selfViewportTest01 = this;

    _selfViewportTest01.parentSlideCompleted = new ReactiveVar(true);
    _selfViewportTest01.showViewport = new ReactiveVar(false);
})

Template.ViewportTest01.onRendered(() => {
    // let iframe = $('.sproutvideo-player')
    // let iframeSrc = $(iframe).attr('src')
  
    // let videoId = iframeSrc.split('embed/')[1].split('/')[0]
    
    // // console.log(videoId);
  
    // if(videoId !== '') {
    //   let player = new SV.Player({videoId: videoId})
  
    //   player.bind('completed', function() {        
    //     _selfViewportTest01.parentSlideCompleted.set(true)      
    //   })  
  
    //   player.bind('progress', function(e) {
    //     _selfViewportTest01.parentSlideCompleted.set(false)   
    //   })
  
    //   player.bind('pause', function() {
    //     _selfViewportTest01.parentSlideCompleted.set(false)
    //   })    
    // }    
});

Template.ViewportTest01.helpers({
    Viewport() {
        return Viewport
    },
    isParentSlideCompleted() {    
        return _selfViewportTest01.parentSlideCompleted.get()
    },
    showViewport() {
        return _selfViewportTest01.showViewport.get()
    }
});

Template.ViewportTest01.events({
    'click .btn-view-viewport'(e, tpl) {
        e.preventDefault();

        console.log(this);

        _selfViewportTest01.showViewport.set(true)

        // $(".row-viewport-container.modal").modal('show')
        $(".row-viewport.modal").show();
    }
});
