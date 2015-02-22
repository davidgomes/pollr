Template.following.helpers({
  user: function() {
    var username = Router.current().params.username;
    var user = Meteor.users.findOne({ username: username });

    if (!user) {
      return {};
    }

    return user;
  },
  getUsername: function(userId) {
    var user = Meteor.users.findOne(userId);

    if (!user) {
      return "";
    }
    
    return user.username;
  },
})
