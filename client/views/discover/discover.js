Meteor.subscribe('discover-questions');
var idsList = [];

Template.discover.helpers({
  questions: function () {
    if (!Meteor.user()) {
      return [];
    }

    Session.get("discover-set");
    
    return Questions.find({ _id: { $in: idsList } }, { sort: { timestamp: -1 } });
  },
  
  noQuestions: function () {
    if (!Meteor.user()) {
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
      console.log(error);
    } else {
      Session.set("discover-set", true);
      idsList = data;
    }
  });
};
