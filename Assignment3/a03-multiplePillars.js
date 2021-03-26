
  "use strict";


  const vertex_shader = `

      attribute vec3 vertex;
      attribute vec4 color;

      uniform mat4 transform;

      varying vec4 vColor;

      void main() {
          gl_PointSize = 12.0;
          gl_Position = transform * vec4(vertex, 1);
          vColor = color;
      }`;

  const fragment_shader = `
      precision mediump float;

      varying vec4 vColor;

      uniform vec4 uColor;

      void
      main() {
          gl_FragColor = vColor * uColor;
      }
      `;

  // console.log(fragment_shader);



  window.onload = function init() {

    const [gl, program, ] =
      webgl_setup("gl-canvas", vertex_shader, fragment_shader, true, X11.Lavender);

    gl.depthFunc(gl.GREATER);
    gl.clearDepth(0);

    // Create a whole list of shapes

    let shape_list = [];

    let shape = new cs4722_Shapes.Sphere(10, 30);
    shape.scheme_colors = [X11.White, X11.Gray75];
    // shape.vertex_array_object = shapeBuffers(gl,program,shape);
    shape_list.push(shape);

    // shape = new cs4722_Shapes.Block();
    // shape.scheme_colors = [X11.White, X11.Gray75, X11.White, X11.Gray75, X11.White, X11.Gray75,];
    // // shape.vertex_array_object = shapeBuffers(gl,program,shape);
    // shape_list.push(shape);

    // shape = new cs4722_Shapes.Cylinder(2);
    // shape.scheme_colors = [X11.White, X11.Gray75];
    // // shape.vertex_array_object = shapeBuffers(gl,program,shape);
    // shape_list.push(shape);

    shape = new cs4722_Shapes.Cylinder();
    shape.scheme_colors = [X11.White, X11.Gray75];
    // shape.vertex_array_object = shapeBuffers(gl,program,shape);
    shape_list.push(shape);

    // console.log(shape_list);

    // Set up the buffers for these shapes
    setup_shape_buffers(shape_list, gl, program, true, false, false, true);

    // console.log(shape_list);

    // const x11_color_list = Object.values(X11);

    // Create a list of objects, each representing different transforms of the same
    //  geometric shape
    const n = 10;
    let object_list = [];
    const a = .5;
    const b = .5;
    const radius  = a/(n-1);
    const height = b/(n-1);
    // let scale_min  = .05/(n-1);
    // let scale_max = .25/(n-1);
    let angle_rate_limit = 20;
    for(let i = 0; i <= n; i++ ) {
      for(let j = 0; j <= n; j++){
            let x = 2*i/(n-1);
            let y = 2*j/(n-1);
            let z = 0;
          object_list.push(
            {
              translate: [2*i/(n-1) - 1, (2*j/(n-1)-1) + height *1.5, 0],
              angles: [0, 0, 0,],
              //x-aixs rotaion
              angle_rates: [rand(-angle_rate_limit, angle_rate_limit),0,0],
              scales: [radius, height, radius],
              color: [rand(0, 1), rand(0, 1), rand(0, 1), 1],
              shape: shape_list[0],
            }

          );
        object_list.push(
          {
            translate: [2*i/(n-1) - 1, 2*j/(n-1)-1, 0],
            angles: [0, 0, 0,],
            //y-axis rotation
            angle_rates: [0, rand(-angle_rate_limit, angle_rate_limit),0],
            scales: [radius, height, radius],
            color: [rand(0, 1), rand(0, 1), rand(0, 1), 1],
            shape: shape_list[1],
          }

        );
        }
      }

    // get the location of the uniform variable to send the transformation to
    const transformLoc = gl.getUniformLocation(program, "transform");
    const colorLoc = gl.getUniformLocation(program, "uColor");



    let last_time = 0;  // last time animation took place

    // this is the last frame rate displayed
    let displayed_frame_rate = 0;
    // get a reference to the span element which will display the frame rate
    const frame_rate_span = document.getElementById("frame-rate");

    function animate2(time) {
      // time, in milliseconds, between time and the last time animate2 was called
      let delta_time = time - last_time;
      // change last_time to be ready for the next animate2 call
      last_time = time;

      for(let obj of object_list) {
        for(let i = 0; i < obj.angles.length; i++ ) {
          obj.angles[i] += obj.angle_rates[i] * delta_time / 100;
        }
      }


      if(delta_time > 0) {
        // frame rate is the reciprocal of the time between animation calls
        //  1000 since delta_time is in milliseconds and the frame rate is frames per second
        let frame_rate = 1000 / delta_time;
        // only display the frame rate if it has changed more than 1 frame/second from
        // the last time it was displayed.
        if (Math.abs(frame_rate - displayed_frame_rate) > .1) {
          frame_rate_span.innerText = frame_rate.toFixed(3);
          displayed_frame_rate = frame_rate;
        }
      }


      // render the scene now that the change has been recorded
      render();
      // Ask to animate again
      requestAnimationFrame(animate2);
    }


    function render() {
      gl.clear(gl.COLOR_BUFFER_BIT + gl.DEPTH_BUFFER_BIT);

      for(let obj of object_list) {
        // Each time the scene is to be rendered, the transformation will be computed
        // based on the current value of 'angle'
        let tr = scale(...obj.scales);
        tr = mult(rotateX(obj.angles[0]), tr);
        tr = mult(rotateY(obj.angles[1]), tr);
        tr = mult(rotateZ(obj.angles[2]), tr);
        tr = mult(translate(...obj.translate), tr);

        // send the current value of the transformation to the vertex shader
        gl.uniformMatrix4fv(transformLoc, false, flatten(tr));
        gl.uniform4f(colorLoc, ...obj.color);

        // each shape stores its location in the buffer: buffer_start is where
        //  the shape starts (counting vertices)
        //  buffer_size is the number of vertices
        gl.drawArrays(gl.TRIANGLES, obj.shape.buffer_start, obj.shape.buffer_size);

      }
      // requestAnimationFrame(animate);
    }


    // render();

    // start the animation
    // requestAnimationFrame(animate);
    // or use the alternate
    requestAnimationFrame(animate2);
  };


