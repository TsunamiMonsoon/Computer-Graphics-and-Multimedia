


// start with standard position
let camera_up = vec4(0,1,0,0);
// let tmpcl = cross(camera_up, camera_forward);
// console.log("================================");
// let camera_left = vec4(cross(camera_up, camera_forward)); //vec4(-1, 0, 0, 0);
let camera_position  = vec4(0,0,0,1);
let camera_forward = vec4(0,0,-1,0);
let camera_left = cross(camera_up, camera_forward);



let dragging = false;

function camera_set_callbacks(canvas, render, refresh=false) {

    canvas.addEventListener("mouseleave",
        function () {
            // console.log("Mouse Exit");
            dragging = false;
        });


    canvas.addEventListener("mousedown",
        function () {
            // console.log("Mouse Down");
            dragging = true;
        });


    canvas.addEventListener("mouseup",
        function () {
            // console.log("Mouse Up");
            dragging = false;
        });


    const scaleUD = .1;
    const scaleLR = .1;

    canvas.addEventListener("mousemove",
        function (event) {
            if (dragging) {
                let angleUD = event.movementY * scaleUD;
                let trUD = rotate(-angleUD, camera_left[0], camera_left[1], camera_left[2]);
                camera_up = mult(trUD, camera_up);
                camera_forward = mult(trUD, camera_forward);
                let angleLR = event.movementX * scaleLR;
                // let trLR = rotate(angleLR, camera_up[0], camera_up[1], camera_up[2]);
                let trLR = rotateY(-angleLR);
                camera_forward = mult(trLR, camera_forward);
                camera_up = mult(trLR, camera_up);
                camera_left = cross(camera_up, camera_forward);

                // console.log("Mouse dragging");
                // object_list[0].translate[0] += event.movementX * scaleX;
                // object_list[0].translate[1] += event.movementY * scaleY;
                // console.log(object_list[0].translate);
                if(refresh)
                    requestAnimationFrame(render);
            }
        });

    let scale_move_FB = .1;
    let scale_move_LR = .1;

    window.addEventListener("keydown",
        function (event) {
            let k = event.key;
            // console.log("event key " + k);
            if (k === 'a') {
                camera_position = add(camera_position, mult(scale_move_LR, camera_left));
            } else if (k === 'd') {
                camera_position = add(camera_position, mult(-scale_move_LR, camera_left))

            } else if (k === 'w') {
                camera_position = add(camera_position, mult(scale_move_FB, camera_forward));

            } else if (k === 's') {
                camera_position = add(camera_position, mult(-scale_move_FB, camera_forward));
            } else if (k === 'ArrowUp') {
                camera_position = add(camera_position, mult(scale_move_LR, camera_up))
            } else if (k === 'ArrowDown') {
                camera_position = add(camera_position, mult(-scale_move_LR, camera_up))
            } else {
                // ignore other keys
            }
            // object_list[0].translate = [camera_position[0],camera_position[1],camera_position[2],];
            if(refresh)
                requestAnimationFrame(render);
        });
}