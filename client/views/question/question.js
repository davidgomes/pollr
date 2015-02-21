Template.question.events({
  'click .option': function (event) {
    event.preventDefault();

    Meteor.call("vote", this.parentId, this.index, function (error) {
      if (error) {
        console.log(error);
        // Display error
      }
    });
  }
});

Template.question.helpers({
  voted: function () {
    var question = Questions.findOne(this.parentId);

    if (!question) {
      return false;
    }

    var flag = false;
    for (var i = 0; i < question.voters.length; i++) {
      var voter = question.voters[i];
      
      if (voter.user === Meteor.userId() && voter.option === this.index) {
        flag = true;
        break;
      }
    }
    
    return flag;
  },
  userName: function () {
    return this.userId;
  }
});
