/**
 * New User Form logic
 */

import { Meteor }     from 'meteor/meteor'
import { Template }   from 'meteor/templating'

import { Dom }        from '/imports/api/lib/dom.js'

import { insertUser } from '/both/api/methods/new-user.js'

// import '/imports/ui/stylesheets/new-user.less'
import { NewUser }    from '/imports/ui/pages/users/new-user.html'

Template.NewUser.events({
  'click .btn-add-new-user'(e, tpl) {
    e.preventDefault()

    //-- Get the new-user form object
    let formDom = Dom.elem('adminNewUserForm')

    //-- Get the input values
    let username  = formDom.username.value
    let firstname = formDom.firstname.value
    let lastname  = formDom.lastname.value
    let email     = formDom.email.value
    let password  = formDom.password.value

    //-- Object to insert
    let objUser = {
      username: username,
      profile: {
        firstName: firstname,
        lastName: lastname
      },
      password: password,
      // 'emails.$.address': email,
      email: email,          
    }

    insertUser.call(objUser, (err, res) => {
      if(err) { //-- If something's wrong
        console.log(err)
      } else {
        
        //-- Close 
        let btnClose = Dom.elem('.btn-close-new-user-form')
      
        btnClose[0].click()
      }
    })

  }
})
