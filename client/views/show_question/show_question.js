Template.showQuestion.helpers({
  single_question: function() {
    var id = Router.current().params._id;

    var question = Questions.findOne(id);
    question.date = RelativeTime.from(question.timestamp);;
    return question;
  }
});
