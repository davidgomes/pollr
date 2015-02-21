Meteor.publish('all-questions', function () {
    return Questions.find();
});

Meteor.publish('hashtags', function () {
    return Hashtags.find();
});
