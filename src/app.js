var console = require( "./console" );
var _ = require( "underscore" );

var timelineTemplate = 
    "ci::Anim<vec2> mPos;" +
    "auto mTimeline = Timeline::create();" +
    "mTimeline->appendTo( &mPos, <%= from %>, <%= to %>, <%= duration %>, <%= easing %> );";

var vec2Template = 
    "mTimeline->appendTo( &<%= property %>, vec2( <%= from.x %>, <%= from.y %> ), vec2( <%= to.x %>, <%= to.y %> ), <%= duration %>, <%= easing %> );";

var vec3Template = 
    "mTimeline->appendTo( &<%= property %>, vec3( <%= from.x %>, <%= from.y %> ), vec3( <%= to.x %>, <%= to.y %> ), <%= duration %>, <%= easing %> );";

var floatTemplate = 
    "mTimeline->appendTo( &<%= property %>, <%= from %>, <%= to %>, <%= duration %>, <%= easing %> );";

// -----------------------------------------------------------------------------
// Function for getting the name of an object
// -----------------------------------------------------------------------------

Object.prototype.getType = function() {
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

var project = {
    comps: []
};

var Transform = function(){

    var transform = {
        anchorPoint: [],
        position: [],
        scale: [],
        orientation: [],
        rotation: [],
        opacity: null
    };

    return transform;
};



var Layer = function( layerItem ){

    var layer = {
        layerObject: layerItem,
        properties: [],

        findProperties: function(){
            if( !this.layerObject.enabled )
                return;

            console.log( "TYPE", this.layerObject.getType() );
            if( this.layerObject.getType() == "AVLayer" ){

                // Transform
                var t = this.layerObject.Transform;
                var transform = new Transform();

                // POSITION
                var positionTl = [];
                // console.log( this.layerObject.Transform, t.position, t.position.numKeys, t.property( "Position" ) );
                
                for( var i = 1; i < t.position.numKeys + 1; i++ ){
                    var keyTime = t.position.keyTime(i);
                    var value = t.position.valueAtTime( keyTime, true );
                    var obj = {
                        time: keyTime,
                        value: value
                    };
                    positionTl.push( obj );
                    console.log( "obj: ", obj );

                    // get template type
                    var tlString = _.template( timelineTemplate );
                    var str = tlString( {from: "0.0f", to: "1.0f", duration: "1.0f", easing: "Quad.easeOut" } );
                    console.log( str );
                }
            }

            console.log( "FIND PROPERTIES", this.layerObject.getType() );
        },

        getKeyframeValues: function(){

        }
    };

    return layer;
};

var Comp = function( compItem ){
    var compObject = compItem;
    var comp = {

        layers: [],

        findLayers: function(){
            var _this = this;
            var layerCollection = compObject.layers;
            if( ! layerCollection.length ){
                console.log( "NO LAYERS IN SELECTED COMP" );
            }
            for( var i = 1; i < layerCollection.length+1; i++ ){
                var layer = new Layer( layerCollection[i] );
                console.log( "LAYER", layer, layer.name );
                layer.findProperties();
                _this.layers.push( layer );
            }

        }
    };

    return comp;
}


// Returns an array of comps found among the selection array
var findValidComps = function( selection ){
    var comps = [];
    for( var i=0; i < selection.length; i++ ){
        var item = selection[i];
        console.log( item, item.getType() );
        if( item.getType() == "CompItem" )
        {
            // CREATE and initialize Comp Objects
            var comp = new Comp( item );
            comp.findLayers();
            comps.push( comp );
        }
    }
    return comps;
};


var makeProjectAtlas = function( selection ){

    console.log( "MAKE PROJECT ATLAS" );
    // FIND selected items
    var selection = app.project.selection;

    // FIND valid comps
    project.comps = findValidComps( selection );

    if( project.comps.length === 0 ){
        end( "NO VALID COMPS SELECTED" );
    }
};

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

var main = function(){
    $.writeln( console.log );
    console.log( "\n---------------------- " );
    console.log( "BEGIN MAIN", app.project.selection );

    if( !app.project ){
        alert( "Error connecting to After Effects project" );
    }

    project = makeProjectAtlas( app.project.selection );
    console.log( "SUCCESS!" );
}


var end = function( message ){
    console.log( message );
    alert( message );
}


// Begin
main();
