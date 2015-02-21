var updateGradients = function (optionList) {
  console.log(optionList);
  
  $(optionList).each(function (index, value) {
    console.log(value);
  });
};

Template.question.rendered = function () {
  // call updateGradients for this question
};

Template.question.events({
  'click .option': function (event) {
    event.preventDefault();

    Meteor.call("vote", this.parentId, this.index, function (error) {
      if (error) {
        console.log(error);
        // Display error
      }
    });

    // console.log($(event.target).siblings());
    updateGradients($(event.target).siblings().andSelf());
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
  },

  friends: function () {
    var user = Meteor.user();

    if (!user) {
      return [];
    }

    var friendsList = [];
    for (var i = 0; i < user.followees.length; i++) {
      for (var j = 0; j < this.q.voters.length; j++) {
        if (this.q.voters[j].user === user.followees[i]) {
          if (friendsList.length === 2) {
            friendsList.push("...");
            break;
          }
          
          var friend = Meteor.users.findOne(user.followees[i]).username;
          friendsList.push(friend);
          break;
        }
      }

      if (friendsList.length === 3) {
        break;
      }
    }

    for (var i = 0; i < friendsList.length - 1; i++) {
      friendsList[i] += ', ';
    }

    return friendsList;
  },

  friendsCount: function () {
    var user = Meteor.user();

    if (!user) {
      return false;
    }

    var friendsFlag = false;
    for (var i = 0; i < user.followees.length && !friendsFlag; i++) {
      for (var j = 0; j < this.q.voters.length && !friendsFlag; j++) {
        if (this.q.voters[j].user === user.followees[i]) {
          friendsFlag = true;
        }
      }
    }

    return friendsFlag;
  }  
});
