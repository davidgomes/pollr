UI.registerHelper('addIndex', function (all, parentId) {
    return _.map(all, function(val, index) {
        return { index: index, value: val, parentId: parentId };
    });
});
