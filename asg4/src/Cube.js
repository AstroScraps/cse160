class Cube {
    constructor() {
        this.type='cube';
        this.color=[1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = 0;
    }

    render() {
        if(g_normalOn) this.textureNum = -3;

        // fix anim
        this.normalMatrix.setInverseOf(this.matrix).transpose();

        var rgba = this.color;

        // pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // pass the color of a point to a u_fragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //pass matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // pass matrix to u_NormalMatrix attribute
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        // front of cube
        drawTriangle3DUVNormal([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0], [0, 0,  1, 1,  1, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
        drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0], [0, 0,  0, 1,  1, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
        // top of cube
        drawTriangle3DUVNormal([0.0, 1.0, 0.0,  1.0, 1.0, 0.0,  0.0, 1.0, 1.0], [0, 1,  1, 1,  0, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
        drawTriangle3DUVNormal([1.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], [1, 1,  0, 0,  1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
        // "left" of cube
        drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0], [0, 0,  0, 1,  1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
        drawTriangle3DUVNormal([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0], [0, 1,  1, 1,  1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
        // "right" of cube
        drawTriangle3DUVNormal([1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 1.0], [1, 0,  1, 1,  0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
        drawTriangle3DUVNormal([1.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0], [1, 1,  0, 1,  0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
        // back of cube
        drawTriangle3DUVNormal([0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0], [0, 0,  1, 1,  1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
        drawTriangle3DUVNormal([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], [0, 0,  0, 1,  1, 1], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
        // bottom of cube
        drawTriangle3DUVNormal([0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0], [0, 0,  1, 0,  0, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
        drawTriangle3DUVNormal([1.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0], [1, 0,  0, 1,  1, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
    }
}