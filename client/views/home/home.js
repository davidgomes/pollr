Tracker.autorun(function () {
  Meteor.subscribe('feed-questions', Session.get("rendered-questions"), Meteor.user());
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
    return Questions.find({ $or: [{ userId: { $in: Meteor.user().followees } }, { userId: Meteor.userId() } ] }, { limit: POSTS_PER_PAGE * (1 + Session.get("rendered-questions")) });
  },
  noQuestions: function () {
    return Questions.find({ $or: [{ userId: { $in: Meteor.user().followees } }, { userId: Meteor.userId() } ] }, { limit: 1 }).count() === 0;
  }
});

Template.home.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});
