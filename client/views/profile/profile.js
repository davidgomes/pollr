Template.profile.helpers({
  user: function() {
    var id = Router.current().params.id;
    var user = Meteor.users.findOne({ _id: id });

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
  }
});
