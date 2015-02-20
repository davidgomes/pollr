Router.map(function() {
  this.route('home', { path: '/' })
  this.route('new_question', { path: '/question/new' })
  this.route('show_question', { path: '/question/:id' })
  this.route('discover', { path: '/discover' })
  this.route('profile', { path: '/profile' })
});

