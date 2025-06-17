/**
 * Common util library (server-side)
 *
 * David Kim
 */

// if(Meteor.isServer) {
  export const Util = {
    diffDates(date1, date2) {
      // get total seconds between the times
      let delta = Math.abs(date2 - date1) / 1000;

      // calculate (and subtract) whole days
      let days = Math.floor(delta / 86400);
      delta -= days * 86400;

      // calculate (and subtract) whole hours
      let hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      // calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      // what's left is seconds
      let seconds = delta % 60; 
// console.log(date1, date2)
      return days + ' ' + hours + ' ' + minutes + ' ' + seconds
     },
    diffDates2(date1, date2) {
      // get total seconds between the times
      let delta = Math.abs(date2 - date1) / 1000;

      // calculate (and subtract) whole days
      let days = Math.floor(delta / 86400);
      delta -= days * 86400;

      // calculate (and subtract) whole hours
      let hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      // calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      // what's left is seconds
      let seconds = delta % 60; 
// console.log(date1, date2)
      hours += days *24

      return hours + ' ' + minutes + ' ' + seconds
     },     
     diffHMS(hms1, hms2) {
var t1 = moment('05:34:01', "hh:mm:ss");
var t2 = moment('20:44:44', "hh:mm:ss");
var t3 = moment(t2.diff(t1)).format("hh:mm:ss");      
     }
  }
// }