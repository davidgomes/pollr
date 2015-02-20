Meteor.publish('questions', function () {
    return Questions.find();
});

Meteor.publish('hashtags', function () {
    return Hashtags.find();
});
