module.exports.repeat = function(times, fun) {
    let vals = [];
    for (var i = 0; i < times; ++i) {
        vals.push(fun(i));
    }
    return vals;
};

