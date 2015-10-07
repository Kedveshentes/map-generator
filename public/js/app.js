requirejs.config({
    baseUrl : 'js',
    paths : {
        app : 'app',
        three : '../../node_modules/three/three.min',
        glMatrix : '../../node_modules/gl-matrix/dist/gl-matrix-min',
        underscore : '../../node_modules/underscore/underscore-min'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

requirejs(['labyrinth', 'game'],
function (Labyrinth, Game) {
    var labyrinthConfig = {
        width          : 10,
        height         : 10,
        size           : 5,
        // step           : 10,
        randomness     : 5,
        // ereaseDeadEnds : 0,
        rooms          : {
            roomAttempts   : 100,
            pRoomWidthMax  : 5,
            pRoomWidthMin  : 1,
            pRoomHeightMax : 5,
            pRoomHeightMin : 1
        }
    };

    var labyrinth = new Labyrinth(labyrinthConfig);
    var game = Game.getGameInstance();
    game.draw(labyrinth.map, labyrinth.width, labyrinth.height);

    window.main = function () {
        window.requestAnimationFrame( main );
        console.log('asd');
      // Whatever your main loop needs to do.
    };
    // main();
    
});
