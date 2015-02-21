Template.question.events({
  'click .option': function (event) {
    event.preventDefault();

    Meteor.call("vote", this.parentId, this.index, function (error) {
      if (error) {
        console.log(error);
        // Display error
      }
    });
  },

  'click .follow': function (event) {
    event.preventDefault();

    Meteor.call("followUser", this.q.userId, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
      }
    });
  },

  'click .unfollow': function (event) {
    event.preventDefault();

    Meteor.call("unfollowUser", this.q.userId, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
      }
    });
  }
});

Template.question.helpers({
  toFollow: function (otherId) {
    if (!Meteor.user() || Meteor.userId() === otherId) {
      return false;
    }

    return !_.contains(Meteor.user().followees, otherId);
  },

  toUnfollow: function (otherId) {
    if (!Meteor.user() || Meteor.userId() === otherId) {
      return false;
    }
    
    return _.contains(Meteor.user().followees, otherId);
  },

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
  }
});
