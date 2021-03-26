
"use strict";


const vertex_shader = `

attribute vec4 vertex;
attribute vec4 normal;


uniform mat4 model_transform;
uniform mat4 view_projection_transform;
uniform mat4 normal_transform;

varying vec4 vColor;


uniform vec4 mat_ambient;
uniform vec4 mat_diffuse;
uniform vec4 mat_specular;
uniform float mat_shininess;
uniform vec4 light_ambient;
uniform vec4 light_diffuse;
uniform vec4 light_specular;
uniform vec4 light_position;
uniform vec4 camera_position;

uniform int flags;

void main()
{
    vec4 obj_loc = model_transform * vertex;
    gl_Position = view_projection_transform * obj_loc ;

    vec4 l_vec = normalize(light_position - obj_loc);
    vec4 n_vec = normalize(normal_transform * normal);
    float lndot = dot(l_vec, n_vec);
    float diffuse_scale = max(0.0, lndot);
    vec4 diffuse_color = diffuse_scale * light_diffuse * mat_diffuse;
    if( (flags - 2*(flags/2)) == 0)
        diffuse_color = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 h_vec = normalize(l_vec + normalize(camera_position - obj_loc));
    float spec_scale = pow(max(0.0, dot(h_vec, n_vec)), mat_shininess);
    vec4 specular_color;
    if(lndot < 0.0) {
        specular_color = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        specular_color = spec_scale * mat_specular * light_specular;
    }
    if( (flags - 4*(flags/4)) < 2 ) {
        specular_color = vec4(0.0, 0.0, 0.0, 1.0);
    }


    vec4 ambient_color = mat_ambient * light_ambient;
    if(flags < 4) {
        ambient_color = vec4(0.0, 0.0, 0.0, 1.0);
    }

    // vColor = vec4((ambient_color + diffuse_color + specular_color).rgb,1.0);
    vColor = ambient_color + diffuse_color + specular_color;

    //vColor = n_vec;
}`;

const fragment_shader = `
precision mediump float;

varying vec4 vColor;


void
main()
{
    // gl_FragColor = vec4(vColor.rgb,1.0) ;
    gl_FragColor = vColor;
}
`;




