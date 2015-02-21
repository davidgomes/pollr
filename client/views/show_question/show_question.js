Template.showQuestion.helpers({
  single_question: function() {
    var id = Router.current().params._id;

    return Questions.findOne(id);
  }
});
