/**
 * CRF Review Process Quiz template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

// import '/imports/ui/stylesheets/templates/crf-review-process-quiz.less'
import { CRFReviewProcessQuiz } from '/imports/ui/pages/templates/page-templates/crf-review-process-quiz.html'

let crfRPQAnswers

Template.CRFReviewProcessQuiz.onCreated(function crfReviewProcessQuizOnCreated() {
  crfRPQAnswers = [
    "existence",
    "demographics",
    "inclusion",
    "exclusion",
    "protocol-specific",
    "contradictory",
    "missing",
    "duplicated",
    "illegible",
    "source documentation",
    "crf entries",
    "crf",
    "issues",
    "plan",
    "follow up"
  ]

  let pageData = Template.instance().data

  // console.log(pageData, Blaze)

  // console.log(Blaze.Template.Module.__eventMaps[0]['timeupdate audio'])
})

Template.CRFReviewProcessQuiz.onRendered(function crfReviewProcessQuizOnRendered() {
  // $("#module_page_audio").bind('timeupdate', function(e) {
  //   console.log(e, this)
  // })

  $("audio").bind('timeupdate', function(e) {
    // console.log(e, this)
    let currentTime = Math.floor(this.currentTime) 

    if(currentTime === 5) {
      console.log(currentTime)
    }
  })  
})

Template.CRFReviewProcessQuiz.events({
  'DOMSubtreeModified .crf-rpq-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).data('qid')
    
    let target = $('#crf_rpq_'+qid)

    let uAnswer = $(target).text().trim().toLowerCase()
    let answer = crfRPQAnswers[qid-1]

    // console.log(qid, $(target).text(), crfRPQAnswers[qid-1])

    let score = similarity(uAnswer, answer)

    // console.log(score)

    if(score === 1) {
      $(e.currentTarget).removeClass('wrong')
      $(e.currentTarget).removeClass('almost')
      $(e.currentTarget).addClass('correct')      
    }
    else if(score > 0.6) {
      $(e.currentTarget).removeClass('wrong')
      $(e.currentTarget).removeClass('correct')
      $(e.currentTarget).addClass('almost')       
    }
    else {
      $(e.currentTarget).removeClass('correct')
      $(e.currentTarget).removeClass('almost')
      $(e.currentTarget).addClass('wrong') 
    }
    // if(crfRPQAnswers[qid-1] === answer) {
    //   $(e.currentTarget).removeClass('wrong')
    //   $(e.currentTarget).addClass('correct')
    // } else {
    //   $(e.currentTarget).addClass('wrong')
    // }
  },
  // 'timeupdate audio'(e,tpl){
    
  //   let currentTime = Math.floor(tpl.find("audio").currentTime)    
    

  //   if(currentTime === 5) {      
  //     console.log(currentTime)
  //   } 

  //   $("#module_page_audio").on('ended', function(){
  //     console.log("ended")
  //   });
  // },  
})

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

