

class cs4722_camera {

    constructor() {
        this.camera_position = vec3(0, 0, 0);
        this.camera_at = vec3(0,0,-1);
        this.camera_up = vec3(0,1,0);
        this.do_logging = false;
    }

    setup_callbacks(canvas, render) {

        const scaleUD = 1;
        const scaleLR = 1;

        const camera = this;

        if(camera.do_logging) {
            console.log("pos, at, up");
            console.log(camera.camera_position);
            console.log(camera.camera_at);
            console.log(camera.camera_up);
        }

            canvas.addEventListener("mousemove",
            function(event) {
                if(event.buttons) {
                    // we need vectors point forward (from camera to 'at') and
                    // left to compute the changes to the camera.
                    let camera_forward = subtract(camera.camera_at, camera.camera_position);
                    let camera_left = cross(camera.camera_up, camera_forward);

                    // The angle to move up or down is based on the movement of the mouse
                    // in the y direction.
                    // movementY is the amount moved since the last mouse event.
                    let angleUD = event.movementY * scaleUD;

                    // a rotation around the left axis of the camera will be applied to the
                    // forward direction.
                    // let trUD = rotate(angleUD, camera_left[0],camera_left[1],camera_left[2]);
                    let trUD = mat3(rotate(angleUD, camera_left));


                    // camera.is what  the up/down movement would do to camera forward.
                    let camera_forward2 = mult(trUD, camera_forward);

                    // do not do this up-down rotation if this would bring the forward and
                    // up directions too close to  each other.
                    if(length(cross(camera_forward2, camera.camera_up)) > .2) {
                        camera_forward = camera_forward2;
                    }
                    // the up/down motion will not change the camera up.
                    // this looks more intuitive to me when actually using the mouse to pan.

                    // similarly, the left right is a rotation about the camera up
                    let angleLR = event.movementX * scaleLR;
                    let trLR = mat3(rotate(angleLR, camera.camera_up));

                    // rotate camera forward and then compute camera at from that.
                    camera_forward = mult(trLR, camera_forward);
                    camera.camera_at = add(camera_forward, camera.camera_position);

                    if(camera.do_logging) {
                        console.log("pos, at, up");
                        console.log(camera.camera_position);
                        console.log(camera.camera_at);
                        console.log(camera.camera_up);
                    }

                    if(render)
                        requestAnimationFrame(render);
                }
            });



        let scale_move_FB = .2;
        let scale_move_LR = .2;
        let scale_move_UD = .2;

        window.addEventListener("keydown",
            function(event){
                let running = event.shiftKey ? 1.5 : 1.0;
                let k = event.key;
                // console.log("event key " + k);
                let camera_forward = subtract(camera.camera_at, camera.camera_position);
                if(k === 'a') {
                    let x = cross(camera.camera_up, camera_forward);
                    let camera_left = normalize(x);
                    let move = mult(running*scale_move_LR, camera_left)
                    camera.camera_position = add(camera.camera_position, move);
                    camera.camera_at = add(camera.camera_at, move);
                } else if(k === 'd') {
                    let x = cross(camera.camera_up, camera_forward);
                    let camera_left = normalize(x);
                    let move = mult(running*scale_move_LR, camera_left);
                    camera.camera_position = subtract(camera.camera_position, move);
                    camera.camera_at = subtract(camera.camera_at, move);

                } else if(k === 'w') {
                    let camera_forward2 = normalize(camera_forward);
                    let move = mult(running*scale_move_FB, camera_forward2);
                    camera.camera_position = add(camera.camera_position, move);
                    camera.camera_at = add(camera.camera_at, move);
                } else if(k === 's') {
                    let camera_forward2 = normalize(camera_forward);
                    let move = mult(running*scale_move_FB, camera_forward2);
                    camera.camera_position = subtract(camera.camera_position, move);
                    camera.camera_at = subtract(camera.camera_at, move);
                } else if(k === 'r') {
                    let move = mult(running*scale_move_UD, normalize(camera.camera_up));
                    camera.camera_position = add(camera.camera_position, move);
                    camera.camera_at = add(camera.camera_at, move);
                } else if(k === 'f') {
                    let move = mult(running*scale_move_UD, normalize(camera.camera_up));
                    camera.camera_position = subtract(camera.camera_position, move);
                    camera.camera_at = subtract(camera.camera_at, move);
                } else {
                    // ignore other keys
                }

                // console.log(`do logging ${camera.do_logging}`);

                if(camera.do_logging) {
                    console.log("pos, at, up");
                    console.log(camera.camera_position);
                    console.log(camera.camera_at);
                    console.log(camera.camera_up);
                }

                // event.stopPropagation();
                if(render)
                    requestAnimationFrame(render);
            });


    }


    get_view_transform() {
        return lookAt(this.camera_position, this.camera_at, this.camera_up);
    }

}