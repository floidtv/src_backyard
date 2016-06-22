Template.mainlayout.events({
// showing multiple
    'click .item.menu': function(event) {
        $('.ui.sidebar')
            .sidebar({
                context: $('.bottom.segment')
            })
            .sidebar('attach events', '.menu .item')
        ;
    }
});
