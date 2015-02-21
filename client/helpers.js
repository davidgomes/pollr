UI.registerHelper('addIndex', function (all, parentId) {
    return _.sortBy(_.map(all, function(val, index) {
        return { index: index, value: val, parentId: parentId };
    }), function (element) { return -element.value.count; });
});
