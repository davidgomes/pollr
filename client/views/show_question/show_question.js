Template.showQuestion.helpers({
  single_question: function() {
    var id = Router.current().params.id;

    return Questions.find({ _id: id }).fetch()[0];
  }
})
