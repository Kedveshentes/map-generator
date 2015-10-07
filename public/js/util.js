define(['glMatrix'],
function (glMatrix) {
    return {
        timestamp : function () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        },
        tileTypes : {
            0 : {                        // wall
                isSolid : true,
                color   : 0x827267
            },
            1 : {                        // road
                isSolid : false,
                color   : 0xFFFFFF
            },
            2 : {                        // room
                isSolid : false,
                color   : 0xF1F1F1
            },
            3 : {                        // door
                isSolid : false,
                color   : 0xFFC8AD
            },
            4 : {                        // waypoints
                isSolid : false,
                color   : 0xFF0000
            }
        },
        degToRad : function (degrees) {
			return degrees * Math.PI / 180;
		},
        rotationMatrix : function (degrees) {
            return [
                  Math.cos(this.degToRad(degrees)).toFixed(),
                  Math.sin(this.degToRad(degrees)).toFixed(), // should be -
                - Math.sin(this.degToRad(degrees)).toFixed(), // should be +
                  Math.cos(this.degToRad(degrees)).toFixed()
            ];
        },
        containsObject : function (list, object) {
            for (var i = 0; i < list.length; i++) {
                if (_.isEqual(list[i], object)) {
                    return false;
                }
            }
            return true;
        },
        turn : function (vector, direction) {
            switch (direction) {
                case 'left':
                    glMatrix.vec2.transformMat2(vector, vector, this.rotationMatrix(-90));
                    break;
                case 'right':
                    glMatrix.vec2.transformMat2(vector, vector, this.rotationMatrix(90));
                    break;
                case 'back':
                    glMatrix.vec2.transformMat2(vector, vector, this.rotationMatrix(180));
                    break;
                default:
                    console.log('invalid switch direction');
            }
        }
    };
});
