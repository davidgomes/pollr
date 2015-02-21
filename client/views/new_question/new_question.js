Template.newQuestion.rendered = function () {
  // Add new answer input
  $('#new-answer-btn').click(function() {
    var last = $('#new-question-form').find('#last-question');
    last.removeAttr('id');

    var input = '<input type="text" class="form-control answer pull-left" id="last-question" data="N" placeholder="Option N">';
    var index = parseInt(last.attr('data')) + 1;
    input = input.replace('N', index.toString());
    input = input.replace('N', index.toString());

    // Insert new input
    var padding = $('#new-question-form').css('padding-bottom');
    var newPadding = parseInt(padding.substring(0, padding.length - 2)) + 44;
    $('#new-question-form').css('padding-bottom', newPadding);
    last.after(input);
  })
 
  // Move cursor from input to input
  $('input').keypress(function(e) {
    if (e.which == 13) {
      console.log('input keypress')
      if ($(this).next().is('button')) {
        $(this).next().next().select();
      } else {
        $(this).next().select();
      }
    }
  });

  // Add question enter key
  $('#last-question').keypress(function(e) {
    if (e.which == 13) {
      console.log('last keypress')
      $('#new-question-form').submit();
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
        })
        $('#new-question-form').find('input').val('');
        $('#new-question-form').find('[data="2"]').attr('id', 'last-question');
        $('#new-question-form').css({'padding-bottom':'150px'});
      }
    });
  }
});
