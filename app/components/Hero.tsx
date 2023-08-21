import type { Object3DNode} from '@react-three/fiber';
import { Canvas, extend } from '@react-three/fiber';
import { useGLTF, Clone, Environment, Float, Effects } from '@react-three/drei'
import Swarm from './Swarm';
import type { GLTF } from 'three-stdlib';
import { UnrealBloomPass } from 'three-stdlib';
import { Vector2 } from 'three';

extend({ UnrealBloomPass })

declare module '@react-three/fiber' {
    interface ThreeElements {
        unrealBloomPass: Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>
    }
}


type GLTFResult = GLTF & {
    nodes: {
      Zero: THREE.Mesh
      Four: THREE.Mesh
    }
    materials: {
      ['Gold Foil']: THREE.MeshStandardMaterial
    }
}

function Fourty() {
    const model = useGLTF('/birthday-transformed.glb') as GLTFResult;

    return (
        <>
            <Float speed={1.01} rotationIntensity={2}>
                <Clone object={model.nodes['Four']} position={[-5, 0, 0]} scale={2}/>
            </Float>
            <Float rotationIntensity={2}>
                <Clone object={model.nodes['Zero']} position={[5, 0, 0]} scale={2}/>
            </Float>
        </>
    )
}

export default function Hero() {
    return (
        <Canvas camera={{ position: [0, 0, 15] }}>
            <Environment files="/blue_photo_studio_low.hdr" />
            <Fourty />
            <Swarm count={5000} />
            <Effects disableGamma>
                <unrealBloomPass args={[new Vector2( 256, 256 ), 0.2, 0.1, 0.2]} />
            </Effects>
        </Canvas>
    );
}