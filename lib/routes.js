Router.map(function() {
  this.route('home', { path: '/' });
  this.route('newQuestion', { path: '/question/new' });
  this.route('showQuestion', { path: '/question/:id' });
  this.route('discover', { path: '/discover' });
  this.route('profile', { path: '/profile' });
  this.route('search', { path: '/search/:querry' });

  this.route('about', { path: '/about' });
});

