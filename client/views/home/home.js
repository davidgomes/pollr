Tracker.autorun(function () {
  Meteor.subscribe('feed-questions', Session.get("rendered-questions"), Meteor.user());
});

$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    Session.set("rendered-questions", Session.get("rendered-questions") + 1);
  }
});

Template.home.created = function() {
  Session.set("rendered-questions", 0);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.home.helpers({
  questions: function () {
    if (!Meteor.user() || !Meteor.user().followees) {
      return [];
    }
    
    var questions = Questions.find({ $or: [{ userId: { $in: Meteor.user().followees } }, { userId: Meteor.userId() } ] }, { limit: POSTS_PER_PAGE * (1 + Session.get("rendered-questions")) }).fetch();
    questions.forEach(function(question) {
      var seconds = moment().diff(moment(question.timestamp)); 
      question.date = secondsToHms(seconds);
    })
    return questions;
  },
  noQuestions: function () {
    if (!Meteor.user() || !Meteor.user().followees) {
      return [];
    }

    return Questions.find({ $or: [{ userId: { $in: Meteor.user().followees } }, { userId: Meteor.userId() } ] }, { limit: 1 }).count() === 0;
  }
});

Template.home.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});

var secondsToHms = function(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}
