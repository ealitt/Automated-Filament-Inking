import React, { useEffect, useRef, useState } from "react";
import { extend, useThree } from "@react-three/fiber";
import { DragControls } from "three/examples/jsm/controls/DragControls";

extend({ DragControls });

function Draggable(props) {
  const groupRef = useRef();
  const controlsRef = useRef();
  const [objects, setObjects] = useState();
  const { camera, gl, scene } = useThree();
  useEffect(() => {
    setObjects(groupRef.current.children);
  }, [groupRef]);

  useEffect(() => {
    controlsRef.current.addEventListener("hoveron", () => {
      scene.orbitControls.enabled = false;
    });
    controlsRef.current.addEventListener("hoveroff", () => {
      scene.orbitControls.enabled = true;
    });
  }, [objects]);
  return (
    <group ref={groupRef}>
      <dragControls ref={controlsRef} args={[objects, camera, gl.domElement]} />
      {props.children}
    </group>
  );
}

export default Draggable;