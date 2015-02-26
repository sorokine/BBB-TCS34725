var tcs = require('../index');

tcs.init( null, null, function(err) {

    if (err)
        console.log(err);
    else
        setInterval(
            function() {
                tcs.read2string(function(err, str) {
                    if (err)
                        console.log(err);
                    else
                        console.log(str);
                })
            },
            1000
        );
    
});