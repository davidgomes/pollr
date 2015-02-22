Template.newQuestion.rendered = function() {
  Session.set('questionNumber', 2);

  // Add new answer input
  $('#new-answer-btn').click(function() {
    var last = $('#new-question-form').find('#last-answer');
    last.removeAttr('id');

    var input = '<input type="text" id="last-answer" class="form-control answer pull-left" data="N" placeholder="Option N">';
    var index = parseInt(last.attr('data')) + 1;
    input = input.replace('N', index.toString());
    input = input.replace('N', index.toString());

    // Insert new input
    last.after(input);
    var padding = $('#new-question-form').css('padding-bottom');
    var newPadding = parseInt(padding.substring(0, padding.length - 2)) + 44;
    $('#new-question-form').css('padding-bottom', newPadding);

    // Move cursor from input to input
    $('input').keypress(function(e) {
      if (e.which == 13) {
        if (formFull()) {
          $('#new-question-form').submit();
        } else {
          if ($(this).next().is('button')) {
            $(this).next().next().select();
          } else {
            $(this).next().select();
          }
        }
      }
    });
  });

  // Move cursor from input to input
  $('input').keypress(function(e) {
    if (e.which == 13) {
      if (formFull()) {
        $('#new-question-form').submit();
      } else {
        if ($(this).next().is('button')) {
          $(this).next().next().select();
        } else {
          $(this).next().select();
        }
      }
    }
  });

  // Add question click
  $('#new-question-btn').click(function(e) {
    $('#new-question-form').submit();
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
      } else {
        $('#new-question-form').find('input').each(function() {
          if (parseInt($(this).attr('data')) > 2) {
            $(this).remove();
          }
        });

        $('#new-question-form').find('input').val('');
        $('#new-question-form').find('input[data="2"]').attr('id', 'last-answer');
        $('#new-question-form').css({'padding-bottom':'150px'});
        Session.set('questionNumber', 2);
      }
    });
  }
});

var formFull = function() {
  var result = true;
  $('#new-question-form').find('input').each(function(index, input) {
    if ($(this).val() === '') {
      result = false;
    }
  });
  return result;
};
