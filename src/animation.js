function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPos = 0.0;            //0.056478155032779295;  
var yPos = 1.4;
var zPos = 201.7057334788756;
var speed = 0;

// disegno avatar
var step = 400.0;
var ankleInterval = 48.0;
var armInterval = 25.0;
var hipInterval = 40.0;
var kneeInterval = 40.0;
var lastUp = false;
var lastDown = false;
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
var increment = true;
var decrement = false;


function handleKeys() {

    if (currentlyPressedKeys[65]) {
        // A
        yawRate = 0.05;
    } else if (currentlyPressedKeys[68]) {
        // D
        yawRate = -0.05;
    } else
    if (currentlyPressedKeys[80]) {
        // P
        pitchRate = 0.05;
    } else if (currentlyPressedKeys[76]) {
        // L
        pitchRate = -0.05;
    } else {
        pitchRate = 0;
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key 
        yawRate = 0.05;
    } else if (currentlyPressedKeys[39]) {
        // Right cursor key
        yawRate = -0.05;

    } else {
        yawRate = 0;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        speed = 0.03;
    } else if (currentlyPressedKeys[40]) {
        // Down cursor key
        speed = -0.03;
    } else {
        speed = 0;
    }

    if (currentlyPressedKeys[38]) {
        if(lastDown = false){
          if(increment = true){
            increment = false;
            decrement = true;
          } else {
            increment = true;
            decrement = false;
          }
      }

      if((hipInterval/2 - step/hipInterval) < g_jointHip1){
        increment = false;
        decrement = true;
      } else if ((-hipInterval/2 + step/hipInterval) > g_jointHip1){
        increment = true;
        decrement = false;
      }

    
      lastUp = true;
      lastDown = false;

      if (increment) { 
        g_jointHip1 += step/hipInterval;
        g_jointHip2 -= step/hipInterval;
      } else if (decrement) { 
        g_jointHip1 -= step/hipInterval;
        g_jointHip2 += step/hipInterval;
      } 


      if (increment) { 
        g_jointKnee1 -= step/kneeInterval;
        g_jointKnee2 += step/kneeInterval;
      } else if (decrement) { 
        g_jointKnee1 += step/kneeInterval;
        g_jointKnee2 -= step/kneeInterval;
      } 
    
      if (increment) { 
        g_jointArm1 += step/armInterval;
        g_jointArm2 -= step/armInterval;
      } else if (decrement) { 
        g_jointArm1 -= step/armInterval;
        g_jointArm2 += step/armInterval;
      }

      if (increment) { 
        g_jointAnkle1 += step/ankleInterval;
        g_jointAnkle2 -= step/ankleInterval;
      } else if (decrement) { 
        g_jointAnkle1 -= step/ankleInterval;
        g_jointAnkle2 += step/ankleInterval;
      }

    } 

    if (currentlyPressedKeys[40]){
      if(lastUp = false){
          if(increment = true){
            increment = false;
            decrement = true;
          } else{
            increment = true;
            decrement = false;
          }
      }

      lastDown = true;
      lastUp = false;
   

      if((hipInterval/2 - step/hipInterval) < g_jointHip1){
        increment = true;
        decrement = false;
      } else if ((-hipInterval/2 + step/hipInterval) > g_jointHip1){
        increment = false;
        decrement = true;
      }
      
      if (increment) { 
        g_jointHip1 -= step/hipInterval;
        g_jointHip2 += step/hipInterval;
      } else if (decrement) { 
        g_jointHip1 += step/hipInterval;
        g_jointHip2 -= step/hipInterval;
      } 


      if (increment) { 
        g_jointKnee1 += step/kneeInterval;
        g_jointKnee2 -= step/kneeInterval;
      } else if (decrement) { 
        g_jointKnee1 -= step/kneeInterval;
        g_jointKnee2 += step/kneeInterval;
      } 
    
      if (increment) { 
        g_jointArm1 -= step/armInterval;
        g_jointArm2 += step/armInterval;
      } else if (decrement) { 
        g_jointArm1 += step/armInterval;
        g_jointArm2 -= step/armInterval;
      }

      if (increment) { 
        g_jointAnkle1 -= step/ankleInterval;
        g_jointAnkle2 += step/ankleInterval;
      } else if (decrement) { 
        g_jointAnkle1 += step/ankleInterval;
        g_jointAnkle2 -= step/ankleInterval;
      }

    }
}

var lastTime = 0;
    // Used to make us "jog" up and down as we move forward.
var joggingAngle = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        if (speed != 0) {
            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;
            joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 1.4;
            //console.log('xPos: ' + xPos + 'zPos: ' + zPos + '\n');
        }
        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
        //setting up camera matrix
        
    }
    lastTime = timeNow;
}