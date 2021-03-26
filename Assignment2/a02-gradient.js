
"use strict";


  const vertex_shader = `

  attribute vec4 vertex;
  attribute vec4 color;

  varying vec4 vColor;

  void main()
  {
      gl_PointSize = 12.0;
      gl_Position = vertex;
      vColor = color;
  }`;

const fragment_shader = `
  precision mediump float;

  varying vec4 vColor;

  void
  main()
  {
      gl_FragColor = vColor;
  }
  `;

// console.log(fragment_shader);



window.onload = function init()
{
    const canvas = document.getElementById("gl-canvas");
    const gl = canvas.getContext('webgl');
    if (!gl) alert( "WebGL isn't available" );

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
    gl.clearColor(... X11.AliceBlue);

    // create program from shader and set it active
    const program = initShaders(gl, vertex_shader, fragment_shader);
    gl.useProgram(program);



    // create list of vertices
    const number_of_vertices = 8;
    const delta = 2 * Math.PI / (number_of_vertices-2);
    const radius = 1;
    let vertex_list = new MVbuffer(number_of_vertices*4);
    //const origin = vec4(0, 0, 0, 1);
    vertex_list.push(vec4(0, 0, 0, 1));
    for(let i = 0; i < number_of_vertices-2; i++) {
        const angle = i * delta;
        const vertex = vec4(radius*Math.cos(angle), radius*Math.sin(angle), 0, 1);
        vertex_list.push(vertex);
    }
    //const end = vec4(1, 0, 0, 1);
    vertex_list.push(vec4(1, 0, 0, 1));
    console.log(vertex_list);

    // create list of colors
    //const colors = [X11.Red, X11.Yellow, X11.Green, X11.Cyan, X11.Blue, X11.Magenta, X11.Orange, X11.Yellow];
    //const colors = [X11.Blue, X11.White, X11.Yellow, X11.Black, X11.Orange, X11.Gray50, X11.Green, X11.White];
    const colors = [X11.Red, X11.Orange, X11.Yellow, X11.Green, X11.Blue, X11.Purple, X11.Violet, X11.Orange];
    let color_list = new MVbuffer(number_of_vertices * 4);
    for(let i = 0; i < number_of_vertices; i++ ) {
        color_list.push(colors[i % colors.length]);
    }
    console.log(color_list);


    // Load the vertex data into the GPU
    const bufferIdV = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdV );
    gl.bufferData(gl.ARRAY_BUFFER, vertex_list.buf, gl.STATIC_DRAW);
    // associate the vertex buffer with the vertex variable in the vertex shader
    const vertexLoc = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoc);

    // Load the color data into the GPU
    const bufferIdC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData(gl.ARRAY_BUFFER, color_list.buf, gl.STATIC_DRAW);
    // associate the color buffer with the color variable in the vertex shader
    const colorLoc = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);




    gl.clear( gl.COLOR_BUFFER_BIT );
    // uncomment one of the following seven lines to see the drawing mode for these points
    //gl.drawArrays(gl.POINTS, 0, number_of_vertices);
    //gl.drawArrays(gl.LINES, 0, number_of_vertices);
    //gl.drawArrays(gl.LINE_STRIP, 0, number_of_vertices);
    //gl.drawArrays(gl.LINE_LOOP, 0, number_of_vertices);
    //gl.drawArrays(gl.TRIANGLES, 0, number_of_vertices);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, number_of_vertices);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, number_of_vertices);
};


