
// just vertices and colors

const cs4722_Shapes = {
    Base: class {

        constructor() {
            // this.buffer_start = 0;
            // this.buffer_size = 0;
        }

        getDrawingMode() {
            return WebGLRenderingContext.TRIANGLES;
        }


    }
};

cs4722_Shapes.Block = class extends cs4722_Shapes.Base {

    constructor() {
        super();
        // this.center = [0, 0, 0];
        this.scheme_colors = [
            X11.Red,
            X11.Yellow,
            X11.Green,
            X11.Blue,
            X11.Magenta,
            X11.Cyan,
        ];
        // this.translate = [0,0,0];

    }



    /**
     * The number of points used to represent this object.
     */
    getSize() {
        return 36;
    }


    getVertices() {
        let height = 1, width = 1, depth = 1;
        let lbf = vec4( -width/2, -height/2,  depth/2, 1.0 );
        let ltf = vec4( -width/2,  height/2,  depth/2, 1.0 );
        let rtf = vec4( width/2,  height/2,  depth/2, 1.0 );
        let rbf = vec4( width/2, -height/2,  depth/2, 1.0 );
        let lbb = vec4( -width/2, -height/2, -depth/2, 1.0 );
        let ltb = vec4( -width/2,  height/2, -depth/2, 1.0 );
        let rtb = vec4( width/2,  height/2, -depth/2, 1.0 );
        let rbb = vec4( width/2, -height/2, -depth/2, 1.0 );
        

        const top =  [ltf, rtb, ltb, rtb, ltf, rtf];
        // const top = [];
        const front =  [lbf, rtf, ltf,  rtf, lbf, rbf];
        // const front = [];
        const bottom = [lbf, rbb, rbf, rbb, lbf, lbb];
        // const bottom = [];
        const back = [rtb, lbb, ltb, lbb, rtb, rbb];
        // const back = [ltb, lbb, rtb, lbb, rtb, rbb];
        // const back = [];
        const left = [ltf, lbb, lbf, lbb, ltf, ltb];
        // const left = [];
        const right = [rbb,rtf,rbf,  rtf,rbb,rtb];


        // red,  yellow  green,   blue,  magenta   cyan
        // top   front   bottom   back   left      right
        let cpoints =  top.concat(front).concat(bottom).concat(back).concat(left).concat(right);
        return cpoints.map(p => vec4(p[0],p[1], p[2], 1));
    }


    getColorScheme() {
        let colorsArray = [];
        for(let a = 0; a < 6; a++ ) {
            colorsArray.push(this.scheme_colors[a]);
            colorsArray.push(this.scheme_colors[a]);
            colorsArray.push(this.scheme_colors[a]);
            colorsArray.push(this.scheme_colors[a]);
            colorsArray.push(this.scheme_colors[a]);
            colorsArray.push(this.scheme_colors[a]);
        }
        return colorsArray;
    }




};


    cs4722_Shapes.Cylinder = class  extends cs4722_Shapes.Base {

        constructor(top_to_bottom_ratio=1, sides = 20) {
            super();
            // lg.log("cylinder sides: " + sides);
            this.sides = sides;
            this.top_to_bottom_ratio = top_to_bottom_ratio;
            //  (b + rb)/2 = 1
            //  b(1+r) = 2
            // b = 2/(1+r)   t = 2r/(1+r)
            // this.radius_bottom = 1;
            // this.radius_top = 1;
            // this.height = 1;
            this.scheme_colors = [X11.Cyan, X11.Magenta];
        }

        /**
         * The number of points used to represent this object.
         * Only use after this.sides has been set properly.
         */
        getSize() {
            return 12 * this.sides;
        }

        get top_center() {
            // return [this.center[0], this.center[1] + this.height / 2, this.center[2]];
            return [0, .5, 0];
        }

        get bottom_center() {
            return [0, -.5, 0];
            // return [this.center[0], this.center[1] - this.height / 2, this.center[2]];
        };

        getVertices() {
            let uncentered = this.points_sides.concat(this.points_top).concat(this.points_bottom);
            // let trm = translate(this.center[0], this.center[1], this.center[2]);
            // return uncentered.map(p => mult(trm, p));


            return uncentered.map(p => vec4(p[0],p[1],p[2],1));

        }

        get points_sides() {
            const radius_bottom = 2 / (this.top_to_bottom_ratio + 1);
            const radius_top = this.top_to_bottom_ratio * radius_bottom;
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let [, yt,] = this.top_center;
                let [, yb,] = this.bottom_center;
                const delta = 2 * Math.PI / this.sides;
                const cd = Math.cos(delta);
                const sd = Math.sin(delta);
                let c0 = 1;
                let s0 = 0;
                for (let s = 0; s < this.sides; s++) {
                    const c1 = c0 * cd - s0 * sd;
                    // let c1 = Math.cos((s+1)*delta);
                    const s1 = s0 * cd + c0 * sd;
                    // let s1 = Math.sin((s+1)*delta);
                    // console.log("s = " + s);
                    // console.log("angle " + s * delta / Math.PI * 180);
                    // side s, from angle s*2*pi/sides to (s+1)*2*pi/sides
                    const x0t = c0 * radius_top;
                    const z0t = s0 * radius_top;
                    const x1t = c1 * radius_top;
                    const z1t = s1 * radius_top;
                    const x0b = c0 * radius_bottom;
                    const z0b = s0 * radius_bottom;
                    const x1b = c1 * radius_bottom;
                    const z1b = s1 * radius_bottom;
                    c0 = c1;
                    s0 = s1;
                    // cpoints.push([x0t, yt, z0t, 1]);
                    cpoints.push([x1t, yt, z1t, 1]);
                    cpoints.push([x0t, yt, z0t, 1]);
                    cpoints.push([x1b, yb, z1b, 1]);

                    // cpoints.push([x1b, yb, z1b, 1]);
                    cpoints.push([x0b, yb, z0b, 1]);
                    cpoints.push([x1b, yb, z1b, 1]);
                    cpoints.push([x0t, yt, z0t, 1]);
                }
                // var rotmat = rotateX(90);
                // cpoints = cpoints.map((p) => mult(rotmat,p));
                return cpoints;

            }
        };

        get points_top() {
            // const radius_bottom = 2 / (this.top_to_bottom_ratio + 1);
            const radius_top = this.top_to_bottom_ratio * 2 / (this.top_to_bottom_ratio + 1);
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let [xt, yt, zt] = this.top_center;
                const delta = 2 * Math.PI / this.sides;
                for (let s = 0; s < this.sides; s++) {
                    const x0 = radius_top * Math.cos(s*delta);
                    const z0 = radius_top * Math.sin(s*delta);
                    const x1 = radius_top * Math.cos((s+1)*delta);
                    const z1 = radius_top * Math.sin((s+1)*delta);
                    // cpoints.push([xt, yt, zt, 1]);
                    cpoints.push([x1, yt, z1, 1]);
                    cpoints.push([xt, yt, zt, 1]);
                    cpoints.push([x0, yt, z0, 1]);
                }
                return cpoints;
            }
        };

        get points_bottom() {
            const radius_bottom = 2 / (this.top_to_bottom_ratio + 1);
            // const radius_top = this.top_to_bottom_ratio * radius_bottom;
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let [xb, yb, zb] = this.bottom_center;
                const delta = 2 * Math.PI / this.sides;
                for (let s = 0; s < this.sides; s++) {
                    const x0 = radius_bottom * Math.cos(s*delta);
                    const z0 = radius_bottom * Math.sin(s*delta);
                    const x1 = radius_bottom * Math.cos((s+1)*delta);
                    const z1 = radius_bottom * Math.sin((s+1)*delta);
                    // cpoints.push([x1, yb, z1, 1]);
                    cpoints.push([xb, yb, zb, 1]);
                    cpoints.push([x1, yb, z1, 1]);
                    cpoints.push([x0, yb, z0, 1]);
                }
                return cpoints;
            }
        };


        getColorScheme() {
            const color1 = this.scheme_colors[0];
            const color2 = this.scheme_colors[1];
            return this.color_scheme_sides(color1, color2).
            concat(this.color_scheme_top_bottom(color1, color2)).
            concat(this.color_scheme_top_bottom(color1,color2));
        }


        color_scheme_sides(color1, color2) {
            let colors = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                for (let s = 0; s < this.sides; s++) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color2);
                    colors.push(color2);
                    colors.push(color2);
                }
                return colors;
            }
        }


        color_scheme_top_bottom(color1, color2) {
            let colors = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                for (let s = 0; s < this.sides; s += 2) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color2);
                    colors.push(color2);
                    colors.push(color2);
                }
                return colors;
            }
        }








    };

   // cs4722_Shapes.Block = class extends cs4722_Shapes.BlockBase {
   //
   //
   //  },



