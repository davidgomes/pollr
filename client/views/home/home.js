Template.home.rendered = function() {
  // Code
}

Template.home.helpers({
  questions: function () {
    return Questions.find();
  }
});
