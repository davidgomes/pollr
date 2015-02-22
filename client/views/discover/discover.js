var idsList = [];
var sourceList = [];

Template.discover.helpers({
  questions: function () {
    if (!Meteor.user() || !idsList) {
      return [];
    }

    Session.get("discover-set");

    var questions = Questions.find({ _id: { $in: idsList } }, { sort: { timestamp: -1 } }).fetch();

    var index = 0;
    questions.forEach(function(question) {
      question.date = RelativeTime.from(question.timestamp);
      question.source = sourceList[index];
      index += 1;
    });

    return questions;
  },
  
  noQuestions: function () {
    if (!Meteor.user() || !idsList) {
      return true;
    }

    Session.get("discover-set");
    
    return Questions.find({ _id: { $in: idsList } }, { limit: 1 }).count() === 0;
  }
});

Template.discover.created = function () {
  Session.set("discover-set", false);
};

Template.discover.rendered = function () {
  Session.set("discover-set", false);
  Meteor.call("getDiscover", function (error, data) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      Session.set("discover-set", true);
      idsList = data[0];
      sourceList = data[1];
    }
  });

  Tracker.autorun(function () {
    Session.get("discover-set");
    console.log(idsList);
    Meteor.subscribe('discover-questions', idsList);
  });
};
