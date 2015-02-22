var updateGradients = function (optionList) {
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
        console.log(error); // Display error
      }
    });

    updateGradients($(event.target).siblings().andSelf());
  },

  'click #delete-btn':  function (event) {
    event.preventDefault();

    Meteor.call("deleteQuestion", this.q._id, function (error) {
      if (error) {
        console.log(error);
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
    return Meteor.userId;
  },

  userImage: function () {
    return Meteor.users.findOne(this.q.userId).image;
  },

  ownQuestion: function () {
    return Meteor.userId() === this.q.userId;
  },

  friends: function () {
    var user = Meteor.user();

    if (!user) {
      return [];
    }

    var friendsList = [];
    for (var i = 0; i < user.followees.length; i++) {
      for (var j = 0; j < this.q.voters.length; j++) {
        if (this.q.voters[j].user === user.followees[i] && this.q.voters[j].user != this.q.userId) {
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
        if (this.q.voters[j].user === user.followees[i] && this.q.voters[j].user != this.q.userId) {
          friendsFlag = true;
        }
      }
    }

    return friendsFlag;
  },

  questionPart: function () {
    var question = this.q.question + " ";
    var result = [];
    var typeLink = false;
    var searching = false;
    var query;
    var currentWord ="";

    if (Router.current().url.indexOf("/search") > -1) {
      searching = true;
      var queryEnconded = Router.current().params.word;
      query = decodeURIComponent(queryEnconded);
    }

    for (var i = 0; i < question.length; i++) {
      var letter = question[i];

      if (letter === '#') {
        var high = '';

        if (searching && "#" + currentWord === query) {
          high = 'link-highlight';
        }
        
        result.push({ value: currentWord, link: typeLink, highlight: high });
        typeLink = true;
        currentWord = "";
        continue;
      }

      if (letter === ' ' && typeLink) {
        var high = '';

        if (searching && "#" + currentWord === query) {
          high = 'link-highlight';
        }

        result.push({ value: currentWord, link: typeLink, highlight: high });
        typeLink = false;
        currentWord = "";
        continue;
      }

      currentWord += letter;
    }

    if (currentWord !== "") {
      var high = '';

      if (searching && "#" + currentWord === query) {
        high = 'link-highlight';
      }

      result.push({ value: currentWord, link: typeLink, highlight: high });
    }

    return result;
  },

  firstGrad: function () {
    var question = Questions.findOne(this.parentId);
    var tot = question.voters.length;

    return Math.min(100 * this.value.count / tot, 99.9);
  },

  secondGrad: function () {
    var question = Questions.findOne(this.parentId);
    var tot = question.voters.length;

    return Math.min(100 * this.value.count / tot + 0.1, 100);
  },

  getColor: function () {
    if (this.q.hashtags.length > 0) {
      return this.q.hashtags[0].color;
    } else {
      return "#FFFFFF";
    }
  }
});
