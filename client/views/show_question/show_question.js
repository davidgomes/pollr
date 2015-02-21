Template.showQuestion.helpers({
  single_question: function() {
    var id = Router.current().params._id;

    var question = Questions.findOne(id);
    question.date = moment(question.timestamp).format("MMM Do");
    return question;
  }
});
