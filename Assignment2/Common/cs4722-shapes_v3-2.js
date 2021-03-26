
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

    getNormals() {
        let rtval = [];
        const vtx = this.getVertices();
        for(let i = 0; i < vtx.length; i += 3) {
            let a = cross(subtract(vtx[i+1], vtx[i]), subtract(vtx[i+2], vtx[i]));
            let n = normalize(a);
            // let n = vec4(normalize(cross(subtract(vtx[i+1], vtx[i]), subtract(vtx[i+2], vtx[i]))),0);
            // n = negate(n);
            rtval.push(n);
            rtval.push(n);
            rtval.push(n);
        }
        return rtval;
    }

    /*
           Texture map in which each face is the entire same texture image.
        */
    getTextureMap() {

        const t00 = [0,0];
        const t01 = [0,1];
        const t10 = [1,0];
        const t11 = [1,1];

        const tface = [t00, t11, t01, t11, t00, t10];
        const face3 = tface.concat(tface).concat(tface);
        return face3.concat(face3);
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
            this.scheme_colors = [X11.Yellow, X11.SkyBlue ];
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
            return vec4(0, .5, 0,1);
        }

        get bottom_center() {
            return vec4(0, -.5, 0,1);
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
                let yt = this.top_center[1];
                let yb = this.bottom_center[1];
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
                    cpoints.push(vec4(x1t, yt, z1t, 1));
                    cpoints.push(vec4(x0t, yt, z0t, 1));
                    cpoints.push(vec4(x1b, yb, z1b, 1));

                    // cpoints.push(vec4(x1b, yb, z1b, 1));
                    cpoints.push(vec4(x0b, yb, z0b, 1));
                    cpoints.push(vec4(x1b, yb, z1b, 1));
                    cpoints.push(vec4(x0t, yt, z0t, 1));
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
                    cpoints.push(vec4(x1, yt, z1, 1));
                    cpoints.push(vec4(xt, yt, zt, 1));
                    cpoints.push(vec4(x0, yt, z0, 1));
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
                    cpoints.push(vec4(xb, yb, zb, 1));
                    cpoints.push(vec4(x1, yb, z1, 1));
                    cpoints.push(vec4(x0, yb, z0, 1));
                }
                return cpoints;
            }
        };


        getTextureMap() {

            const num_sides = this.sides;
            const divt = .95;
            const divb = .05;

            function bottom() {
                // const radius_bottom = 2 / (this.top_to_bottom_ratio + 1);
                const radius_top = 1;
                let cpoints = [];
                if (num_sides < 3) {
                    // do nothing
                } else {
                    let [xt, , zt] = [.5,0,0];
                    const delta = 2 * Math.PI / num_sides;
                    for (let s = 0; s < num_sides; s++) {
                        const x0 = radius_top * Math.cos(s*delta/4);
                        // const z0 = radius_top * Math.sin(s*delta/4);
                        const x1 = radius_top * Math.cos((s+1)*delta/4);
                        // const z1 = radius_top * Math.sin((s+1)*delta/4);
                        // cpoints.push([xt, yt, zt, 1]);
                        cpoints.push(vec2(x1, divb));
                        cpoints.push(vec2(xt, zt));
                        cpoints.push(vec2(x0, divb));
                    }
                    return cpoints;
                }
            }

            function top() {
                // const radius_bottom = 2 / (this.top_to_bottom_ratio + 1);
                const radius_top = 1;
                let cpoints = [];
                if (num_sides< 3) {
                    // do nothing
                } else {
                    let [xt, , ] = [.5,0,1];
                    const delta = 2 * Math.PI / num_sides;
                    for (let s = 0; s < num_sides; s++) {
                        const x0 = radius_top * Math.cos(s*delta/4);
                        // const z0 = radius_top * Math.sin(s*delta/4);
                        const x1 = radius_top * Math.cos((s+1)*delta/4);
                        // const z1 = radius_top * Math.sin((s+1)*delta/4);
                        // cpoints.push([xt, yt, zt, 1]);
                        cpoints.push(vec2(x1, divt));
                        cpoints.push(vec2(xt, 1));
                        cpoints.push(vec2(x0, divt));
                    }
                    return cpoints;
                }
            }

            function sides() {
                const radius_bottom = 1;
                const radius_top = 1;
                let cpoints = [];
                if (num_sides < 3) {
                    // do nothing
                } else {
                    // let yt = this.top_center[1];
                    // let yb = this.bottom_center[1];
                    const delta = 2 * Math.PI / num_sides / 4;
                    const cd = Math.cos(delta);
                    const sd = Math.sin(delta);
                    let c0 = 1;
                    let s0 = 0;
                    for (let s = 0; s < num_sides; s++) {
                        const c1 = c0 * cd - s0 * sd;
                        // let c1 = Math.cos((s+1)*delta);
                        const s1 = s0 * cd + c0 * sd;
                        // let s1 = Math.sin((s+1)*delta);
                        // console.log("s = " + s);
                        // console.log("angle " + s * delta / Math.PI * 180);
                        // side s, from angle s*2*pi/sides to (s+1)*2*pi/sides
                        const x0t = c0 * radius_top;
                        // const z0t = s0 * radius_top;
                        const x1t = c1 * radius_top;
                        // const z1t = s1 * radius_top;
                        const x0b = c0 * radius_bottom;
                        // const z0b = s0 * radius_bottom;
                        const x1b = c1 * radius_bottom;
                        // const z1b = s1 * radius_bottom;
                        c0 = c1;
                        s0 = s1;
                        // cpoints.push([x0t, yt, z0t, 1]);
                        cpoints.push(vec2(x1t, divt));
                        cpoints.push(vec2(x0t, divt));
                        cpoints.push(vec2(x1b, divb));

                        // cpoints.push(vec4(x1b, yb, z1b, 1));
                        cpoints.push(vec2(x0b, divb));
                        cpoints.push(vec2(x1b, divb));
                        cpoints.push(vec2(x0t, divt));
                    }
                    // var rotmat = rotateX(90);
                    // cpoints = cpoints.map((p) => mult(rotmat,p));
                    return cpoints;

                }


            }

            let uncentered = sides().concat(top()).concat(bottom());
            // let trm = translate(this.center[0], this.center[1], this.center[2]);
            // return uncentered.map(p => mult(trm, p));


            return uncentered.map(p => vec2(p[0],p[1]));

        }

        /*
               Document normals.tex in latex_documents folder holds
               the derivation of the formula used here
            */
        getNormals() {
            let nrm = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let yt = this.top_center[1];
                let yb = this.bottom_center[1];
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
                    const x0t = c0 * this.radius_top;
                    const z0t = s0 * this.radius_top;
                    const x1t = c1 * this.radius_top;
                    const z1t = s1 * this.radius_top;
                    const x0b = c0 * this.radius_bottom;
                    const z0b = s0 * this.radius_bottom;
                    const x1b = c1 * this.radius_bottom;
                    const z1b = s1 * this.radius_bottom;
                    c0 = c1;
                    s0 = s1;

                    let topFactor = -(this.radius_top - this.radius_bottom) / (this.height * this.radius_top);
                    let bottomFactor = -(this.radius_top - this.radius_bottom) / (this.height * this.radius_bottom);
                    // cpoints.push([x1t, yt, z1t, 1]);
                    // cpoints.push([x0t, yt, z0t, 1]);
                    // cpoints.push([x1b, yb, z1b, 1]);
                    nrm.push(vec4(x1t, topFactor*(x1t*x1t+z1t*z1t), z1t, 0));
                    nrm.push(vec4(x0t, topFactor*(x0t*x0t+z0t*z0t), z0t, 0));
                    nrm.push(vec4(x1b, bottomFactor*(x1b*x1b+z1b*z1b), z1b, 0));

                    // cpoints.push(vec4(x0b, yb, z0b, 1));
                    // cpoints.push(vec4(x1b, yb, z1b, 1));
                    // cpoints.push(vec4(x0t, yt, z0t, 1));
                    nrm.push(vec4(x0b, bottomFactor*(x0b*x0b+z0b*z0b), z0b, 0));
                    nrm.push(vec4(x1b, bottomFactor*(x1b*x1b+z1b*z1b), z1b, 0));
                    nrm.push(vec4(x0t, topFactor*(x0t*x0t+z0t*z0t), z0t, 0));
                }

                // nrm.map(v => negate(v));

                // top normals

                for (let s = 0; s < this.sides; s++) {
                    nrm.push(vec4(0, 0, 1, 0));
                    nrm.push(vec4(0, 0, 1, 0));
                    nrm.push(vec4(0, 0, 1, 0));
                }

                // bottom normals
                for (let s = 0; s < this.sides; s++) {
                    nrm.push(vec4(0, 0, -1, 0));
                    nrm.push(vec4(0, 0, -1, 0));
                    nrm.push(vec4(0, 0, -1, 0));
                }

                nrm.map(v => normalize(v));

                return nrm;


            }

        }



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
                let tc = vec4(0, radius, 0,1);
                let bc = vec4(0, -radius, 0,1);
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
                    cpoints.push(vec4(xul,yu,zul,1));
                    cpoints.push(vec4(xur, yu, zur,1));

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

                        cpoints.push(vec4(xur, yu, zur,1));
                        cpoints.push(vec4(xul,yu,zul,1));
                        cpoints.push(vec4(xll, yl, zll,1));

                        cpoints.push(vec4(xur, yu, zur,1));
                        cpoints.push(vec4(xll, yl, zll,1));
                        cpoints.push(vec4(xlr, yl, zlr,1));

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

                    cpoints.push(vec4(xul,yu,zul,1));
                    cpoints.push(bc);
                    cpoints.push(vec4(xur, yu, zur,1));

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

    getNormals() {
        let cpoints = [];
        if (this.sides < 3) {
            // do nothing
        } else {
            let tc = vec4(0, 1, 0,0);
            let bc = vec4(0, -1, 0,0);
            const deltaU = 2 * Math.PI / this.sides;
            const deltaV = Math.PI / (this.bands+2);
            const cdu = Math.cos(deltaU);
            const sdu = Math.sin(deltaU);
            const cdv = Math.cos(deltaV);
            const sdv = Math.sin(deltaV);



            // north pole
            let yu = cdv;
            let rmc = sdv;
            let xul = 0;
            let zul = rmc;
            let xur = rmc * sdu;
            let zur = rmc * cdu;
            for(let s = 0; s < this.sides; s++ ) {
                cpoints.push(tc);
                cpoints.push(vec4(xul,yu,zul,0));
                cpoints.push(vec4(xur, yu, zur,0));

                xul = xur;
                zul = zur;
                xur = xul * cdu + zul * sdu;
                zur = zul * cdu - xul * sdu;
            }


            // sides
            let rmc1 = sdv;
            let yl = (cdv*cdv - sdv*sdv);
            let rmc2 =  2 * sdv * cdv;
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

                    cpoints.push(vec4(xur, yu, zur,0));
                    cpoints.push(vec4(xul,yu,zul,0));
                    cpoints.push(vec4(xll, yl, zll,0));

                    cpoints.push(vec4(xur, yu, zur,0));
                    cpoints.push(vec4(xll, yl, zll,0));
                    cpoints.push(vec4(xlr, yl, zlr,0));


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
            rmc = sdv;
            xul = 0;
            zul = rmc;
            xur = rmc * sdu;
            zur = rmc * cdu;
            for(let s = 0; s < this.sides; s++ ) {

                cpoints.push(vec4(xul,yu,zul,0));
                cpoints.push(bc);
                cpoints.push(vec4(xur, yu, zur,0));

                xul = xur;
                zul = zur;
                xur = xul * cdu + zul * sdu;
                zur = zul * cdu - xul * sdu;
            }


            return cpoints;

        }
    }


    getTextureMap() {

        let coords = [];


        // s is horizontal
        // t is vertical
        //    Divide texture vertically into bands+2 parts
        const db = 1.0 / (this.bands+2);
        // north pole uses t from 1.0-db to 1.0
        // band i (0 at the top) uses
        //      1.0 - (i+2)*db  to  1.0 - (i+1)*db
        // south pole uses t from 0.0 to db
        //
        //  south pole is band number 'bands'
        //    1 - (bands+2)*db = 1 - 1 = 0   ok
        //    1 - (bands+1)*db = 1 - (bands+1)/(bands+2) = 1 - 1 + 1/(bands+2) = db
        //
        // north pole is band number -1
        //    1 - 1*db = 1 -db
        //    1 - 0*db = 1

        const ds = 1.0 / this.sides;

        // north pole
        let tFrom = 1.0 - db;
        let tTo = 1.0;
        for(let s = 0; s < this.sides; s++ ) {
            let sl = 1 - s * ds;
            let sr = sl - ds;
            coords.push([(sr+sl)/2, tTo]);
            coords.push([sl, tFrom]);
            coords.push([sr, tFrom]);
        }

        // sides
        for (let b = 0; b < this.bands; b++) {
            let tFrom = 1.0 - (b+2)*db;
            let tTo = tFrom + db;
            for(let s = 0; s < this.sides; s++ ) {
                let sl = 1 - s * ds;
                let sr = sl - ds;

                coords.push([sr, tTo]);
                coords.push([sl, tTo]);
                coords.push([sl, tFrom]);
                coords.push([sr, tTo]);
                coords.push([sl, tFrom]);
                coords.push([sr, tFrom]);
            }
        }


        // south pole
        tFrom = 0.0;
        tTo = db;
        for(let s = 0; s < this.sides; s++ ) {
            let sl = 1 - s * ds;
            let sr = sl - ds;
            coords.push([sl, tTo]);
            coords.push([(sl+sr)/2, tFrom]);
            coords.push([sr, tTo]);
        }


        return coords;
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

/**
 * This function sets up buffers for selected components of a list of shapes.
 *
 * If a component is used then it is expected that an attribute variable will be provided
 * in the vertex shader with a particular name and type:
 *
 * attribute vec4 color;
 * attribute vec4 normal;
 * attribute vec4 texCoord;
 * attribute vec4 vertex;
 *
 * Shape objects have buffer_start and buffer_size attributes set to indicate where they are
 * located in the buffer.
 *
 *
 * @param shape_list  List of shapes
 * @param gl        Graphics context
 * @param program  Program
 * @param use_colors    Whether to use color scheme or not, default is false
 * @param use_normals   Whether to use normals or not, default is false
 * @param use_textures  Whether to use texture coordinates or not, default is false
 * @param use_vertices  Whether to use vertices or not, default is true
 */
function setup_shape_buffers(shape_list, gl, program, use_colors=false,
                             use_normals=false, use_textures= false,
                             use_vertices = true) {


    // Determine the buffer size
    // keep track of start and finish for each shape.
    let buffer_size = 0;
    for(let shape of shape_list) {
        shape.buffer_start = buffer_size;
        shape.buffer_size = shape.getSize();
        buffer_size += shape.buffer_size;
    }

    // create MVbuffer objects to hold the data
    let normal_list = new MVbuffer(buffer_size * 4);
    let color_list = new MVbuffer(buffer_size * 4);
    let vertex_list = new MVbuffer(buffer_size * 4);
    let texcoord_list = new MVbuffer(buffer_size * 2);

    // create typed arrays with the data
    for(let shape of shape_list) {
        if(use_normals) {
            shape.getNormals().forEach(c => normal_list.push(c));
        }
        if(use_vertices) {
            shape.getVertices().forEach(v => vertex_list.push(v));
        }
        if(use_textures) {
            shape.getTextureMap().forEach(v => texcoord_list.push(v));
        }
        if(use_colors) {
            shape.getColorScheme().forEach(v => color_list.push(v));
        }
    }

    // create the buffers

    if(use_vertices) {
        // create buffers and associate to attributes
        const bufferIdV = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdV);
        gl.bufferData(gl.ARRAY_BUFFER, vertex_list.buf, gl.STATIC_DRAW);
        // associate the vertex buffer with the vertex variable in the vertex shader
        const vertexLoc = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vertexLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexLoc);
    }

    if(use_normals) {
        const bufferIdN = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdN );
        gl.bufferData(gl.ARRAY_BUFFER, normal_list.buf, gl.STATIC_DRAW);
        // associate the normal buffer with the normal variable in the vertex shader
        const normalLoc = gl.getAttribLocation(program, "normal");
        gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);
    }

    if(use_textures) {
        const bufferIdT = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdT);
        gl.bufferData(gl.ARRAY_BUFFER, texcoord_list.buf, gl.STATIC_DRAW);
        const textureLoc = gl.getAttribLocation(program, "texCoord");
        gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(textureLoc);
    }

    if(use_colors) {
        const bufferIdC = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC);
        gl.bufferData(gl.ARRAY_BUFFER, color_list.buf, gl.STATIC_DRAW);
        const colorLoc = gl.getAttribLocation(program, "color");
        gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLoc);
    }

    // return buffer_size;
}






