Template.newQuestion.rendered = function () {
  $('#new-answer-btn').tooltip();
  
  $('#last-question').keypress(function (e) {
    if (e.which == 13) {
      $('#new-question-form').submit();
    }
  });

  $('input').keypress(function (e) {
    if (e.which == 13) {
      $(this).next().select();
    }
  });
};

Template.newQuestion.events({
  'submit #new-question-form': function (e, t) {
    e.preventDefault();

    var question = $('#question').val();
    var answers = [];

    $.each($('.answer'), function (index, value) {
      answers.push($(value).val());
    });

    Meteor.call('newQuestion', question, answers, function (e, r) {
      if (e) {
        console.log(e);
        // Display error
      } else {
        console.log('fadsfds');
        $('#new-question-form').hide();
        $('#new-question-button').show();
      }
    });
  }
});
