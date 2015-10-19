'use strict';

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
        width          : 15,
        height         : 15,
        wallThickness  : 10, // default : 10
        size           : 5,
        // step           : 10,
        randomness     : 5,
        write          : false,
        // ereaseDeadEnds : 0,
        rooms          : {
            roomAttempts   : 100,
            pRoomWidthMax  : 3,
            pRoomWidthMin  : 1,
            pRoomHeightMax : 3,
            pRoomHeightMin : 1
        }
    };

    var labyrinth = new Labyrinth(labyrinthConfig);
    var game = Game.getGameInstance();
    game.draw(labyrinth.map, labyrinth.width, labyrinth.height);

    window.main = function () {
        window.requestAnimationFrame(main);
    //     // console.log('asd');
    //   // Whatever your main loop needs to do.
    };
    main();


    // var datShape = new Shape('kalacs', 2, 3);

    // console.log(datShape);














});
