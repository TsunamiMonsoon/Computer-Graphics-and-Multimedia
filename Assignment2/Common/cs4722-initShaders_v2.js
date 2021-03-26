
/*
    This contains various support functions for WebGL programs.
    The first function, initShaders, is a slightly modified version of the function provided by
        Angel and Schreiner.
        This version simply takes string arguments containing the source code for shaders.

    This second version (the first version is initShaders_cs4722) adds a function that
    contains the boiler plate for getting a context and a program.
 */

// this version takes the shaders as strings and returns the program object

    function initShaders(gl, vShaderString, fShaderString) {
        function getShader(gl, shaderString, type) {
            const shaderScript = shaderString;
            // console.log(shaderScript);
            const shader = gl.createShader(type);
            if (!shaderScript) {
                alert("Could not find shader source: "+shaderName);
            }
            gl.shaderSource(shader, shaderScript);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        const vertexShader = getShader(gl, vShaderString, gl.VERTEX_SHADER),
            fragmentShader = getShader(gl, fShaderString, gl.FRAGMENT_SHADER),
            program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
            return null;
        }


        return program;
    }


/**
 * This function sets up the webgl program, defines shaders and initializes some
 * standard attributes.
 *
 * @param canvas_id   Id of the canvas element on which to display.
 * @param vertex_shader  String containing the code for the vertex shader
 * @param fragment_shader  String containing the code for the fragment shader
 * @param depth_test  Whether to enable depth testing
 * @param background_color Color to clear the canvas background
 * @return list with webgl context, the program, the canvas element
 */
function webgl_setup(canvas_id, vertex_shader, fragment_shader, depth_test=true,
                     background_color = [.66, .66, .66, 1]){
    const canvas = document.getElementById("gl-canvas");
    const gl = canvas.getContext('webgl');
    if (!gl) alert( "WebGL isn't available" );
    if(depth_test) {
        gl.enable(gl.DEPTH_TEST);
    }

    //
    //  Configure WebGL
    //
    // set drawing area of canvas to the visible size
    // The visible size is set by CSS, so this is necessary to get the two values
    //      in synch
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    // console.log(wid + " x " + hgt);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(... background_color);

    // create program from shader and set it active
    const program = initShaders(gl, vertex_shader, fragment_shader);
    gl.useProgram(program);

    return [gl, program, canvas];
}