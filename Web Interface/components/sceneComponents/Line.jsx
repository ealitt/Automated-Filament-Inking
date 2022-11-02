import { extend, Canvas } from '@react-three/fiber'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'

extend({ MeshLine, MeshLineMaterial })



function Line({ points, color }) {
  return (
      <mesh raycast={MeshLineRaycast}>
        <meshLine attach="geometry" points={points} />
        <meshLineMaterial
          useMap={0}
          lineWidth={0.1}
          sizeAttenuation={1}
          color={color}
        />
      </mesh>
  )
}

export default Line;