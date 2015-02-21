Template.home.rendered = function() {

  $('#new-question-button').click(function() {
    $(this).hide();
    $('#new-question-form').show();
  });

}

Template.home.helpers({
  questions: function () {
    return Questions.find();
  }
});
