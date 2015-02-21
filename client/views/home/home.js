Tracker.autorun(function () {
  Meteor.subscribe('feed-questions', Session.get("rendered-questions"));
});

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    Session.set("rendered-questions", Session.get("rendered-questions") + 1);
  }
};

Template.home.created = function() {
  Session.set("rendered-questions", 0);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.home.helpers({
  questions: function () {
    return Questions.find({}, { sort: { timestamp: -1 } });
  },
  noQuestions: function () {
    return Questions.find({}, { sort: { timestamp: -1 } }).count() === 0;
  }
});

Template.home.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});

Template.question.helpers({
  userName: function () {
    return this.userId;
  }
});
