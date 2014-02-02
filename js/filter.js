// filter to create pagination. 
app.filter('startFrom', function() {
    return function(input, start) {
        //convert object to array
        var array = $.map(input, function(value, index) {
            return [value];
        });
        start = +start; //parse to int
        return array.slice(start);
    };
});