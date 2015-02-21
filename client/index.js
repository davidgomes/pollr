Meteor.subscribe('all-questions');

Meteor.subscribe('hashtags');

Meteor.startup(function () {
  Meteor.loginWithPassword("pedro", "pedro");
});
