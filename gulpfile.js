
// --------------------------------------------------
// Constants
// --------------------------------------------------

var SOURCE_DIR  = 'src/';
var BUILD_DIR   = 'build/';
var SCRIPTS     = SOURCE_DIR + '**/*.js';


// --------------------------------------------------
// Dependencies
// --------------------------------------------------

var gulp        = require( 'gulp' );
var browserify  = require( 'browserify' );
var gutil       = require( 'gulp-util' );
var notifier    = require( 'node-notifier' );
var source      = require( 'vinyl-source-stream' );

/*

var usemin      = require( 'gulp-usemin' );
var sass        = require( 'gulp-sass' );
var plumber     = require( 'gulp-plumber' )
var del         = require( 'del' );
var vinylPaths  = require( 'vinyl-paths' );



var yargs       = require( 'yargs' )
*/



// Command line option:
//  --fatal=[warning|error|off]
// var fatalLevel = require('yargs').argv.fatal;
var fatalLevel;

var ERROR_LEVELS = ['error', 'warning'];

// Return true if the given level is equal to or more severe than
// the configured fatality error level.
// If the fatalLevel is 'off', then this will always return false.
// Defaults the fatalLevel to 'error'.
function isFatal(level) {
   return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
}

// Handle an error based on its severity level.
// Log all levels, and exit the process for fatal levels.
function handleError(level, error) {
   gutil.log(error.message);
   notifier.notify({
     'title': 'Compile Error',
     'message': error.message
   });
   /*if (isFatal(level)) {
      process.exit(1);
  }*/
}

// Convenience handler for error-level errors.
function onError(error) {
    handleError.call(this, 'error', error);
    this.emit('end');
}
// Convenience handler for warning-level errors.
function onWarning(error) {
    handleError.call(this, 'warning', error);
    this.emit('end');
}


// --------------------------------------------------
// Clean
// --------------------------------------------------
/*
gulp.task( 'clean', function() {

    return del.sync([ BUILD + '**', '!' + BUILD ]);
});
*/

// --------------------------------------------------
// Styles
// --------------------------------------------------

gulp.task( 'styles', function() {

    return gulp.src( [ STYLES ] )
        .on('error', function (err) {
            onError.apply( this, [err] );
        })
        .pipe( sass())
        .pipe( autoprefixer() )
        // .on('error', onError)
        .pipe( gulp.dest( BUILD_DIR + "css/" )
    );
});


// --------------------------------------------------
// Scripts
// --------------------------------------------------

gulp.task( 'scripts', function() {
    return gulp.src( SCRIPTS )
        .on('error', function (err) {
            onError.apply( this, [err] );
        })
        // .pipe( usemin({
        //     js: [ ]
        // }) )    // concat all of the js into app.js
        // .on('error', onError)
        .pipe( gulp.dest( BUILD )
    );
});

// --------------------------------------------------
// Browserify
// --------------------------------------------------

gulp.task('browserify', function() {
    return browserify( SOURCE_DIR + 'app.js', {debug: true} )
        .bundle()
        .on('error', function (err) {
            onError.apply( this, [err] );
        })
        // .on('error', console.error.bind(console))
        // .on('error', onError)
        // vinyl-source-stream makes the bundle compatible with gulp
        .pipe( source( 'bundle.jsx' ) ) // Desired filename
        // Output the file
        .pipe(gulp.dest( BUILD_DIR ));
    ;
});


// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

gulp.task( 'watch', [ 'browserify' ], function() {
    fatalLevel = fatalLevel || 'off';

    try{
        gulp.watch( [SCRIPTS], [ 'browserify' ] );
    } catch( e ) {
        console.log( e );
    }
});


// -----------------------------------------------------------------------------
// Default
// -----------------------------------------------------------------------------

gulp.task( 'default', [ 'watch' ] );
