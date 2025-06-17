/**
 * Admin User Management logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

// import '/imports/ui/stylesheets/all-users.less'
import 'datatables.net-bs/css/dataTables.bootstrap.css'
import { AllUsers } from '/imports/ui/pages/users/all-users.html'

import '/imports/ui/pages/users/new-user.js'

Template.AllUsers.onCreated(() => {

})

Template.AllUsers.events({
})
