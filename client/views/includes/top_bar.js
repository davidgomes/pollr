Template.topBar.events({      
  'keypress #search-box': function (e, t) {
    if (e.which === 13) {
      var querry = $('#search-box').val();
      var link = '/search/' + encodeURIComponent(querry);
      Router.go(link);
    }
  }
})
