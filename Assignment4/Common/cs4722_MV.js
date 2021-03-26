
// supplement to MVnew.js

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function irand(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}


/**
 * Provide two vectors and position of camera and get the view transform.
 */
function viewTransform(up, fwd, pos) {
    let at = vec3(fwd[0]+pos[0],fwd[1]+pos[1],fwd[2]+pos[2],);
    let up2 = vec3(up[0], up[1], up[2]);
    let eye = vec3(pos[0], pos[1], pos[2]);
    return lookAt(eye, at, up2);
}

function cross4(v4, w4) {
    return vec4(cross(v4, w4));
}


/**
 * Override vec4 in MVnew.
 *
 * @return {any[]}
 */
function vec4()
{
    // console.log("revised vec4");

    var out = new Array(4);
    out.type = 'vec4';
    // console.log('in vec4, begin');
    // console.log(arguments);

    switch ( arguments.length ) {

        case 0:

            out[0] = 0.0;
            out[1] = 0.0;
            out[2] = 0.0;
            out[3] = 0.0;
            return out;

        case 1:
            // console.log('in vec4, case 1');
            // console.log(arguments);
            if (arguments[0].type == "vec3") {
                    // console.log('in vec4, case vec3');
                    // console.log(arguments);
                    out[0] = arguments[0][0];
                    out[1] = arguments[0][1];
                    out[2] = arguments[0][2];
                    out[3] = 1.0;
                    return out;
                }  // moved } to here   cbs 11/16/2019
            else {
                out[0] = arguments[0][0];
                out[1] = arguments[0][1];
                out[2] = arguments[0][2];
                out[3] = arguments[0][3];
                return out;
            }


        case 2:
            if(typeof(arguments[0])=='number'&&arguments[1].type == 'vec3') {
                out[0] = arguments[0];
                out[1] = arguments[1][0];
                out[2] = arguments[1][1];
                out[3] = arguments[1][2];
                return out;
            }
            return out;

        case 3:
            out[0] = arguments[0];
            out[1] = arguments[1];
            out[2] = arguments[2];
            out[3] = 1.0;
            return out;

        case 4:

            // if(isVector(arguments[0])) {
            //     out[0] = arguments[0][0];
            //     out[1] = arguments[0][1];
            //     out[2] = arguments[0][2];
            //     out[3] = arguments[0][3];
            //     return out;
            // }
            out[0] = arguments[0];
            out[1] = arguments[1];
            out[2] = arguments[2];
            out[3] = arguments[3];
            return out;
        default:
            throw "vec4: wrong arguments";
    }
}


/**
 * OVerride cross so that the cross of two vec4's is a vec4.
 * @param u
 * @param v
 * @return {*[]}
 */
function cross( u, v )
{
    if ( u.type == 'vec3' && v.type == 'vec3') {
        var result = vec3(
            u[1]*v[2] - u[2]*v[1],
            u[2]*v[0] - u[0]*v[2],
            u[0]*v[1] - u[1]*v[0]
        );
        return result;
    }

    if ( v.type == 'vec4' && v.type == 'vec4') {
        var result = vec4(
            u[1]*v[2] - u[2]*v[1],
            u[2]*v[0] - u[0]*v[2],
            u[0]*v[1] - u[1]*v[0],
            0
        );
        return result;
    }

    throw "cross: types aren't matched vec3 or vec4";
}


// Derived from
// cuon-matrix.js (c) 2012 kanda and matsuda
 function frustum(left, right, bottom, top, near, far) {
    let e, rw, rh, rd;

    if (left === right || top === bottom || near === far) {
        throw 'null frustum';
    }
    if (near <= 0) {
        throw 'near <= 0';
    }
    if (far <= 0) {
        throw 'far <= 0';
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = mat4();

    e[0][ 0] = 2 * near * rw;
    e[0][ 1] = 0;
    e[0][ 2] = 0;
    e[0][ 3] = 0;

    e[1][ 0] = 0;
    e[1][ 1] = 2 * near * rh;
    e[1][ 2] = 0;
    e[1][ 3] = 0;

    e[2][ 0] = (right + left) * rw;
    e[2][ 1] = (top + bottom) * rh;
    e[2][2] = -(far + near) * rd;
    e[2][3] = -1;

    e[3][0] = 0;
    e[3][1] = 0;
    e[3][2] = -2 * near * far * rd;
    e[3][3] = 0;

    return e;
}



/**
 * Set the perspective projection matrix by fovy and aspect.
 * @param fovy The angle between the upper and lower sides of the frustum.
 * @param aspect The aspect ratio of the frustum. (width/height)
 * @param near The distances to the nearer depth clipping plane. This value must be plus value.
 * @param far The distances to the farther depth clipping plane. This value must be plus value.
 * @return this
 */
function perspectiveXXX(fovy, aspect, near, far) {
    // console.log("using cuon matrix perspective function");
    let e, rd, s, ct;

    if (near === far || aspect === 0) {
        throw 'null frustum';
    }
    if (near <= 0) {
        throw 'near <= 0';
    }
    if (far <= 0) {
        throw 'far <= 0';
    }

    fovy = Math.PI * fovy / 180 / 2;
    s = Math.sin(fovy);
    if (s === 0) {
        throw 'null frustum';
    }

    rd = 1 / (far - near);
    ct = Math.cos(fovy) / s;

    e = mat4();

    e[0][ 0] = ct /aspect;
    e[0][ 1] = 0;
    e[0][ 2] = 0;
    e[0][ 3] = 0;

    e[1][ 0] = 0;
    e[1][ 1] = ct;
    e[1][ 2] = 0;
    e[1][ 3] = 0;

    e[2][ 0] = 0;
    e[2][ 1] = 0;
    e[2][2] = -(far + near) * rd;
    e[2][3] = -1;

    e[3][0] = 0;
    e[3][1] = 0;
    e[3][2] = -2 * near * far * rd;
    e[3][3] = 0;

    // e[0]  = ct / aspect;
    // e[1]  = 0;
    // e[2]  = 0;
    // e[3]  = 0;
    //
    // e[4]  = 0;
    // e[5]  = ct;
    // e[6]  = 0;
    // e[7]  = 0;
    //
    // e[8]  = 0;
    // e[9]  = 0;
    // e[10] = -(far + near) * rd;
    // e[11] = -1;
    //
    // e[12] = 0;
    // e[13] = 0;
    // e[14] = -2 * near * far * rd;
    // e[15] = 0;

    return e;
}



function mat3()
{
    // v = _argumentsToArray( arguments );

    var out = new Array(3);
    out[0] = new Array(3);
    out[1] = new Array(3);
    out[2] = new Array(3);

    switch ( arguments.length ) {
        case 0:
            out[0][0]=out[1][1]=out[2][2]=1.0;
            out[0][1]=out[0][2]=out[1][0]=out[1][2]=out[2][0]=out[2][1]=0.0;
            break;
        case 1:
            if(arguments[0].length >= 16) {
                for(var i=0; i<3; i++) for(var i=0; i<3; i++) {
                    out[i][j]=arguments[0][3*i+j];
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        out[i][j] = arguments[0][i][j];
                    }
                }
            }
            break;

        case 9:
            for(var i=0; i<3; i++) for(var j=0; j<3; j++) {
                out[i][j] = arguments[3*i+j];
            }
            break;
        default:
            throw "mat3: wrong arguments";
    }
    out.type = 'mat3';

    return out;
}
