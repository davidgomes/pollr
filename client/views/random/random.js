$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    Session.set("random-questions", Session.get("random-questions") + 1);
  }
});

Template.random.created = function() {
  Session.set("random-questions", 0);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.random.helpers({
  questions: function () {
    var questions = Questions.find({ }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + Session.get("random-questions")) }).fetch();

    questions.forEach(function(question) {
      question.date = RelativeTime.from(question.timestamp);
    });
    
    return questions;
  },

  noQuestions: function () {
    return Questions.find({ }, { limit: 1 }).count() === 0;
  }
});

Template.random.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});

Template.random.rendered = function () {
  Tracker.autorun(function () {
    Meteor.subscribe('random-questions', Session.get("random-questions"));
  });
};
