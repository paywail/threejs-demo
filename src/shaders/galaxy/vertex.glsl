uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;
void main(){
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    
    // Rotate
    //我们旋转其实只是在xoz平面上旋转，所以算的是这个点，到原点的斜边和x轴夹角
    float angle = atan(modelPosition.x,modelPosition.z);
    // 越远的点其自转的速度越来越慢
    float distanceCenter = length(modelPosition.xz);
    float offsetAngle = (1.0 / distanceCenter ) * uTime;
    angle +=offsetAngle;
    // 别忘记半径
    modelPosition.x = cos(angle) * distanceCenter;
    modelPosition.z = sin(angle) * distanceCenter;


     
     // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;
    gl_Position = projectPosition;

    /**
     * size 
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);


    vColor = color;
}