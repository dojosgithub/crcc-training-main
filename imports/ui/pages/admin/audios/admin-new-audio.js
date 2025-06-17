/**
 *  Admin New Audio template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'
import { updateAudioStatus } from '/both/api/methods/training-module-audios.js'

// import '/imports/ui/stylesheets/admin/audios/admin-new-audio.less'
import { AdminNewAudio } from '/imports/ui/pages/admin/audios/admin-new-audio.html'

import { AdminAudioEdit } from '/imports/ui/pages/admin/audios/admin-audio-edit.js'

let _selfAdminNewAudio
let _subsAdminNewAudio

Template.AdminNewAudio.onCreated(function adminNewAudioOnCreated() {
  _selfAdminNewAudio = this

  uploadedAudioIds = []

  _selfAdminNewAudio.uploadedAudioIds = new ReactiveVar([])
  
  _selfAdminNewAudio.uploadedAudiosReady = new ReactiveVar()  
  _selfAdminNewAudio.uploadedAudio = new ReactiveDict()
  _selfAdminNewAudio.audioToEdit = new ReactiveVar()

  _subsAdminNewAudio = new SubsManager()

  _selfAdminNewAudio.autorun(() => {

    if(_selfAdminNewAudio.uploadedAudioIds.get().length > 0) {
      let handleUploadedTrainingModuleAudiosCFS = _subsAdminNewAudio.subscribe('training_module_audios_cfs_w_ids', _selfAdminNewAudio.uploadedAudioIds.get())
  
      _selfAdminNewAudio.uploadedAudiosReady.set(handleUploadedTrainingModuleAudiosCFS.ready())
    }

  })

})

Template.AdminNewAudio.onRendered(function adminNewAudioOnRendered() {

  Tracker.autorun(() => {
    if(_selfAdminNewAudio.uploadedAudio.get('audioId')) {
      let audioId = _selfAdminNewAudio.uploadedAudio.get('audioId')
      let audioName = _selfAdminNewAudio.uploadedAudio.get('audioName')

      // let audio = document.createElement('audio');
      // audio.src = "/cfs/files/octocolumn_audios_cfs/"+audioId+'/'+audioName
      // $('.admin-new-uploaded-audio-container').append(audio)

      // let audioObj = $('#'+audioId)
      // audioObj.attr('src', "/cfs/files/octocolumn_audios_cfs/"+audioId+'/'+audioName)
      // audioObj.addClass('test')      

      // let container = $(".admin-new-uploaded-audio-container")
      // let audio = new Audio()
      // audio.controls = true
      // audio.src ="/cfs/files/octocolumn_audios_cfs/"+audioId+'/'+audioName
      // container.append(audio)     

      // console.log(audioId, audioName)
    }
  })
})

Template.AdminNewAudio.helpers({
  uploadedAudios() {
    if(_selfAdminNewAudio.uploadedAudioIds.get().length > 0) {
    // if(_selfAdminNewAudio.uploadedAudiosReady.get()) {
      let tma = TrainingModuleAudiosCFS.find()
      // console.log(_selfAdminNewAudio.uploadedAudioIds.get(), tma.fetch())
      // if(tma.fetch().length > 0) {
      // return TrainingModuleAudiosCFS.find()
      // console.log(tma.fetch())
      return tma
    // }
    }
  },
  audioToEdit() {
    return _selfAdminNewAudio.audioToEdit.get()
  }  
})

Template.AdminNewAudio.events({
  // 'change .admin-new-audio-single'(e, tpl) {
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

  //     TrainingModuleAudiosCFS.insert(newFile, function (err, fileObj) {
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
  //                   && fileObj.hasStored('audio_base')) {
  //                 // console.log('done')
  //                   clearInterval(myInterval);

  //           let container = $("#"+fileObj._id)
  //           let audio = new Audio()
  //           audio.controls = true
  //           audio.src ="/cfs/files/training_module_audios_cfs/"+fileObj._id+'/'+fileObj.original.name
  //           container.append(audio)      

  //           $('.li-audio-being-uploaded-'+fileObj._id).fadeOut(1000)

  //               }
  //           }, 100);

  //           uploadedAudioIds.push(fileObj._id)
  //           _selfAdminNewAudio.uploadedAudioIds.set(uploadedAudioIds)

  //         } else {
  //           toastr.error("Something went wrong. Please try again.")
  //         }
  //       }
  //     })
  //   }
  // }, 
  'change .admin-new-audio-multiple'(e, tpl) {
    e.preventDefault()

    if (e.currentTarget.files && e.currentTarget.files[0]) {
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

        TrainingModuleAudiosCFS.insert(newFile, function (err, fileObj) {
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
                      && fileObj.hasStored('audio_base')) {
                    // console.log('done')
                      clearInterval(myInterval);

                      let container = $("#"+fileObj._id)
                      let audio = new Audio()
                      audio.controls = true
                      audio.src ="/cfs/files/training_module_audios_cfs/"+fileObj._id+'/'+fileObj.original.name
                      audio.setAttribute('id', 'audio_'+fileObj._id)
                      container.append(audio)

                      let audioObj = document.getElementById('audio_'+fileObj._id)
                      audioObj.addEventListener("loadedmetadata", function(event) {
                        let audioDuration = audioObj.duration
                        // console.log(audioDuration)
                        TrainingModuleAudiosCFS.update(fileObj._id, {
                          $set: {
                            duration: audioDuration
                          }
                        })

                      })

                      // console.log(audioObj.duration)
                      $('.li-audio-being-uploaded-'+fileObj._id).fadeOut(1000)

                  }
              }, 100);

              uploadedAudioIds.push(fileObj._id)
              _selfAdminNewAudio.uploadedAudioIds.set(uploadedAudioIds)

            } else {
              toastr.error("Something went wrong. Please try again.")
            }
          }
        })
      }) //-- FS.Utility.eachFile
    }
//     if (e.currentTarget.files && e.currentTarget.files[0]) {

//       let files = e.currentTarget.files
// console.log(files)
//       if(files && files.length > 0) {
//         files.forEach(function(file) {

//           let newFile = new FS.File(file);
//           // newFile.uploadedFrom = Meteor.userId();
//           newFile.status = 1
//           newFile.metadata = {
//             owner: Meteor.userId()
//           }

//           let maxChunk = 2097152; //-- 2M
//           // var maxChunk = 10240; //-- 10K? (this will consume CPU a lot, both server and user browser?)
//           FS.config.uploadChunkSize =
//             ( newFile.original.size < 10*maxChunk ) ? newFile.original.size/10 : maxChunk;

//           TrainingModuleAudiosCFS.insert(newFile, function (err, fileObj) {
//             //If !err, we have inserted new doc with ID fileObj._id, and
//             //kicked off the data upload using HTTP
//             if(err) {
//               // console.log("err => ", err)
//               toastr.error("Something went wrong. Please try again.")
//             } else {
//               // console.log(fileObj)
//               if(fileObj && fileObj._id) {
//                 // toastr.info("Successfully done.")
//                 // console.log(fileObj.uploadProgress())

//                 let myInterval = setInterval(function () {
//                     // console.log(fileObj.uploadProgress());
//                     if( fileObj.uploadProgress() === 100 
//                         && fileObj.hasStored('audio_base')) {
//                       // console.log('done')
//                         clearInterval(myInterval);

//                 let container = $("#"+fileObj._id)
//                 let audio = new Audio()
//                 audio.controls = true
//                 audio.src ="/cfs/files/training_module_audios_cfs/"+fileObj._id+'/'+fileObj.original.name
//                 container.append(audio)      

//                 $('.li-audio-being-uploaded-'+fileObj._id).fadeOut(1000)

//                     }
//                 }, 100);

//                 uploadedAudioIds.push(fileObj._id)
//                 _selfAdminNewAudio.uploadedAudioIds.set(uploadedAudioIds)

//               } else {
//                 toastr.error("Something went wrong. Please try again.")
//               }
//             }
//           })

//         })
//       }
//     }
  },    
  'dragover .admin-new-audio-dropzone'(e, tpl) {
    e.preventDefault()
    $(e.target).addClass('admin-new-audio-dragover')
  }, 
  'dragleave .admin-new-audio-dropzone'(e, tpl) {
    e.preventDefault()
    $(e.target).removeClass('admin-new-audio-dragover')
  },    
  'dropped .admin-new-audio-dropzone'(e, tpl) {
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

      TrainingModuleAudiosCFS.insert(newFile, function (err, fileObj) {
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

            uploadedAudioIds.push(fileObj._id)
            _selfAdminNewAudio.uploadedAudioIds.set(uploadedAudioIds)

            // let f = new FS.File(file);
            // Audios.insert(f)

                        // var myInterval = setInterval(function () {
                        //     console.log(fileObj.uploadProgress());
                        //     if( fileObj.uploadProgress() === 100 ) {
                        //         clearInterval(myInterval);
                        //     }
                        // }, 100);

                        // var myInterval = setInterval(function () {
                        //     console.log(fileObj.uploadProgress());
                        //     if( fileObj.uploadProgress() === 100 
                        //         && fileObj.hasStored('thumbs') && fileObj.hasStored('images') && fileObj.hasStored('medium') ) {
                        //         clearInterval(myInterval);
                        //     }
                        // }, 100);

            let myInterval = setInterval(function () {
                // console.log(fileObj.uploadProgress());
                if( fileObj.uploadProgress() === 100 
                    && fileObj.hasStored('audio_base')) {
                  // console.log('done')
                    clearInterval(myInterval);

            let container = $("#"+fileObj._id)
            let audio = new Audio()
            audio.controls = true
            audio.src ="/cfs/files/training_module_audios_cfs/"+fileObj._id+'/'+fileObj.original.name
            container.append(audio)      

            $('.li-audio-being-uploaded-'+fileObj._id).fadeOut(1000)

                }
            }, 100);

            _selfAdminNewAudio.uploadedAudio.set('audioId', fileObj._id)
            _selfAdminNewAudio.uploadedAudio.set('audioName', fileObj.original.name)

            // let audioObj = $('#'+fileObj._id)
            // $(audioObj).attr('src', "/cfs/files/octocolumn_audios_cfs/"+fileObj._id+'/'+fileObj.original.name)
            // $(audioObj).addClass('test')

          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }
      });

    })
  },
 'click .btn-delete-audio'(e, tpl) {
    e.preventDefault()

    let audioId = $(e.target).data('iid')

    if(audioId !== '') {
      if(confirm('Are you sure to delete the audio?')) {
        TrainingModuleAudiosCFS.update(audioId, {
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
  'click .btn-edit-new-audio'(e, tpl) {
    e.preventDefault()

    let audioId = $(e.currentTarget).parent().data('aid')

    _selfAdminNewAudio.audioToEdit.set(audioId)

    $('.row-admin-audio-edit').show()

  },
  'click .btn-delete-new-audio'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this audio?")) {
      let aid = $(e.currentTarget).parent().data('aid')

      let obj = {
        _id: aid,
        status: 4
      }

      updateAudioStatus.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }      
      })
    }
  },
  'click .btn-activate-new-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')

    let obj = {
      _id: aid,
      status: 1
    }

    updateAudioStatus.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. " + err)
      } else {
        toastr.info("Successfully activated.")
      }      
    })
  },
  'click .btn-deactivate-new-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')

    let obj = {
      _id: aid,
      status: 2
    }

    updateAudioStatus.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. " + err)
      } else {
        toastr.info("Successfully deactivated.")
      }      
    })
  },
})

Template.AdminNewAudio.onDestroyed(function adminNewAudioOnDestroyed() {
  _subsAdminNewAudio.clear()  
})


