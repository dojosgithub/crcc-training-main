//-- Helpers to use inside template
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

Template.registerHelper('eq', function (a, b) {
  return a === b;
})

Template.registerHelper('ne', function (a, b) {
  return a !== b;
})

Template.registerHelper('gt', function (a, b) {
  return a > b;
})

Template.registerHelper('lt', function (a, b) {
  return a < b;
})

Template.registerHelper('or', function (a, b) {
  return a || b;
})

Template.registerHelper('neAny', function (a, b) {
  return a != b;
}); 

Template.registerHelper('orr', function (a, b, c) {
  return a || b || c;
});

Template.registerHelper('and', function (a, b) {
  return a && b;
});

Template.registerHelper('inArray',function(array, needle) {
  if(array && needle) {
    // console.log("inArray", typeof array, array, needle, array.indexOf(needle));
    // console.log("inArray", typeof array, array, needle);
    return (typeof array !== 'undefined' && array.indexOf(needle) !== -1) ? true : false;
    // return (typeof array === 'undefined' || array.indexOf(needle) === -1 || array.length ===0) ? false : true;
  }
});

Template.registerHelper('session',function(data) {
    return Session.get(data);
})

Template.registerHelper('sum', function (a, b) {
  return parseInt(a) + parseInt(b);
})

Template.registerHelper('ded', function (a, b) {
  return parseInt(a) - parseInt(b);
})

Template.registerHelper('percent', function (a, b) {
  return Math.round(a/b * 100)
})

Template.registerHelper('length', function (a) {
  return typeof a === 'object' ? a.length : 0
})

Template.registerHelper('curtail', function(string, length) {
    // tail = (tail !== '') ? tail : " ...";
    // console.log("curtail", string, length, tail, string.substr(0, length));
    let sLength = length || 20
    if(string && string !== '') {
        if(string.length > sLength) {
            return string.substr(0, length) + " ...";
            // return string.substr(0, length).replace(/\n/g, " ") + " ...";
        } else {
            return string;
            // return string.replace(/\n/g, " ");
        }
    }
})

Template.registerHelper('selected', function (a, b) {
  return a === b ? 'selected' : ''
})

Template.registerHelper('checked', function (a, b) {
  return a === b ? 'checked' : ''
})

Template.registerHelper('mChecked', function (needle, haystack) {
  if(needle && haystack) {    
    return haystack.indexOf(needle) !== -1 ? 'checked' : ''
  }
})

Template.registerHelper('disabled', function (a, b) {
  return a === b ? 'disabled' : ''
})

Template.registerHelper('date', function (timestamp) {
  return new Date(timestamp) || ''
})

Template.registerHelper('secondsToHMS', function(time) {
  if(!time) {return}
  var m = ~~(time / 60);
  var s = time % 60;

  var h = ~~(time / 3600);
  m = ~~((time % 3600) / 60);
  s = time % 60;

  var t = "";

  t += (h < 10 ? "0" : "") + h + ":";
  t += (m < 10 ? "0" : "") + m + ":";
  t += (s < 10 ? "0" : "") + s;

  return t;        
})

Template.registerHelper('secondsToHMSRaw', function(time) {
  if(!time) {return}
  var m = ~~(time / 60);
  var s = time % 60;

  var h = ~~(time / 3600);
  m = ~~((time % 3600) / 60);
  s = time % 60;

  var t = "";

  t += (h > 0) ? h+':' : ''
  t += (m > 0) ? m+':' : ''
  t += (s >= 0) ? Math.round(s) : ''

  return t;        
})

Template.registerHelper('videoSecondsToHMS', function(time) {
  if(!time) {return}
  var m = ~~(time / 60);
  var s = time % 60;

  var h = ~~(time / 3600);
  m = ~~((time % 3600) / 60);
  s = Math.round(time % 60);

  var t = "";

  t += (h > 0) ? (h < 10 ? "0" : "") + h + ":" : "";
  t += (m < 10 ? "0" : "") + m + ":";
  t += (s < 10 ? "0" : "") + s;

  return t;        
})

Template.registerHelper('dateHMS', function (timestamp) {
  if(timestamp) {
    let thisDate = new Date(timestamp)

    let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return  thisDate.getDate() + "-" + (month[thisDate.getMonth()]) + "-" + thisDate.getFullYear() + ' ' +
        ("0" + thisDate.getHours()).slice(-2) + ":" + ("0" + thisDate.getMinutes()).slice(-2) + ":" + 
        ("0" + thisDate.getSeconds()).slice(-2)
  }
})

Template.registerHelper('inAnswers', (answer, Answers) => {
  if(answer && Answers) {
    return Answers.indexOf(answer) !== -1 ? true : false
  }
})

Template.registerHelper('getThisYear', function() {
  return new Date().getFullYear();
})

