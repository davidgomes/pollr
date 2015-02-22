Accounts.onCreateUser(function(options, user) {
  user.followers = [];
  user.followees = [];
  user.related = [];
  
  if (options.username.length > 10) {
    throw new Meteor.Error("username-length", "Username should have a maximum of 10 characters.");
  }
  
  if (options.profile) {
    user.profile = options.profile;
  }
  
  return user;
});
