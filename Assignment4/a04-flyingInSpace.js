
"use strict";


const vertex_shader = `

    mat4 translateM(vec3 tr) {
        return mat4(1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    tr.x, tr.y, tr.z, 1.0);
    }
    mat4 scaleM(vec3 sc) {
        return mat4(sc.x, 0.0, 0.0, 0.0,
                    0.0, sc.y, 0.0, 0.0,
                    0.0, 0.0, sc.z, 0.0,
                    0.0, 0.0, 0.0, 1.0);
    }
    mat4 rotateX(float theta) {
      float c = cos( radians(theta) );
      float s = sin( radians(theta) );
      mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
          0.0,  c,  -s, 0.0,
          0.0, s,  c, 0.0,
          0.0,  0.0,  0.0, 1.0 );
      return rx;
    }
    mat4 rotateY(float theta) {
      float c = cos( radians(theta) );
      float s = sin( radians(theta) );
      mat4 rx = mat4( c, 0.0, s, 0.0,
          0.0, 1.0,  0.0, 0.0,
          -s, 0.0,  c, 0.0,
          0.0, 0.0,  0.0, 1.0 );
      return rx;
    }
    mat4 rotateZ(float theta) {
      float c = cos( radians(theta) );
      float s = sin( radians(theta) );
      mat4 rx = mat4( c, -s, 0.0, 0.0,
          s,  c, 0.0, 0.0,
          0.0,  0.0, 1.0, 0.0,
          0.0,  0.0, 0.0, 1.0 );
      return rx;
    }



    attribute vec4 vertex;
    attribute vec4 color;

    uniform vec3 translateP, scaleP, angleP;
    uniform mat4 vp_transform;

    varying vec4 vColor;

    void main()
    {
        gl_PointSize = 12.0;
        mat4 modtr = translateM(translateP) * rotateZ(angleP.z) *
                rotateY(angleP.y) * rotateX(angleP.x) * scaleM(scaleP);
        gl_Position = vp_transform * modtr * vertex;
        vColor = color;
    }`;

const fragment_shader = `
    precision mediump float;

    varying vec4 vColor;

    uniform vec4 uColor;

    void
    main()
    {
        gl_FragColor = vColor * uColor;
    }
    `;

// it's useful to have repeatable results, so using a random number generator
//  that allows 'seeding'.
//  To see something different, change the argument to the constructor.
const gen = new MersenneTwister(12345);

function rand(min, max) {
  return min + gen.random() * (max - min);
}


