Template.search.helpers({
  questions: function() {
    var querryEnconded = Router.current().params.querry;
    var querryDecoded = decodeURIComponent(querryEnconded);

    Meteor.call('search', querryDecoded, function(e, data) {
      if (e) {
        console.log(e);
      } else {
        return data; 
      }
    });
  }
})
