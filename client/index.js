Meteor.subscribe('all-questions');
Meteor.subscribe('hashtags');
Meteor.subscribe('all-users');

Meteor.startup(function () {
  Meteor.loginWithPassword("pedro", "pedro");
});
