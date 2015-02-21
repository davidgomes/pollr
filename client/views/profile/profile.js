Template.profile.helpers({
  getUsername: function (userId) {
    var user = Meteor.users.findOne(userId);

    if (!user) {
      return "";
    }
    
    return user.username;
  }
});