window.onload = function init()
{

  const [gl, program, canvas] =
    webgl_setup("gl-canvas", vertex_shader, fragment_shader, true, X11.DarkGray);

  // gl.clearDepth(0);
  // gl.depthFunc(gl.GREATER);

  // Create a list of shapes

  let shape_list = [];

  let shape = new cs4722_Shapes.Sphere(10, 30);
  shape.scheme_colors = [X11.White, X11.Gray75];
  shape_list.push(shape);

  shape = new cs4722_Shapes.Block();
  shape.scheme_colors = [X11.White, X11.Gray75, X11.White, X11.Gray75, X11.White, X11.Gray75,];
  shape_list.push(shape);

  shape = new cs4722_Shapes.Cylinder(.5);
  shape.scheme_colors = [X11.White, X11.Gray75];
  shape_list.push(shape);

  shape = new cs4722_Shapes.Cylinder();
  shape.scheme_colors = [X11.White, X11.Gray75];
  shape_list.push(shape);

  // console.log(shape_list);

  // Set up the buffers for these shapes
  setup_shape_buffers(shape_list, gl, program, true, false, false, true);


  // Create a list of objects
  // const x11_color_list = Object.values(X11);
  const number_on_side = 3;
  let object_list = [];
  let gap = 2 / (number_on_side + 0);
  let radius  = gap/6;
  let multiplier = 3.2;
  const angle_rate_limit = 20;

  let ss = 9;
  let spread = 10/ss;  // multiplier for translate only

  let coord_limit = Math.round(multiplier * number_on_side);
  for(let x = -coord_limit; x < coord_limit; x++ ) {
    let cx = (x + multiplier*number_on_side) / (2*multiplier*number_on_side);
    for(let y = -coord_limit; y < coord_limit; y++) {
      let cy = (y + multiplier*number_on_side) / (2*multiplier*number_on_side);
      for(let z = -coord_limit; z < coord_limit; z++) {
        let cz = (z + multiplier*number_on_side) / (2*multiplier*number_on_side);
        object_list.push(
          {
            translate: mult(ss*spread, vec3((x+.5)*gap-1, (y+.5)*gap-1, (z+.5)*gap-1)),
            // translate: mult(ss,vec3(4*x*radius-1 + 2*radius, 4*y*radius-1 + 2*radius, 4*z*radius-1 + 2*radius)),
            angle: [0, 0, 0,],
            // angle_rates: [0,0,0],
            angle_rates: [rand(-angle_rate_limit, angle_rate_limit),
              rand(-angle_rate_limit, angle_rate_limit),
              rand(-angle_rate_limit, angle_rate_limit)],
            scale: mult(ss, vec3(radius, radius, radius)),
            // model_transform: mod_tr,
            // transform: flatten(tr),
            color: vec4(cx, cy, cz, 1),
            shape: shape_list[Math.abs(x+y+z) % shape_list.length],
          }
        );
      }
    }
  }

  document.getElementById("object-count").innerText = object_list.length.toString();

  // camera parameters
  let camera_position = vec3(0,0,0);
  let coord = object_list[object_list.length-1].translate[0] + 3;
  // let coord = multiplier * number_on_side * gap;
  camera_position = vec3(0, coord, coord);
  let camera_at = vec3(0,0,0);
  let camera_up = vec3(0,1,0);


  const cam_disp = [ document.getElementById("camera-x-value"),
    document.getElementById("camera-y-value"),
    document.getElementById("camera-z-value"),
  ];
  const cam_at_disp = [ document.getElementById("at-x-value"),
    document.getElementById("at-y-value"),
    document.getElementById("at-z-value"),
  ];
  const cam_up_disp = [ document.getElementById("up-x-value"),
    document.getElementById("up-y-value"),
    document.getElementById("up-z-value"),
  ];
  const cam_cross_disp = [ document.getElementById("cross-x-value"),
    document.getElementById("cross-y-value"),
    document.getElementById("cross-z-value"),
  ];

  // this function will update the display areas to match the current camera values
  function display_camera() {
    let cr = cross(camera_up, subtract(camera_at, camera_position));
    for (let i = 0; i < cam_disp.length; i++) {
      cam_disp[i].innerText = camera_position[i].toFixed(2);
      cam_at_disp[i].innerText = camera_at[i].toFixed(2);
      cam_up_disp[i].innerText = camera_up[i].toFixed(2);
      cam_cross_disp[i].innerText = cr[i].toFixed(2);
    }
  }

  const scaleUD = 1;
  const scaleLR = 1;

  canvas.addEventListener("mousemove",
    function(event) {
      if(event.buttons) {
        // we need vectors point forward (from camera to 'at') and
        // left to compute the changes to the camera.
        let camera_forward = subtract(camera_at, camera_position);
        let camera_left = cross(camera_up, camera_forward);

        // The angle to move up or down is based on the movement of the mouse
        // in the y direction.
        // movementY is the amount moved since the last mouse event.
        let angleUD = event.movementY * scaleUD;

        // a rotation around the left axis of the camera will be applied to the
        // forward direction.
        // let trUD = rotate(angleUD, camera_left[0],camera_left[1],camera_left[2]);
        let trUD = mat3(rotate(angleUD, camera_left));


        // this is what  the up/down movement would do to camera forward.
        let camera_forward2 = mult(trUD, camera_forward);

        // do not do this up-down rotation if this would bring the forward and
        // up directions too close to  each other.
        if(length(cross(camera_forward2, camera_up)) > .2) {
          camera_forward = camera_forward2;
        }
        // the up/down motion will not change the camera up.
        // this looks more intuitive to me when actually using the mouse to pan.

        // similarly, the left right is a rotation about the camera up
        let angleLR = event.movementX * scaleLR;
        let trLR = mat3(rotate(angleLR, camera_up));

        // rotate camera forward and then compute camera at from that.
        camera_forward = mult(trLR, camera_forward);
        camera_at = add(camera_forward, camera_position);

        // requestAnimationFrame(render);
      }
    });



  let scale_move_FB = .1;
  let scale_move_LR = .1;
  let scale_move_UD = .1;
  let upPressed = false;
  let downPressed = false;

  window.addEventListener("keydown",
    function(event){
      let k = event.key;
      let c = event.keyCode;
      console.log("event key " + k);
      let camera_forward = subtract(camera_at, camera_position);
      if(k === 'c') {
        let x = cross(camera_up, camera_forward);
        let camera_left = normalize(x);
        let move = mult(scale_move_LR, camera_left)
        camera_position = add(camera_position, move);
        camera_at = add(camera_at, move);
      } else if(k === 'z') {
        let x = cross(camera_up, camera_forward);
        let camera_left = normalize(x);
        let move = mult(scale_move_LR, camera_left);
        camera_position = subtract(camera_position, move);
        camera_at = subtract(camera_at, move);
      } else if(k === 'w') {
        let camera_forward2 = normalize(camera_forward);
        let move = mult(scale_move_FB, camera_forward2);
        camera_position = add(camera_position, move);
        camera_at = add(camera_at, move);
      } else if(k === 's') {
        let camera_forward2 = normalize(camera_forward);
        let move = mult(scale_move_FB, camera_forward2);
        camera_position = subtract(camera_position, move);
        camera_at = subtract(camera_at, move);
      } else if (c == 40) {
        downPressed = true;
      } else if (c == 38) {
        upPressed = true;
      }
      else {
        // ignore other keys
      }
      // event.stopPropagation();
      // requestAnimationFrame(render);
    });



  // projection parameters
  let proj_near = 0.1;
  let proj_far = 15;
  let proj_fov = 90;
  let proj_aspect = canvas.width / canvas.height;


  addSlider("controls", "proj_f", "Projection far", 1, proj_far, 100, 1,
    value => {
      proj_far = value;
      requestAnimationFrame(render);
    });

  addSlider("controls", "proj_a", "Projection aspect", .1, proj_aspect, 10,  .1,
    value => {
      proj_aspect = value;
      requestAnimationFrame(render);
    });

  addSlider("controls", "proj_fov", "Projection FOV", 10, proj_fov, 179,  1,
    value => {
      proj_fov = value;
      requestAnimationFrame(render);
    });

  // get the location of the uniform variable to send the transformation to
  const scalePLoc = gl.getUniformLocation(program, "scaleP");
  const translatePLoc = gl.getUniformLocation(program, "translateP");
  const anglePLoc = gl.getUniformLocation(program, "angleP");
  const vp_transformLoc = gl.getUniformLocation(program, "vp_transform");
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
      for(let i = 0; i < obj.angle.length; i++ ) {
        obj.angle[i] += obj.angle_rates[i] * delta_time / 100;
      }
    }


    if(delta_time > 0) {
      // frame rate is the reciprocal of the time between animation calls
      //  1000 since delta_time is in milliseconds and the frame rate is frames per second
      let frame_rate = ((1000 / delta_time) + 5*displayed_frame_rate)/6;
      // only display the frame rate if it has changed more than 1 frame/second from
      // the last time it was displayed.
      // if (Math.abs(frame_rate - displayed_frame_rate) > .1) {
      frame_rate_span.innerText = frame_rate.toFixed(3);
      displayed_frame_rate = frame_rate;
      // }
    }


    // render the scene now that the change has been recorded
    render();
    // Ask to animate again
    requestAnimationFrame(animate2);
  }


  /**
   *
   * @param time measured in seconds
   */
  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // compute the view transformation
    let view_tr = lookAt(camera_position, camera_at, camera_up);

    let proj = perspective(proj_fov, proj_aspect, proj_near, proj_far);
    let vp_tr = mult(proj, view_tr);
    gl.uniformMatrix4fv(vp_transformLoc, false, flatten(vp_tr));


    for(let obj of object_list) {
      // send the current value of the transformation to the vertex shader
      // gl.uniformMatrix4fv(m_transformLoc, false, obj.transform);
      gl.uniform3f(translatePLoc, ...obj.translate);
      gl.uniform3f(scalePLoc, ...obj.scale);
      gl.uniform3f(anglePLoc, ...obj.angle);
      gl.uniform4f(colorLoc, ...obj.color);

      // each shape stores its location in the buffer: buffer_start is where
      //  the shape starts (counting vertices)
      //  buffer_size is the number of vertices
      gl.drawArrays(gl.TRIANGLES, obj.shape.buffer_start, obj.shape.buffer_size);

    }
    display_camera();
  }


  // render();
  requestAnimationFrame(animate2);
};


