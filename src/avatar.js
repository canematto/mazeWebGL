// MultiJointModel_segment.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // The followings are some shading calculation to make the arm look three-dimensional
  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // Light direction
  '  vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +  // Robot color
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of attribute and uniform variables
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (a_Position < 0 || !u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location of attribute or uniform variable');
    return;
  }

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(20.0, 30.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Register the event handler to be called on key press
  document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); };

  draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}

var ANKLE_STEP = 3.0;     // The increments of rotation angle (degrees)
var ARM_STEP = 7.0;     // The increments of rotation angle (degrees)
var HIP_STEP = 4.0;     // The increments of rotation angle (degrees)
var KNEE_STEP = 4.0;     // The increments of rotation angle (degrees)

// 1 stands for LEFT, 2 stands for RIGHT
var g_jointAnkle1 = 0.0;   // The rotation angle of arm1 (degrees)
var g_jointAnkle2 = 0.0; // The rotation angle of joint1 (degrees)
var g_jointKnee1 = 0.0;  // The rotation angle of joint2 (degrees)
var g_jointKnee2 = 0.0;  // The rotation angle of joint3 (degrees)
var g_jointHip1 = 0.0;  // The rotation angle of joint3 (degrees)
var g_jointHip2 = 0.0;  // The rotation angle of joint3 (degrees)
var g_jointArm1 = 0.0;  // The rotation angle of joint3 (degrees)
var g_jointArm2 = 0.0;  // The rotation angle of joint3 (degrees)
var val1 = [];
var val2 = [];



