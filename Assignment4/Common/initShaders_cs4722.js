

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
