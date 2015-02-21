var questionList = [];
var localVersion = 0;
var stopped = false;

Tracker.autorun(function () {
  checkVersion(Session.get("rendered-questions"));
  console.log(questionList.length);
  Meteor.subscribe('feed-questions', questionList);
});

window.onscroll = function(ev) {
  if (stopped) {
    return;
  }

  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    Session.set("rendered-questions", Session.get("rendered-questions") + 1);
  }
};

function checkVersion(version) {
  if (version === 0) {
    return;
  }

  if (version > localVersion) {
    Meteor.call("getFeed", version, function (error, result) {
      if (!error) {
        questionList = questionList.concat(result);
        Session.set("rendered-questions", version);
        
        if (result.length === 0) {
          stopped = true;
        }
      }
    });
    
    localVersion = version;
  }
}

Template.home.created = function() {
  Session.set("rendered-questions", 0);
  checkVersion(1);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.home.helpers({
  questions: function () {
    return Questions.find({}, { sort: { timestamp: -1 } });
  },
  noQuestions: function () {
    return Questions.find({}, { sort: { timestamp: -1 } }).count() === 0;
  }
});

Template.home.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});

Template.question.helpers({
  userName: function () {
    return this.userId;
  }
});
