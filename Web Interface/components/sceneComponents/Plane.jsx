import React from "react";
import { DoubleSide } from "three";

function Plane(props){ 
    return ( 
        <mesh position={[-120, 0, 120]} rotation={[-Math.PI / 2, 0, 0]} scale={[255, 255, 1]}>
            <planeBufferGeometry />
            <meshBasicMaterial color="gray"/>
        </mesh>
    );
}


export default Plane; 
