Router.configure({
    layoutTemplate: 'mainlayout'
});


Router.route('/', {
    name: 'pageone',
    template: 'showProduction'
});
Router.route('/ideas', {
    name: 'ideas',
    template: 'ideas'
});
Router.route('/user', {
    name: 'user',
    template: 'listUsers'
});
Router.route('/cal', {
    name: 'calendar',
    template: 'calendar'
});
Router.route('/demo', {
    name: 'demo',
    template: 'examplemodal'
});
Router.route('/intern', {
    name: 'intern',
    template: 'intern'
});
Router.route('verified', {
    path: '/verified',
    template: 'verified'
});

Router.route('verifyEmail', {
    controller: 'AccountController',
    path: '/verify-email/:token',
    action: 'verifyEmail'
});

AccountController = RouteController.extend({
    verifyEmail: function () {
        Accounts.verifyEmail(this.params.token, function () {
            Router.go('/verified');
        });
    }
});

