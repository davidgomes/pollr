Router.map(function() {
  this.route('home', { path: '/' });
  this.route('newQuestion', { path: '/question/new' });

  this.route('showQuestion', {
    path: '/question/:_id',

    subscriptions: function() {
      return Meteor.subscribe('single-question', this.params._id);
    },

    action: function () {
      if (this.ready()) {
        this.render();
      } else {
        this.render('Loading');
      }
    }
  });

  this.route('discover', { path: '/discover' });
  this.route('profile', { path: '/profile/:username' });
  this.route('followers', { path: '/profile/:username/followers' });
  this.route('following', { path: '/profile/:username/following' });
  this.route('emptysearch', { path: '/search' });
  this.route('search', {
    path: '/search/:word',
    action: function () {
      if ($('#search-box').val() != Router.current().params.word) {
        $('#search-box').val(Router.current().params.word);
      }

      if (this.ready()) {
        this.render();
      } else {
        this.render('Loading');
      }
    }
  });
  
  this.route('random', { path: '/random' });
  this.route('about', { path: '/about' });
});