window.onload = function init()
{

  // let cylt = new cs4722_Shapes.CylinderTwgl();
  // console.log(cylt.arrays);



  const canvas = document.getElementById("gl-canvas");
  const gl = canvas.getContext('webgl');
  if (!gl) alert( "WebGL isn't available" );
  gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.BACK);


  //
  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(... X11.DarkGray);

  // create program from shader and set it active
  const program = initShaders(gl, vertex_shader, fragment_shader);
  gl.useProgram(program);


  let shape_list = [];

  let common_scheme = [X11.White, X11.White];
  let shape = new cs4722_Shapes.Sphere(10, 30);
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Block();
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Triangles(teapot_0854590);
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Cylinder();
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);
  console.log(shape.arrays);

  shape = new cs4722_Shapes.Sphere(10, 30);
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Block();
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Triangles(teapot_0854590);
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);

  shape = new cs4722_Shapes.Cylinder();
  shape.scheme_colors = common_scheme;
  shape_list.push(shape);
  console.log(shape.arrays);


  setup_shape_buffers(shape_list, gl, program, false, true, false, true);



  // Create a list of objects
  // const x11_color_list = Object.values(X11);
  // const number_on_side = 15;
  let object_list = [];
  // let radius  = 20/number_on_side;

  const rotation_delta = 5;

  object_list.push(
    {
      translate: [10,10,0],
      angles: [30, 30, 30,],
      angle_rates: [rotation_delta,0,0],
      scales: [10,10,10],
      material: {
        ambient: X11.Maroon4,
        diffuse: X11.Maroon4,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[1],
    }
  );

  object_list.push(
    {
      translate: [-10,-10,0],
      angles: [30, 30, 30,],
      angle_rates: [0,rotation_delta,0],
      scales: [5,4,4.5],
      material: {
        ambient: X11.PaleVioletRed4,
        diffuse: X11.PaleVioletRed4,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[0],
    }
  );

  object_list.push(
    {
      translate: [10,-10,0],
      angles: [30, 30, 30,],
      angle_rates: [0,0,rotation_delta],
      scales: [5,5,5],
      material: {
        ambient: X11.Pink4,
        diffuse: X11.Pink4,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[3],
    }
  );

  object_list.push(
    {
      translate: [-10,10,0],
      angles: [30, 30, 30,],
      angle_rates: [rotation_delta,0,rotation_delta],
      scales: [.1,.1,.1],
      material: {
        ambient: X11.Cyan,
        diffuse: X11.Cyan,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[2],
    }
  );

  object_list.push(
    {
      translate: [25,20,0],
      angles: [30, 30, 30,],
      angle_rates: [rotation_delta,0,0],
      scales: [10,10,10],
      material: {
        ambient: X11.Maroon3,
        diffuse: X11.Maroon3,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[1],
    }
  );

  object_list.push(
    {
      translate: [-25,-20,0],
      angles: [30, 30, 30,],
      angle_rates: [0,rotation_delta,0],
      scales: [5,4,4.5],
      material: {
        ambient: X11.RosyBrown4,
        diffuse: X11.RosyBrown4,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[0],
    }
  );

  object_list.push(
    {
      translate: [25,-20,0],
      angles: [30, 30, 30,],
      angle_rates: [0,0,rotation_delta],
      scales: [5,5,5],
      material: {
        ambient: X11.Pink,
        diffuse: X11.Pink,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[3],
    }
  );

  object_list.push(
    {
      translate: [-25,20,0],
      angles: [30, 30, 30,],
      angle_rates: [rotation_delta,0,rotation_delta],
      scales: [.1,.1,.1],
      material: {
        ambient: X11.Aquamarine3,
        diffuse: X11.Aquamarine3,
        specular: X11.AliceBlue,
        shininess: 20,
      },
      shape: shape_list[2],
    }
  );



  addSlider("controls", "shininess", "Shininess",
    1, object_list[0].material.shininess, 50, 1,
    function(value) {
      for(let obj of object_list) {
        obj.material.shininess = value;
      }
    });

  let light = {
    position: vec4(10, 10, 10, 1),
    ambient: X11.Gray50,
    diffuse: X11.Gray100,
    specular: X11.White,
  };




  // // change initial camera for this example
  // camera_position  = vec4(0,0,20,1);
  // camera_forward = vec4(0,0,-1,0);
  // camera_left = cross(camera_up, camera_forward);



  // projection parameters
  let proj_far = 200;
  let proj_near = 1/proj_far;
  let proj_aspect = canvas.width / canvas.height;
  let proj_fov = 90;


  const camera = new cs4722_camera();
  camera.setup_callbacks(canvas, render);
  // camera.do_logging = true;
  camera.camera_position = vec3(-.5, -.5, 24);
  // camera.camera_position = vec3(light.position[0],light.position[1],light.position[2],);
  // console.log(camera.camera_position);


  let flags = 7;

  addCheckbox("controls", "diffuse", "Diffuse", flags & 1,
    function(checked) {
      if(checked) {
        flags |= 1;
      } else {
        flags &= 6;
      }
    });

  addCheckbox("controls", "specular", "Specular", flags & 2,
    function(checked) {
      if(checked) {
        flags |= 2;
      } else {
        flags &= 5;
      }
    });

  addCheckbox("controls", "ambient", "Ambient", flags & 4,
    function(checked) {
      if(checked) {
        flags |= 4;
      } else {
        flags &= 3;
      }
    });


  let last_time = 0;  // last time animation took place
  let displayed_frame_rate = 0;
  const frame_rate_span = document.getElementById("frame-rate");

  function animate(time) {
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
    requestAnimationFrame(animate);
  }





  const mTransformLoc = gl.getUniformLocation(program, "model_transform");
  const vpTransformLoc = gl.getUniformLocation(program, "view_projection_transform");
  const normalTransformLoc = gl.getUniformLocation(program, "normal_transform");
  const matAmbientLoc = gl.getUniformLocation(program, "mat_ambient");
  const matDiffuseLoc = gl.getUniformLocation(program, "mat_diffuse");
  const matSpecularLoc = gl.getUniformLocation(program, "mat_specular");
  const matShininessLoc = gl.getUniformLocation(program, "mat_shininess");
  const lightAmbientLoc = gl.getUniformLocation(program, "light_ambient");
  const lightDiffuseLoc = gl.getUniformLocation(program, "light_diffuse");
  const lightSpecularLoc = gl.getUniformLocation(program, "light_specular");
  const lightPositionLoc = gl.getUniformLocation(program, "light_position");
  const cameraPositionLoc = gl.getUniformLocation(program, "camera_position)");

  const flagsLoc = gl.getUniformLocation(program, "flags");




  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT + gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(flagsLoc, flags);

    let view_tr = camera.get_view_transform();
    // console.log(view_tr);
    let proj_tr = perspective(proj_fov, proj_aspect, proj_near, proj_far);
    // console.log(proj_tr);
    let vp_tr = mult(proj_tr, view_tr);
    gl.uniformMatrix4fv(vpTransformLoc, false, flatten(vp_tr));

    // console.log(light.ambient);
    gl.uniform4f(lightAmbientLoc, ...light.ambient);
    gl.uniform4f(lightDiffuseLoc, ...light.diffuse);
    gl.uniform4f(lightPositionLoc, ...light.position);
    gl.uniform4f(lightSpecularLoc, ...light.specular);
    gl.uniform3f(cameraPositionLoc, ...camera.camera_position);

    for(let obj of object_list) {
      // Transform for the object
      let mod_tr = scale(...obj.scales);
      mod_tr = mult(rotateX(obj.angles[0]), mod_tr);
      mod_tr = mult(rotateY(obj.angles[1]), mod_tr);
      mod_tr = mult(rotateZ(obj.angles[2]), mod_tr);
      mod_tr = mult(translate(...obj.translate), mod_tr);
      // console.log(mod_tr);

      let normal_tr = transpose(inverse(mod_tr));
      // Get rid of the transpose part, which is now in the last row
      normal_tr[3][0] = 0;
      normal_tr[3][1] = 0;
      normal_tr[3][2] = 0;

      // can also be computed this way
      // let normal_tr = scale(1/obj.scales[0],1/obj.scales[1],1/obj.scales[2])
      // normal_tr = mult(rotateX(obj.angles[0]), normal_tr);
      // normal_tr = mult(rotateY(obj.angles[1]), normal_tr);
      // normal_tr = mult(rotateZ(obj.angles[2]), normal_tr);

      // console.log("normal_tr");
      // printm(normal_tr);


      gl.uniformMatrix4fv(mTransformLoc, false, flatten(mod_tr));
      gl.uniformMatrix4fv(normalTransformLoc, false, flatten(normal_tr));
      gl.uniform4f(matAmbientLoc, ...obj.material.ambient);
      gl.uniform4f(matDiffuseLoc, ...obj.material.diffuse);
      gl.uniform4f(matSpecularLoc, ...obj.material.specular);
      gl.uniform1f(matShininessLoc, obj.material.shininess);
      gl.drawArrays(gl.TRIANGLES, obj.shape.buffer_start, obj.shape.buffer_size);
    }

  }



  // render();
  animate(0);
};


