import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import texture from "../pics/i.jpeg";

export default function Box() {


	return (
		<mesh rotation={[90, 0, 20]}>
			<boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
			<meshNormalMaterial attach="material" />
			{/* <meshStandardMaterial map={colorMap} /> */}
		</mesh>
	);
}
