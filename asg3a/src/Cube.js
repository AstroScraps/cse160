class Cube {
    constructor() {
        this.type='cube';
        this.color=[1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        //pass matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0]);
        drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0]);
        // top of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D([0.0, 1.0, 0.0,  1.0, 1.0, 0.0,  0.0, 1.0, 1.0]);
        drawTriangle3D([1.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0]);
        // left of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
        drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0]);
        drawTriangle3D([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0]);
        // right of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.85, rgba[1]*.85, rgba[2]*.85, rgba[3]);
        drawTriangle3D([1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 1.0]);
        drawTriangle3D([1.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0]);
        // back of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.75, rgba[1]*.75, rgba[2]*.75, rgba[3]);
        drawTriangle3D([0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0]);
        drawTriangle3D([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0]);
        // bottom of cube
        // pass the color of a point to a u_fragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3D([0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0]);
        drawTriangle3D([1.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0]);
        // other sides include: top, bottom, left, right, back
    }
}