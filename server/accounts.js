Accounts.onCreateUser(function(options, user) {
  user.followers = [];
  user.followees = [];
  user.related = [];
  user.image = "https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2015-02-20/3789419475_536b03164092990f1ddf_48.jpg";
  
  if (options.username.length > 10) {
    throw new Meteor.Error("username-length", "Username should have a maximum of 10 characters.");
  }
  
  if (options.profile) {
    user.profile = options.profile;
  }
  
  return user;
});
