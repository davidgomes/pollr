Template.home.rendered = function() {
  // Code
};

Template.home.helpers({
  questions: function () {
    return Questions.find({}, { sort: { timestamp: -1 } });
  }
});

Template.question.helpers({
  userName: function () {
    return this.userId;
  }
});
