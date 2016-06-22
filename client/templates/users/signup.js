//Signup for user new
Template.signup.events({
        'submit form': function (event) {
            event.preventDefault();
            var emailVar = event.target.signupEmail.value;
            var firstnameVar = event.target.signupFirstname.value;
            var lastnameVar = event.target.signupLastname.value;
            var passwordVar = event.target.signupPassword.value;
            var shortcodeVar = firstnameVar.slice(0,2)+lastnameVar.slice(0,1);

            var isValidPassword = function (val) {
                return val.length >= 6 ? true : false;
            }

            if (isValidPassword(passwordVar)) // &amp;&amp; other validations) {
            // Then use the Meteor.createUser() function
            {
                var user = [{firstname:firstnameVar,lastname: lastnameVar, email: emailVar,password: passwordVar, roles:['Member'], shortcode: shortcodeVar}];
                Meteor.call('createUserAndRole', user, function(error, result) {
                    if(error) {
                        Bert.alert(error.reason, 'danger');
                    }
                    else {
                        Meteor.call( 'sendVerificationLink', result, function( error, response ) {
                            if (error) {
                                Bert.alert(error.reason, 'danger');
                            } else {
                                //Bert.alert('Willkommen!', 'success');
                            }
                        });
                    }
                });

                event.target.reset();
                //Modal-Popup
                $('#signupModal').modal('hide');
                Bert.alert('Eine Aktivierungsmail wurde versandt. Bitte schalte den Account über den darin engegebenen Link frei!', 'success');
            }
        }
    }
);