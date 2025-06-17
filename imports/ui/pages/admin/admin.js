/**
 * Admin layout template logic
 */

// if(Meteor.user() 
//   && (Meteor.user().profile.role === '1' 
//     || Meteor.user().profile.role === '2')) {

  import { Meteor } from 'meteor/meteor'
  import { Template } from 'meteor/templating'

  //-- Admin style sheets
  // import '/imports/ui/stylesheets/admin/admin.less'
  // import '/imports/ui/stylesheets/admin/admin-header.less'
  // import '/imports/ui/stylesheets/admin/admin-leftbar.less'
  // import '/imports/ui/stylesheets/admin/admin-main.less'
  // import '/imports/ui/stylesheets/admin/admin-footer.less'

  //-- Admin  templates
  import '/imports/ui/pages/admin/admin-header.html'
  import '/imports/ui/pages/admin/admin-leftbar.html'

  import '/imports/ui/pages/admin/admin-main.js'
  
  import '/imports/ui/pages/admin/admin-rightbar.html'
  import '/imports/ui/pages/admin/admin-footer.html'

  import '/imports/ui/pages/admin/admin-layout.html'

  //-- Admin layout templates
  import { Admin } from '/imports/ui/pages/admin/admin.html'
// } else {
//   // alert('Access Denied!')
//   FlowRouter.go('/')
// }
