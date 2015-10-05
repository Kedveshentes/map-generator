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

requirejs(['labyrinth'],
function (Labyrinth) {
    var labyrinthConfig = {
        width          : 30,
        height         : 30,
        size           : 5,
        // step           : 10,
        randomness     : 5,
        // ereaseDeadEnds : 0,
        rooms          : {
            roomAttempts   : 100,
            pRoomWidthMax  : 7,
            pRoomWidthMin  : 1,
            pRoomHeightMax : 7,
            pRoomHeightMin : 1
        }
    };

    var labyrinth = new Labyrinth(labyrinthConfig);
    labyrinth.draw(5);
});
