"use client";
import { AppContext } from '@/app/context/IsPlayingContext';
import { OrbitControls, SpotLight,useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect,useRef, useContext } from 'react';
import { Vector3 } from 'three';

const Torch = ({vec = new Vector3(), ...props}) => {
    const light = useRef<THREE.SpotLight>(null);
    const viewport = useThree(state => state.viewport)
    useFrame((state) => {
        light.current?.target.position.lerp(
            vec.set(
                (state.mouse.x * viewport.width)/2, 
                (state.mouse.y * viewport.width)/2,0
            ),0.1);
            light.current?.target.updateMatrixWorld()
    })
    return(
        <SpotLight
            ref={light}
            castShadow
            penumbra={1}
            distance={10}
            angle={0.35}
            attenuation={5}
            anglePower={4}
            intensity={3}
            {...props}
        />
    );
} 
const Head = () => {
    const model = useGLTF("/head.glb");
    const animation = useAnimations(model.animations, model.scene)
    const action = animation.actions.Animation
    
    const { isPlaying, setIsPlaying } =  useContext(AppContext)

    useEffect(() => {
        if(isPlaying){
            action?.play();
        }else{
            action?.fadeOut(0.5);
            setTimeout(() => {
                action?.stop();
            },500);
        }
    }, [isPlaying, action]);

    return (
        <>
            <primitive object={model.scene} scale={3} rotation-z={0.2} />
            <Torch 
            color="#1baaf7" 
            position={[3,2,2]}/>
            <Torch 
            color="#db2c2c" 
            position={[-3,2,2]}/>
        </>
    )

}
const ChatBotCanvas = () => {
    return <Canvas>
        <mesh>
            <OrbitControls
                enableZoom={false}
                enableDamping
                maxPolarAngle={2}
                minAzimuthAngle={-Math.PI * 0.5}
                maxAzimuthAngle={Math.PI * 0.5} />
            <ambientLight />
            <Head />
        </mesh>
    </Canvas>
}

export default ChatBotCanvas