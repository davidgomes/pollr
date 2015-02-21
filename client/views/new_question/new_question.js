Template.newQuestion.rendered = function () {
  // Add new answer input
  $('#new-answer-btn').click(function() {
    var last = $('#new-question-form').find('#last-question');

    var input = '<input type="text" class="form-control answer pull-left" id="last-question" data="N" placeholder="Option N">';
    var index = parseInt(last.attr('data')) + 1;
    input = input.replace('N', index.toString());
    input = input.replace('N', index.toString());

    console.log(input)

    last.after(input);
    last.removeAttr('id');
    var padding = $('#new-question-form').css('padding-bottom');
    var newPadding = parseInt(padding.substring(0, padding.length -2)) + 44;
    $('#new-question-form').css('padding-bottom', newPadding);
  })
  
  $('input').keypress(function(e) {
    if (e.which == 13) {
      if ($(this).next().is('button')) {
        $(this).next().next().select();
      } else {
        $(this).next().select();
      }
    }
  });

  $('#last-question').keypress(function(e) {
    if (e.which == 13) {
      $('#new-question-form').submit();
    }
  });
  
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
