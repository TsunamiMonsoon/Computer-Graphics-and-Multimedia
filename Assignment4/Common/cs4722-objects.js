
// import X11 from './cs4722_x11_colors-module.js'
// import {Tuple, Transform} from './cs4722_mathematics-module.js';

const cs4722_Objects = {
Base: class {

    constructor() {
        this.buffer_start = 0;
        this.buffer_size = 0;
        this.translate = [0,0,0];
        this.scale = [1,1,1];
        this.rotate = [0,0,0];
        this.center  = [0,0,0,1];
        this.transformCenter = null;
        this.visible = true;
        this.material = {ambient:X11.Gray, specular:X11.Gray, diffuse:X11.Gray,
                            shininess: 20};
        this.parentObject = null;
    }

    get drawing_mode() {
        return WebGLRenderingContext.TRIANGLES;
    }

    transform() {
        let tc = this.transformCenter;
        if(tc == null) {
            tc = this.center;
        }
        let objTr = Transform.scaleRotateTranslate(this.scale, this.rotate, this.translate);
        let tr = Transform.translate(...Tuple.negate(tc))
            .andThen(objTr)
            .andThen(Transform.translate(...tc));
        if(this.parentObject != null) {
            // console.log("parentObject");
            // console.log(this.parentObject);
            let ptr = this.parentObject.transform();
            // console.log("ptr");
            // console.log(ptr);
            // console.log("tr");
            // console.log(tr);
            tr = tr.andThen(ptr);
            // console.log("andthen");
            // console.log(tr);
        }
        return tr;
    }

    normal_transform() {
        // if(!center) {
        //     center = this.center;
        // }
        let sc = this.scale.map(x => 1/x);
        let tr = [0,0,0];
        let objTr = Transform.scaleRotateTranslate(sc, this.rotate, tr);
        // return Transform.translate(...Tuple.negate(center))
        //     .andThen(objTr)
        //     .andThen(Transform.translate(...center));
        if(this.parentObject != null) {
            tr = objTr.andThen(this.parentObject.normal_transform());
        }
        return objTr;
    }
},

BlockBase: class extends cs4722_Objects.Base {

    constructor() {
        super();
        this.height = 1;
        this.width = 1;
        this.depth = 1;
        // this.center = [0, 0, 0];
        this.scheme_colors = [
            Tuple.vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
            Tuple.vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
            Tuple.vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
            Tuple.vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
            Tuple.vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
            Tuple.vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
        ];
        // this.translate = [0,0,0];

    }



    /**
     * The number of points used to represent this object.
     */
    get size() {
        return 36;
    }


    get vertices() {
        let lbf = Tuple.vec4( -this.width/2, -this.height/2,  this.depth/2, 1.0 );
        let ltf = Tuple.vec4( -this.width/2,  this.height/2,  this.depth/2, 1.0 );
        let rtf = Tuple.vec4( this.width/2,  this.height/2,  this.depth/2, 1.0 );
        let rbf = Tuple.vec4( this.width/2, -this.height/2,  this.depth/2, 1.0 );
        let lbb = Tuple.vec4( -this.width/2, -this.height/2, -this.depth/2, 1.0 );
        let ltb = Tuple.vec4( -this.width/2,  this.height/2, -this.depth/2, 1.0 );
        let rtb = Tuple.vec4( this.width/2,  this.height/2, -this.depth/2, 1.0 );
        let rbb = Tuple.vec4( this.width/2, -this.height/2, -this.depth/2, 1.0 );

        let c4 = Tuple.vec4(this.center,0);

        // lbf = Tuple.add(lbf,c4);
        // ltf = Tuple.add(ltf,c4);
        // rtf = Tuple.add(rtf,c4);
        // rbf = Tuple.add(rbf,c4);
        // lbb = Tuple.add(lbb,c4);
        // ltb = Tuple.add(ltb,c4);
        // rtb = Tuple.add(rtb,c4);
        // rbb = Tuple.add(rbb,c4);



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
        return cpoints.map(p => [p[0]+this.center[0],
            p[1]+this.center[1],p[2]+this.center[2],1]);
    }

    /*
        Texture map in which each face is the entire same texture image.
     */
    get texture_map1() {

        const t00 = [0,0];
        const t01 = [0,1];
        const t10 = [1,0];
        const t11 = [1,1];

        const tface = [t00, t11, t01, t11, t00, t10];
        const face3 = tface.concat(tface).concat(tface);
        return face3.concat(face3);
    }

    /*
        Texture map in which each face is double sized.
     */
    get texture_map2() {

        const t00 = [0,0];
        const t01 = [0,2];
        const t10 = [2,0];
        const t11 = [2,2];

        const tface = [t00, t11, t01, t11, t00, t10];
        const face3 = tface.concat(tface).concat(tface);
        return face3.concat(face3);
    }

    /*
        Texture map in which each face is double sized, but main area is centered
     */
    get texture_map3() {

        const t00 = [-.5,-.5];
        const t01 = [-.5,1.5];
        const t10 = [1.5,-.5];
        const t11 = [1.5,1.5];

        const tface = [t00, t11, t01, t11, t00, t10];
        const face3 = tface.concat(tface).concat(tface);
        return face3.concat(face3);
    }

    /*
        Texture map with different faces holding different parts of an image
     */
    get texture_map4() {
        const t00 = [0,0,0,1];
        const t01 = [0,1,0,1];
        const t10 = [1,0,0,1];
        const t11 = [1,1,0,1];

        // top   front   bottom   back   left   right
        const tfTop = [t00, t11, t01, t11, t00, t10].map(p => scale(.5, p));
        const tfFront = tfTop.map(p => mult(translate(.5, 0), p));
        const tfBottom = tfTop.map(p => mult(translate(.5, .5), p));
        const tfBack = tfFront;
        const tfLeft = tfTop.map(p => mult(translate(0, .5), p));
        const tfRight = tfLeft;
        const tfAll = tfTop.concat(tfFront.concat(tfBottom.concat(tfBack.concat(tfLeft.concat(tfRight)))));
        return tfAll.map(p => [p[0], p[1]]);
    }

    get normals() {
        let rtval = [];
        const vtx = this.vertices;
        for(let i = 0; i < vtx.length; i += 3) {
            let a = Tuple.cross(Tuple.subtract(vtx[i+1], vtx[i]), Tuple.subtract(vtx[i+2], vtx[i]));
            let n = Tuple.normalized(a);
            // let n = vec4(normalize(cross(subtract(vtx[i+1], vtx[i]), subtract(vtx[i+2], vtx[i]))),0);
            // n = negate(n);
            rtval.push(n);
            rtval.push(n);
            rtval.push(n);
        }
        return rtval;
    }


    get color_scheme() {
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




    color_shading(color = [0, 1, 1, 1]) {
        let colorsArray = [];
        for(let i = 0; i < 36; i++ ) {
            colorsArray.push(color);
        }
        return colorsArray;
    }


},




    Ground: class extends cs4722_Objects.BlockBase {
        constructor() {
            super();
            this.height = .1;
            this.width = 1;
            this.depth = 1;

            this.scheme_colors = [
                X11.SeaGreen1, X11.SeaGreen2, X11.SeaGreen3, X11.SeaGreen4
            ];
        }



        // const top =  [ltf, rtb, ltb, rtb, ltf, rtf];
        // const front =  [lbf, rtf, ltf,  rtf, lbf, rbf];
        // const bottom = [lbf, rbb, rbf, rbb, lbf, lbb];
        // const back = [rtb, lbb, ltb, lbb, rtb, rbb];
        // const left = [ltf, lbb, lbf, lbb, ltf, ltb];
        // const right = [rbb,rtf,rbf,  rtf,rbb,rtb];


        get color_scheme() {
            let colorsArray = [];
            for(let a = 0; a < 6; a++ ) {
                colorsArray.push(this.scheme_colors[0]);
                colorsArray.push(this.scheme_colors[1]);
                colorsArray.push(this.scheme_colors[2]);
                colorsArray.push(this.scheme_colors[1]);
                colorsArray.push(this.scheme_colors[0]);
                colorsArray.push(this.scheme_colors[3]);
            }
            return colorsArray;
        }

    },

    Frame: class extends Base {
        constructor() {
            super();
            this.vi = [1,0,0,0];
            this.vj = [0,1,0,0];
            this.vk = [0,0,1,0];
            this.length = .9;
            this.scheme_colors = [X11.Cyan, X11.Yellow, X11.Magenta];
        }


        get drawing_mode() {
            return WebGLRenderingContext.LINES;
        }

        get vertices() {
            let c = this.center;
            let endI = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vi)));
            let endJ = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vj)));
            let endK = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vk)));
            return [c, endI, c, endJ, c, endK];
        }


        get color_scheme() {
            return [this.scheme_colors[0],this.scheme_colors[0],this.scheme_colors[1],
                this.scheme_colors[1],this.scheme_colors[2],this.scheme_colors[2],]
        }


        get size() {
            return 6;
        }

    },

    FramePoints: class extends cs4722_Objects.Base {
        constructor() {
            super();
            this.vi = [1,0,0,0];
            this.vj = [0,1,0,0];
            this.vk = [0,0,1,0];
            this.length = .9;
            this.scheme_colors = [X11.Cyan, X11.Yellow, X11.Magenta];
        }


        get drawing_mode() {
            return WebGLRenderingContext.POINTS;
        }

        get vertices() {
            let c = this.center;
            let endI = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vi)));
            let endJ = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vj)));
            let endK = Tuple.add(c, Tuple.scale(this.length, Tuple.normalized(this.vk)));
            return [endI, endJ, endK];
        }


        get color_scheme() {
            return [this.scheme_colors[0], this.scheme_colors[1],
               this.scheme_colors[2],]
        }


        get size() {
            return 3;
        }

    },

    //
    // Axes: class extends Base{
    //
    //     constructor() {
    //         super();
    //     }
    //
    //     get drawing_mode() {
    //         return WebGLRenderingContext.LINES;
    //     }
    //
    //
    //     get size() {
    //         return 6;
    //     }
    //
    //     get vertices() {
    //         let vertices = [];
    //         vertices.push([0,0,0,1]);
    //         vertices.push([.9,0,0,1]);
    //         vertices.push([0,0,0,1]);
    //         vertices.push([0,.9,0,1]);
    //         vertices.push([0,0,0,1]);
    //         vertices.push([0,0,.9,1]);
    //         return vertices;
    //     }
    //
    //     get color_scheme() {
    //         let colors = [];
    //         colors.push(X11.Red);
    //         colors.push(X11.Red);
    //         colors.push(X11.Green);
    //         colors.push(X11.Green);
    //         colors.push(X11.Blue);
    //         colors.push(X11.Blue);
    //         return colors;
    //
    //     }
    //
    // },


    Cylinder: class  extends cs4722_Objects.Base {

        constructor(sides = 20) {
            super();
            // lg.log("cylinder sides: " + sides);
            this.sides = sides;
            this.height = 1;
            this.radius_top = 1;
            this.radius_bottom = 1;
            // this.scheme_colors = [[0, 1, 1, 1],[1, 0, 1, 1]];
            this.scheme_colors = [X11.Cyan, X11.Magenta];
            // this.center = [0, 0, 0];
            // this.translate = [0,0,0];
        }

        /**
         * The number of points used to represent this object.
         * Only use after this.sides has been set properly.
         */
        get size() {
            return 12 * this.sides;
        }

        get top_center() {
            // return [this.center[0], this.center[1] + this.height / 2, this.center[2]];
            return [0, this.height/2, 0];
        }

        get bottom_center() {
            return [0, -this.height/2, 0];
            // return [this.center[0], this.center[1] - this.height / 2, this.center[2]];
        };

        get vertices() {
            let uncentered = this.points_sides.concat(this.points_top).concat(this.points_bottom);
            // let trm = translate(this.center[0], this.center[1], this.center[2]);
            // return uncentered.map(p => mult(trm, p));


            return uncentered.map(p => [p[0]+this.center[0],
                p[1]+this.center[1],p[2]+this.center[2],1]);

        }

        get points_sides() {
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
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let [xt, yt, zt] = this.top_center;
                const delta = 2 * Math.PI / this.sides;
                for (let s = 0; s < this.sides; s++) {
                    const x0 = this.radius_top * Math.cos(s*delta);
                    const z0 = this.radius_top * Math.sin(s*delta);
                    const x1 = this.radius_top * Math.cos((s+1)*delta);
                    const z1 = this.radius_top * Math.sin((s+1)*delta);
                    // cpoints.push([xt, yt, zt, 1]);
                    cpoints.push([x1, yt, z1, 1]);
                    cpoints.push([xt, yt, zt, 1]);
                    cpoints.push([x0, yt, z0, 1]);
                }
                return cpoints;
            }
        };

        get points_bottom() {
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let [xb, yb, zb] = this.bottom_center;
                const delta = 2 * Math.PI / this.sides;
                for (let s = 0; s < this.sides; s++) {
                    const x0 = this.radius_bottom * Math.cos(s*delta);
                    const z0 = this.radius_bottom * Math.sin(s*delta);
                    const x1 = this.radius_bottom * Math.cos((s+1)*delta);
                    const z1 = this.radius_bottom * Math.sin((s+1)*delta);
                    // cpoints.push([x1, yb, z1, 1]);
                    cpoints.push([xb, yb, zb, 1]);
                    cpoints.push([x1, yb, z1, 1]);
                    cpoints.push([x0, yb, z0, 1]);
                }
                return cpoints;
            }
        };


        get color_scheme() {
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


        /*
            Document normals.tex in latex_documents folder holds
            the derivation of the formula used here
         */
        get normals() {
            let nrm = [];
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
                    nrm.push([x1t, topFactor*(x1t*x1t+z1t*z1t), z1t, 0]);
                    nrm.push([x0t, topFactor*(x0t*x0t+z0t*z0t), z0t, 0]);
                    nrm.push([x1b, bottomFactor*(x1b*x1b+z1b*z1b), z1b, 0]);

                    // cpoints.push([x0b, yb, z0b, 1]);
                    // cpoints.push([x1b, yb, z1b, 1]);
                    // cpoints.push([x0t, yt, z0t, 1]);
                    nrm.push([x0b, bottomFactor*(x0b*x0b+z0b*z0b), z0b, 0]);
                    nrm.push([x1b, bottomFactor*(x1b*x1b+z1b*z1b), z1b, 0]);
                    nrm.push([x0t, topFactor*(x0t*x0t+z0t*z0t), z0t, 0]);
                }

                // nrm.map(v => negate(v));

                // top normals

                for (let s = 0; s < this.sides; s++) {
                    nrm.push([0, 0, 1, 0]);
                    nrm.push([0, 0, 1, 0]);
                    nrm.push([0, 0, 1, 0]);
                }

                // bottom normals
                for (let s = 0; s < this.sides; s++) {
                    nrm.push([0, 0, -1, 0]);
                    nrm.push([0, 0, -1, 0]);
                    nrm.push([0, 0, -1, 0]);
                }

                nrm.map(v => Tuple.normalized(v));

                return nrm;


            }

        }





    },

    Block: class extends cs4722_Objects.BlockBase {



    },


    Sphere: class extends cs4722_Objects.Base {



        constructor(bands = 5, sides = 22) {
            super();
            this.sides = sides;
            this.bands = bands;
            this.radius = 1;
            // this.center = [0, 0, 0];
            this.scheme_colors = [[0, 1, 1, 1],[1, 0, 1, 1]];
            // this.translate = [0,0,0];
            // console.log("material");
            // console.log(this.material);
        }



        /**
         * The number of points used to represent this object.
         * Only use after this.sides and this.bands have been set properly.
         */
        get size() {
            return 6 * this.sides + 6 * this.sides * this.bands;
        }




        get vertices() {
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let tc = [0, this.radius, 0,1];
                let bc = [0, -this.radius, 0,1];
                const deltaU = 2 * Math.PI / this.sides;
                const deltaV = Math.PI / (this.bands+2);
                const cdu = Math.cos(deltaU);
                const sdu = Math.sin(deltaU);
                const cdv = Math.cos(deltaV);
                const sdv = Math.sin(deltaV);



                // north pole
                let yu = this.radius * cdv;
                let rmc = this.radius * sdv;
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
                let rmc1 = this.radius * sdv;
                let yl = this.radius * (cdv*cdv - sdv*sdv);
                let rmc2 = this.radius * 2 * sdv * cdv;
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
                rmc = this.radius * sdv;
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


                return cpoints.map(p => [p[0]+this.center[0],
                    p[1]+this.center[1],p[2]+this.center[2],1]);

                // let trm = translate(this.center[0], this.center[1], this.center[2]);
                // return cpoints.map(p => mult(trm, p));

            }
        }

        get texture_map() {

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

        get normals() {
            let cpoints = [];
            if (this.sides < 3) {
                // do nothing
            } else {
                let tc = [0, 1, 0,0];
                let bc = [0, -1, 0,0];
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
                    cpoints.push([xul,yu,zul,0]);
                    cpoints.push([xur, yu, zur,0]);

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

                        cpoints.push([xur, yu, zur,0]);
                        cpoints.push([xul,yu,zul,0]);
                        cpoints.push([xll, yl, zll,0]);

                        cpoints.push([xur, yu, zur,0]);
                        cpoints.push([xll, yl, zll,0]);
                        cpoints.push([xlr, yl, zlr,0]);


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

                    cpoints.push([xul,yu,zul,0]);
                    cpoints.push(bc);
                    cpoints.push([xur, yu, zur,0]);

                    xul = xur;
                    zul = zur;
                    xur = xul * cdu + zul * sdu;
                    zur = zul * cdu - xul * sdu;
                }


                return cpoints;

            }
        }


       get color_scheme() {
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
},

    Triangles: class  extends Base {
        constructor() {
            super();
            this.vertex_list = [];
            this.color_list = [];
            this.normal_list = [];
            this.texture_map = [];
        }

        get size() {
            return this.vertex_list.length;
        }

        get vertices() {
            return this.vertex_list;
        }

        get color_scheme() {
            return this.color_list;
        }

        get normals() {
            return this.normal_list;
        }

        get texture_map() {
            return this.texture_map;
        }

    },

    Points: class  extends Base {
        constructor() {
            super();
            this.vertex_list = [];
            this.color_list = [];
            this.normal_list = undefined;
        }

        get size() {
            return this.vertex_list.length;
        }

        get vertices() {
            return this.vertex_list;
        }

        get color_scheme() {
            return this.color_list;
        }

        get normals() {
            return this.normal_list;
        }

        get drawing_mode() {
            return WebGLRenderingContext.POINTS;
        }

    },
};








