Template.profile.helpers({
  user: function() {
    var username = Router.current().params.username;
    var user = Meteor.users.findOne({ username: username });

    if (!user) {
      return {};
    }

    return user;
  },
  getUsername: function (userId) {
    var user = Meteor.users.findOne(userId);

    if (!user) {
      return "";
    }
    
    return user.username;
  },
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
  }
});

Template.profile.events({
  'click #follow-button': function (event) {
    event.preventDefault();

    var userID = $('#follow-button').attr('data');

    Meteor.call("followUser", userID, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
        // Display success message
      }
    });
  },
  'click #unfollow-button': function (event) {
    event.preventDefault();

    var userID = $('#unfollow-button').attr('data');

    Meteor.call("unfollowUser", userID, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
        // Display success message
      }
    });
  }
})
