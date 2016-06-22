//Login for user
Template.login.events({
    'submit .login': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;

        Meteor.call('checkEmailVerification', emailVar, function (error, data) {
            if (data == "verified") {
                Meteor.loginWithPassword(emailVar, passwordVar, function (err) {
                    if (err) {
                        Bert.alert("Email oder Passwort ist fehlerhaft!", 'danger');
                    }
                    else {
                        console.log("Logged in");
                    }
                });
            } else if (data == "unverified") {
                Bert.alert("Der Account wurde noch nicht verifiziert!", 'danger');
            } else {
                Bert.alert("Email oder Passwort ist fehlerhaft!", 'danger');
            }
        });
    },
     'click .show_regform': function(event){
         //Modal-Popup
         $('#signupModal').modal('show');
     }

});