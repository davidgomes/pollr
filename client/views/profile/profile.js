Template.profile.rendered = function () {
  Tracker.autorun(function () {
    var query = Router.current().params.username;
    Meteor.subscribe('profile-questions', Session.get("profile-questions"), query, Meteor.user());
  });
};

$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    Session.set("profile-questions", Session.get("profile-questions") + 1);
  }
});

Template.profile.created = function() {
  Session.set("profile-questions", 0);
  $("html, body").animate({ scrollTop: 0 }, "fast");
};

Template.profile.helpers({
  user: function() {
    var username = Router.current().params.username;
    var user = Meteor.users.findOne({ username: username });

    if (!user) {
      return {};
    }

    return user;
  },

  toFollow: function (otherId) {
    if (!Meteor.user() || Meteor.userId() === otherId) {
      return false;
    }

    return !_.contains(Meteor.user().followees, otherId);
  },

  toUnfollow: function (otherId) {
    if (!Meteor.user() || Meteor.userId() === otherId) {
      return false;
    }
    
    return _.contains(Meteor.user().followees, otherId);
  },

  questions: function () {
    var query = Router.current().params.username;
    var user = Meteor.users.findOne({ username: query });

    if (!user) {
      return [];
    }
      
    var questions = Questions.find({ userId: user._id }, { limit: POSTS_PER_PAGE * (1 + Session.get("profile-questions")) }).fetch();
    questions.forEach(function(question) {
      question.date = RelativeTime.from(question.timestamp);
    });

    return questions;
  },
  
  noQuestions: function () {
    if (!Meteor.user()) {
      return false;
    }

    var query = Router.current().params.username;
    var user = Meteor.users.findOne({ username: query });

    if (!user) {
      return false;
    }
      
    return Questions.find({ userId: user._id }, { limit: 1 }).count() === 0;
  },

  count: function(array) {
    if (!array) {
      return 0;
    }

    return array.length;       
  },

  ownPage: function () {
    if (!Meteor.user()) {
      return false;
    }

    var username = Router.current().params.username;
    
    return username === Meteor.user().username;
  }
});

Template.profile.events({
  'click #follow-button': function (event) {
    event.preventDefault();

    var userID = $('#follow-button').attr('data');

    Meteor.call("followUser", userID, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
        // Display success message
      }
    });
  },

  'click #unfollow-button': function (event) {
    event.preventDefault();

    var userID = $('#unfollow-button').attr('data');

    Meteor.call("unfollowUser", userID, function (error) {
      if (error) {
        console.log(error);
        // Display error
      } else {
        // Display success message
      }
    });
  },

  'submit #new-image-form': function (event) {
    event.preventDefault();

    Meteor.call("changeImage", $('#new-image-text').val(), function (error) {
      if (error) {
        console.log(error);
      }
    });
  },

  'click .own-image': function (event) {
    event.preventDefault();

    $('#new-image-form').toggle();
  }
});
