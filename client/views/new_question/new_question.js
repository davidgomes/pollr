Template.newQuestion.rendered = function () {
  $('#new-answer-btn').tooltip();
  
  $('input').keypress(function (e) {
    if (e.which == 13) {
      $(this).next().select();
    }
  });
};

Template.newQuestion.events({
  'submit #new-question-form': function (e, t) {
    e.preventDefault();

    var question = $('#new-question-question').val();
    var answers = [];

    $.each($('.answer'), function (index, value) {
      answers.push($(value).val());
    });

    Meteor.call('newQuestion', question, answers, function (error) {
      if (error) {
        console.log(error);
        // Display error
      }
    });
  }
});
