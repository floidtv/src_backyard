process.env.rootUrl = 'http://fm-floidcms-vm.htwk-leipzig.de';
Accounts.emailTemplates.siteName = "floid Production Management";
Accounts.emailTemplates.from     = "floidProMa <registerfloidtv@gmail.com>";
process.env.MAIL_URL = 'smtp://registerfloidtv@gmail.com:floidTV2016@smtp.gmail.com:587';
Accounts.emailTemplates.verifyEmail = {
     subject: function() {
    return "[floidProMa] Verifiziere deine Email-Adresse!";
},
 text: function( user, url ) {

    var emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "registerfloidtv@gmail.com",
        emailBody      = "Um deine Email-Adresse "+emailAddress+" zu verifizieren, klicke auf den folgenden Link:\n\n"+urlWithoutHash+"\n\n Wenn du keine Verifizierung angefodert hast, ignoriere diese Mail. Wenn du denkst, es passiert etwas merkwürdiges, kontaktiere unseren Administrator unter "+supportEmail;

    return emailBody;
}
};