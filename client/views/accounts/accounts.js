Template.loginForm.events({
  'submit #login-form' : function(e, t) {
    e.preventDefault();

    var email = $('#login-email').val();
    var password = $('#login-password').val();

    Meteor.loginWithPassword(email, password, function(e) {
      if (e) {
        console.log('Error: ' + e);
      } else {
        console.log('Logged in !');
      }
    });

    return false; 
  }
});

Template.signupForm.events({
  'submit #signup-form' : function(e, t) {
    e.preventDefault();

    var email = $('#signup-email').val();
    var password = $('#signup-password').val();

    Accounts.createUser({ email: email, password: password }, function(e) {
      if (e) {
        console.log('Error: ' + e);
      } else {
        // Show success message
      }
    });

    return false; 
  }
});

Template.logoutButton.events({
  "click #logout-button": function(e, t) {
    e.preventDefault();

    Meteor.logout(function(e) {
      if (e) {
        console.log('Error: ' + e);
      } else {
        // Show success message
      }
    });

    return false;
  }
});