cs4722_Shapes.Sphere =  class extends cs4722_Shapes.Base {



        constructor(bands = 5, sides = 22) {
            super();
            this.sides = sides;
            this.bands = bands;
            this.scheme_colors = [X11.SlateBlue1, X11.SlateBlue3];
            // this.translate = [0,0,0];
            // console.log("material");
            // console.log(this.material);
        }



        /**
         * The number of points used to represent this object.
         * Only use after this.sides and this.bands have been set properly.
         */
        getSize() {
            return 6 * this.sides + 6 * this.sides * this.bands;
        }




        getVertices() {
            const radius = 1;
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let tc = [0, radius, 0,1];
                let bc = [0, -radius, 0,1];
                const deltaU = 2 * Math.PI / this.sides;
                const deltaV = Math.PI / (this.bands+2);
                const cdu = Math.cos(deltaU);
                const sdu = Math.sin(deltaU);
                const cdv = Math.cos(deltaV);
                const sdv = Math.sin(deltaV);



                // north pole
                let yu = radius * cdv;
                let rmc = radius * sdv;
                let xul = 0;
                let zul = rmc;
                let xur = rmc * sdu;
                let zur = rmc * cdu;
                for(let s = 0; s < this.sides; s++ ) {

                    cpoints.push(tc);
                    cpoints.push([xul,yu,zul,1]);
                    cpoints.push([xur, yu, zur,1]);

                    xul = xur;
                    zul = zur;
                    xur = xul * cdu + zul * sdu;
                    zur = zul * cdu - xul * sdu;
                }


                // sides
                let rmc1 = radius * sdv;
                let yl = radius * (cdv*cdv - sdv*sdv);
                let rmc2 = radius * 2 * sdv * cdv;
                for (let b = 0; b < this.bands; b++) {
                    let xul = 0;
                    let zul = rmc1;
                    let xll = 0;
                    let zll = rmc2;

                    let xur = rmc1 * sdu;
                    let zur = rmc1 * cdu;
                    let xlr = rmc2 * sdu;
                    let zlr = rmc2 * cdu;
                    for(let s = 0; s < this.sides; s++ ) {

                        cpoints.push([xur, yu, zur,1]);
                        cpoints.push([xul,yu,zul,1]);
                        cpoints.push([xll, yl, zll,1]);

                        cpoints.push([xur, yu, zur,1]);
                        cpoints.push([xll, yl, zll,1]);
                        cpoints.push([xlr, yl, zlr,1]);

                        xul = xur;
                        zul = zur;
                        xur = xul * cdu + zul * sdu;
                        zur = zul * cdu - xul * sdu;
                        xll = xlr;
                        zll = zlr;
                        xlr = xll * cdu + zll * sdu;
                        zlr = zll * cdu - xll * sdu;
                    }
                    yu = yl;
                    yl = yu * cdv - rmc2 * sdv;
                    rmc1 = rmc2;
                    rmc2 = rmc1*cdv + yu*sdv;
                }


                // south pole
                rmc = radius * sdv;
                xul = 0;
                zul = rmc;
                xur = rmc * sdu;
                zur = rmc * cdu;
                for(let s = 0; s < this.sides; s++ ) {

                    cpoints.push([xul,yu,zul,1]);
                    cpoints.push(bc);
                    cpoints.push([xur, yu, zur,1]);

                    xul = xur;
                    zul = zur;
                    xur = xul * cdu + zul * sdu;
                    zur = zul * cdu - xul * sdu;
                }

                // return cpoints.map(p => vec4(...p));
                return cpoints.map(p => vec4(p[0],p[1],p[2],1));

                // let trm = translate(this.center[0], this.center[1], this.center[2]);
                // return cpoints.map(p => mult(trm, p));

            }
        }


       getColorScheme() {
            // lg.log("in color scheme");
            let color1 = this.scheme_colors[0];
            let color2 = this.scheme_colors[1];
            let colors = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                for (let b = 0; b < this.bands; b++) {
                    for(let s = 0; s < this.sides; s++ ) {
                        colors.push(color1);
                        colors.push(color1);
                        colors.push(color1);

                        let c2 = color2;
                        colors.push(c2);
                        colors.push(c2);
                        colors.push(c2);
                    }
                }
                // top colors
                for(let n = 0; n < this.sides/2; n++ ) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);

                    let c2 = color2;
                    colors.push(c2);
                    colors.push(c2);
                    colors.push(c2);
                }
                if(this.sides % 2 === 1) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);
                }
                // bottom colors
                for(let n = 0; n < this.sides/2; n++ ) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);

                    let c2 = color2;
                    colors.push(c2);
                    colors.push(c2);
                    colors.push(c2);
                }
                if(this.sides % 2 === 1) {
                    colors.push(color1);
                    colors.push(color1);
                    colors.push(color1);
                }

                return colors;
            }
        }
};

function setup_shape_buffers(shape_list, gl, program) {

    // build the buffers
    // first create typed arrays with the data

    // Determine the buffer size
    // keep track of start and finish for each shape.
    let buffer_size = 0;
    for(let shape of shape_list) {
        shape.buffer_start = buffer_size;
        shape.buffer_size = shape.getSize();
        buffer_size += shape.buffer_size;
    }

    // create typed arrays with the data
    let color_list = new MVbuffer(buffer_size * 4);
    let vertex_list = new MVbuffer(buffer_size * 4);
    for(let shape of shape_list) {
        shape.getColorScheme().forEach(c => color_list.push(c));
        shape.getVertices().forEach(v => vertex_list.push(v));
    }

    // create buffers and associate to attributes
    const bufferIdV = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdV );
    gl.bufferData(gl.ARRAY_BUFFER, vertex_list.buf, gl.STATIC_DRAW);
    // associate the vertex buffer with the vertex variable in the vertex shader
    const vertexLoc = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vertexLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoc);

    const bufferIdC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData(gl.ARRAY_BUFFER, color_list.buf, gl.STATIC_DRAW);
    // associate the color buffer with the color variable in the vertex shader
    const colorLoc = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


}






