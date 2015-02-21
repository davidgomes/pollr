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
    
    var questions = Questions.find({ $or: [{ userId: { $in: Meteor.user().followees } }, { userId: Meteor.userId() } ] }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + Session.get("rendered-questions")) }).fetch();
    questions.forEach(function(question) {
      question.date = moment(question.timestamp).format("MMM Do YY");
    });
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
