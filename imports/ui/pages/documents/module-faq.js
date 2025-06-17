/**
 * Module FAQ template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import '/imports/ui/pages/documents/module-faq.html'
// import '/imports/ui/stylesheets/documents/module-faq.less'

Template.ModuleFAQ.onRendered(() => {
  $('#faq_technical .collapse').not('.in').collapse('hide');
  $('#faq_general .collapse').collapse('hide');
  $('#faq_technical .collapse.in').collapse('show');
})
