var _ = require( "underscore" )

var Console = {

    log: function( arg ){
        _.each( arguments, function( arg, i, arguments ){
            $.write( arg );
            if( i < arguments.length-1 ){
                $.write( ", " );
            } else{
                $.write( "\n" );
            }
        });
    }
}



module.exports = Console;
