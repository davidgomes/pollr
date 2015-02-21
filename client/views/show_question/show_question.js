Template.singleQuestion.helpers({
  question: function() {
    var id = Router.current().params.id;

    return Question.find({ _id: id });
  }
})
