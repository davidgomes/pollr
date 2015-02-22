$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    Session.set("search-questions", Session.get("search-questions") + 1);
  }
});

Template.search.created = function() {
  Session.set("search-questions", 0);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.search.helpers({
  questions: function () {
    var queryEnconded = Router.current().params.word;
    var query = decodeURIComponent(queryEnconded);
    var question;

    if (query[0] === '#') {
      query = query.substring(1, query.length);
      var hashtag = Hashtags.findOne({ name: query });

      if (!hashtag) {
        return [];
      }

      questions = Questions.find({ hashtags: { $elemMatch: { _id: hashtag._id }}}, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + Session.get("search-questions")) }).fetch();
    } else {
      questions = Questions.find({ username: query }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + Session.get("search-questions")) }).fetch();
    }

    questions.forEach(function(question) {
      question.date = RelativeTime.from(question.timestamp);
    });
    
    return questions;
  },

  noQuestions: function () {
    var queryEnconded = Router.current().params.word;
    var query = decodeURIComponent(queryEnconded);
    var question;

    if (query[0] === '#') {
      query = query.substring(1, query.length);
      var hashtag = Hashtags.findOne({ name: query });

      if (!hashtag) {
        return [];
      }

      return Questions.find({ hashtags: { $elemMatch: { _id: hashtag._id }}}, { limit: 1 }).count() === 0;
    } else {
      return Questions.find({ username: query }, { limit: 1 }).count() === 0;
    }
  }
});

Template.search.events({
  'click #load-more': function (event) {
    event.preventDefault();
  }
});

Template.search.rendered = function () {
  Tracker.autorun(function () {
    var queryEnconded = Router.current().params.word;
    var queryDecoded = decodeURIComponent(queryEnconded);
    Meteor.subscribe('search-questions', Session.get("search-questions"), queryDecoded, Meteor.user());
  });
};
