/// <reference types="vite/client" />
import { ShaderMaterial } from '@react-three/fiber';
import { ShaderMaterial as ThreeShaderMaterial } from 'three';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            transitionMaterial: any;
        }
    }
}