function keydown(ev, gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  switch (ev.keyCode) {
    case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis

      //for (i=0; i<24.0; i++) { 
      //  if (g_jointAnkle1)
      //}

      if (g_jointAnkle1 < 24.0 && g_jointAnkle1 >= 0 && g_jointAnkle2 > -24.0 && g_jointAnkle2 <= 0) { 
      g_jointAnkle1 += ANKLE_STEP;
      g_jointAnkle2 -= ANKLE_STEP;
      } else if (g_jointAnkle1 >= -24.0 && g_jointAnkle2 <= 24.0) { 
      g_jointAnkle1 -= ANKLE_STEP;
      g_jointAnkle2 += ANKLE_STEP;
      }
    

      if (g_jointArm1 < 45.0 && g_jointArm2 > -45.0) { 
      g_jointArm1 += ARM_STEP;
      g_jointArm2 -= ARM_STEP;
      } else if (g_jointArm1 >= -45.0 && g_jointArm2 <= 45.0) { 
      g_jointArm1 -= ARM_STEP;
      g_jointArm2 += ARM_STEP;
      }

      if (g_jointHip1 < 20.0 && g_jointHip2 > -20.0) { 
      g_jointHip1 += HIP_STEP;
      g_jointHip2 -= HIP_STEP;
      } else if (g_jointHip1 >= -20.0 && g_jointHip2 <= 20.0) { 
      g_jointHip1 -= HIP_STEP;
      g_jointHip2 += HIP_STEP;
      } 

      if (g_jointKnee1 > -20.0 && g_jointKnee2 < 20.0) { 
      g_jointKnee1 -= KNEE_STEP;
      g_jointKnee2 += KNEE_STEP;
      } else if (g_jointKnee1 <= 20.0 && g_jointKnee2 >= -20.0) { 
      g_jointKnee1 += KNEE_STEP;
      g_jointKnee2 -= KNEE_STEP;
      }    

      break;
 /*   
    case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
      if (g_jointAnkle1 > -22.0 && g_jointAnkle2 < 22.0) { 
      g_jointAnkle1 -= ANKLE_STEP;
      g_jointAnkle2 += ANKLE_STEP;
      }

      if (g_jointArm1 > -45.0 && g_jointArm2 < 45.0) { 
      g_jointArm1 -= ARM_STEP;
      g_jointArm2 += ARM_STEP;
      }

      if (g_jointHip1 > -20.0 && g_jointHip2 < 20.0) { 
      g_jointHip1 -= HIP_STEP;
      g_jointHip2 += HIP_STEP;
      }  

      if (g_jointKnee1 < 20.0 && g_jointKnee2 > -20.0) { 
      g_jointKnee1 += KNEE_STEP;
      g_jointKnee2 -= KNEE_STEP;
      }  

      break;
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
      break;
    case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
      break;
    case 90: // 'ｚ'key -> the positive rotation of joint2
      g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
      break; 
    case 88: // 'x'key -> the negative rotation of joint2
      g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
      break;
    case 86: // 'v'key -> the positive rotation of joint3
      if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
      break;
    case 67: // 'c'key -> the nagative rotation of joint3
      if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
      break;*/
    default: return; // Skip drawing at no effective action
  }
  // Draw
  draw(gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
console.log('left angle: ' + g_jointAnkle1 + 'right angle: ' + g_jointAnkle2 + '\n');
}


var g_footBuffer = null;     // Buffer object for a base
var g_bodyBuffer = null;     // Buffer object for a base
var g_halfLegBuffer = null;     // Buffer object for a base
var g_armBuffer = null;     // Buffer object for arm1
var g_headBuffer = null;     // Buffer object for a palm
var g_neckBuffer = null;   // Buffer object for fingers

function initVertexBuffers(gl){
  // Vertex coordinate (prepare coordinates of cuboids for all segments)
  var vertices_foot = new Float32Array([ // Foot(2x1x3)
     1.0, 1.0, 5.5, -1.0, 1.0, 5.5, -1.0, 0.0, 5.5,  1.0, 0.0, 5.5, // v0-v1-v2-v3 front
     1.0, 1.0, 5.5,  1.0, 0.0, 5.5,  1.0, 0.0,-1.5,  1.0, 1.0,-1.5, // v0-v3-v4-v5 right
     1.0, 1.0, 5.5,  1.0, 1.0,-1.5, -1.0, 1.0,-1.5, -1.0, 1.0, 5.5, // v0-v5-v6-v1 up
    -1.0, 1.0, 5.5, -1.0, 1.0,-1.5, -1.0, 0.0,-1.5, -1.0, 0.0, 5.5, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.5,  1.0, 0.0,-1.5,  1.0, 0.0, 5.5, -1.0, 0.0, 5.5, // v7-v4-v3-v2 down
     1.0, 0.0,-1.5, -1.0, 0.0,-1.5, -1.0, 1.0,-1.5,  1.0, 1.0,-1.5  // v4-v7-v6-v5 back
  ]);

  var vertices_body = new Float32Array([  // Body(5x7x5)
     5.0, 12.0, 2.5, -5.0, 12.0, 2.5, -5.0, 0.0, 2.5,  5.0, 0.0, 2.5, // v0-v1-v2-v3 front
     5.0, 12.0, 2.5,  5.0, 0.0, 2.5,  5.0, 0.0,-2.5,  5.0, 12.0,-2.5, // v0-v3-v4-v5 right
     5.0, 12.0, 2.5,  5.0, 12.0,-2.5, -5.0, 12.0,-2.5, -5.0, 12.0, 2.5, // v0-v5-v6-v1 up
    -5.0, 12.0, 2.5, -5.0, 12.0,-2.5, -5.0, 0.0,-2.5, -5.0, 0.0, 2.5, // v1-v6-v7-v2 left
    -5.0, 0.0,-2.5,  5.0, 0.0,-2.5,  5.0, 0.0, 2.5, -5.0, 0.0, 2.5, // v7-v4-v3-v2 down
     5.0, 0.0,-2.5, -5.0, 0.0,-2.5, -5.0, 12.0,-2.5,  5.0, 12.0,-2.5  // v4-v7-v6-v5 back
  ]);

  var vertices_UPhalfLeg = new Float32Array([  // halfLeg(2x4x2)
     1.0, -6.0, 1.0, -1.0, -6.0, 1.0, -1.0,  0.0, 1.0,  1.0,  0.0, 1.0, // v0-v1-v2-v3 front
     1.0, -6.0, 1.0,  1.0,  0.0, 1.0,  1.0,  0.0,-1.0,  1.0, -6.0,-1.0, // v0-v3-v4-v5 right
     1.0, -6.0, 1.0,  1.0, -6.0,-1.0, -1.0, -6.0,-1.0, -1.0, -6.0, 1.0, // v0-v5-v6-v1 up
    -1.0, -6.0, 1.0, -1.0, -6.0,-1.0, -1.0,  0.0,-1.0, -1.0,  0.0, 1.0, // v1-v6-v7-v2 left
    -1.0,  0.0,-1.0,  1.0,  0.0,-1.0,  1.0,  0.0, 1.0, -1.0,  0.0, 1.0, // v7-v4-v3-v2 down
     1.0,  0.0,-1.0, -1.0,  0.0,-1.0, -1.0, -6.0,-1.0,  1.0, -6.0,-1.0  // v4-v7-v6-v5 back
  ]);

    var vertices_DOWNhalfLeg = new Float32Array([  // halfLeg(2x4x2)
     1.0, 6.0, 1.0, -1.0, 6.0, 1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 6.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0,-1.0,  1.0, 6.0,-1.0, // v0-v3-v4-v5 right
     1.0, 6.0, 1.0,  1.0, 6.0,-1.0, -1.0, 6.0,-1.0, -1.0, 6.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 6.0, 1.0, -1.0, 6.0,-1.0, -1.0, 0.0,-1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.0,  1.0, 0.0,-1.0,  1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
     1.0, 0.0,-1.0, -1.0, 0.0,-1.0, -1.0, 6.0,-1.0,  1.0, 6.0,-1.0  // v4-v7-v6-v5 back
  ]);

  var vertices_arm = new Float32Array([  // arm(2x8x2)
     1.0, 8.0, 1.0, -1.0, 8.0, 1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 8.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0,-1.0,  1.0, 8.0,-1.0, // v0-v3-v4-v5 right
     1.0, 8.0, 1.0,  1.0, 8.0,-1.0, -1.0, 8.0,-1.0, -1.0, 8.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 8.0, 1.0, -1.0, 8.0,-1.0, -1.0, 0.0,-1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.0,  1.0, 0.0,-1.0,  1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
     1.0, 0.0,-1.0, -1.0, 0.0,-1.0, -1.0, 8.0,-1.0,  1.0, 8.0,-1.0  // v4-v7-v6-v5 back
  ]);

  var vertices_head = new Float32Array([  // head(3x3x3)
     2.5, 4.0, 1.5, -2.5, 4.0, 1.5, -2.5, 0.0, 1.5,  2.5, 0.0, 1.5, // v0-v1-v2-v3 front
     2.5, 4.0, 1.5,  2.5, 0.0, 1.5,  2.5, 0.0,-1.5,  2.5, 4.0,-1.5, // v0-v3-v4-v5 right
     2.5, 4.0, 1.5,  2.5, 4.0,-1.5, -2.5, 4.0,-1.5, -2.5, 4.0, 1.5, // v0-v5-v6-v1 up
    -2.5, 4.0, 1.5, -2.5, 4.0,-1.5, -2.5, 0.0,-1.5, -2.5, 0.0, 1.5, // v1-v6-v7-v2 left
    -2.5, 0.0,-1.5,  2.5, 0.0,-1.5,  2.5, 0.0, 1.5, -2.5, 0.0, 1.5, // v7-v4-v3-v2 down
     2.5, 0.0,-1.5, -2.5, 0.0,-1.5, -2.5, 4.0,-1.5,  2.5, 4.0,-1.5  // v4-v7-v6-v5 back
  ]);
  
  var vertices_neck = new Float32Array([  // neck(2x2x2)
     1.0, 2.0, 1.0, -1.0, 2.0, 1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 2.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0,-1.0,  1.0, 2.0,-1.0, // v0-v3-v4-v5 right
     1.0, 2.0, 1.0,  1.0, 2.0,-1.0, -1.0, 2.0,-1.0, -1.0, 2.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 2.0, 1.0, -1.0, 2.0,-1.0, -1.0, 0.0,-1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.0,  1.0, 0.0,-1.0,  1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
     1.0, 0.0,-1.0, -1.0, 0.0,-1.0, -1.0, 2.0,-1.0,  1.0, 2.0,-1.0  // v4-v7-v6-v5 back
  ]);
  // Normal
  var normals = new Float32Array([
     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);
  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write coords to buffers, but don't assign to attribute variables
  g_footBuffer = initArrayBufferForLaterUse(gl, vertices_foot, 3, gl.FLOAT);
  g_bodyBuffer = initArrayBufferForLaterUse(gl, vertices_body, 3, gl.FLOAT);
  g_UPhalfLegBuffer = initArrayBufferForLaterUse(gl, vertices_UPhalfLeg, 3, gl.FLOAT);
  g_DOWNhalfLegBuffer = initArrayBufferForLaterUse(gl, vertices_DOWNhalfLeg, 3, gl.FLOAT);
  g_armBuffer = initArrayBufferForLaterUse(gl, vertices_arm, 3, gl.FLOAT);
  g_headBuffer = initArrayBufferForLaterUse(gl, vertices_head, 3, gl.FLOAT);
  g_neckBuffer = initArrayBufferForLaterUse(gl, vertices_neck, 3, gl.FLOAT);
  if (!g_footBuffer || !g_bodyBuffer || !g_UPhalfLegBuffer || !g_DOWNhalfLegBuffer || 
    !g_armBuffer || !g_headBuffer || !g_neckBuffer) return -1;
  // Write normals to a buffer, assign it to a_Normal and enable it
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBufferForLaterUse(gl, data, num, type){
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initArrayBuffer(gl, attribute, data, num, type){
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();



function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // Draw a foot

  g_modelMatrix.setTranslate(0.0, -13.0, 0.0);
  g_modelMatrix.rotate(g_jointAnkle1, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawSegment(gl, n, g_footBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);

  // Draw a foot
    
  g_modelMatrix.setTranslate(6.0, -13.0, 0.0);
  pushMatrix(g_modelMatrix);
  g_modelMatrix.rotate(g_jointAnkle2, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawSegment(gl, n, g_footBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
  g_modelMatrix = popMatrix();

    
  // Draw left lower halfLeg
  var footHeight = 1.0;
  g_modelMatrix.translate(-6.0, footHeight, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_jointKnee1, 1.0, 0.0, 0.0);  // Rotate around the y-axis
  drawSegment(gl, n, g_DOWNhalfLegBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw

  // Draw right lower halfLeg
  g_modelMatrix.translate(6.0, 0.0, 0.0);     // Move onto the base
  g_modelMatrix.rotate(g_jointKnee2, 1.0, 0.0, 0.0);  // Rotate around the y-axis
  drawSegment(gl, n, g_DOWNhalfLegBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw


  // Draw left upper halfLeg
  var halfLegHeight = 11.0;
  g_modelMatrix.translate(-6.0, halfLegHeight, 0.0);     // Move onto the base
  pushMatrix(g_modelMatrix);
  g_modelMatrix.rotate(g_jointHip1, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawSegment(gl, n, g_UPhalfLegBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix = popMatrix();

  // Draw right upper halfLeg
  g_modelMatrix.translate(6.0, 0.0, 0.0);     // Move onto the base
  pushMatrix(g_modelMatrix);
  g_modelMatrix.rotate(g_jointHip2, 1.0, 0.0, 0.0);  // Rotate around the x-axis
  drawSegment(gl, n, g_UPhalfLegBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix = popMatrix();

  // Draw body
  g_modelMatrix.translate(-3.0, 0.0, 0.0);     // Move onto the base
  //g_modelMatrix.rotate(, 1.0, 0.0, 0.0);  // Rotate around the y-axis
  drawSegment(gl, n, g_bodyBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw


  // Draw right arm
  //segment = -1;
  g_modelMatrix.translate(6.0, 10.0, 0.0);       // Move to joint1
  pushMatrix(g_modelMatrix);
  g_modelMatrix.rotate(g_jointArm1, 1.0, 0.0, 0.0);  // Rotate around the z-axis
  drawSegment(gl, n, g_armBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix = popMatrix();

  // Draw left arm
  g_modelMatrix.translate(-12.0, 0.0, 0.0);       // Move to joint1
 pushMatrix(g_modelMatrix);
  g_modelMatrix.rotate(g_jointArm2, 1.0, 0.0, 0.0);  // Rotate around the z-axis
  drawSegment(gl, n, g_armBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
  g_modelMatrix = popMatrix();

  // Draw neck
  g_modelMatrix.translate(6.0, 2.0, 0.0);       // Move to joint1
  //g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawSegment(gl, n, g_neckBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw


   // Draw head
  neckHeight = 2.0;
  g_modelMatrix.translate(0.0, neckHeight, 0.0);       // Move to joint1
  //g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  drawSegment(gl, n, g_headBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw

}



var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

// Draw segments
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Assign the buffer object to the attribute variable
  gl.vertexAttribPointer(a_Position, buffer.num, buffer.type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_Position);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate matrix for normal and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
