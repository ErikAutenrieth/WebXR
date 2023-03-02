import { useFrame, useThree } from "@react-three/fiber";
import { database } from "config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IColor } from "shared-components/interfaces/host.interface";
import { IPainter } from "shared-components/interfaces/painter.interface";
import * as THREE from "three";
import { TubePainter } from "three/examples/jsm/misc/TubePainter.js";
// That is the position of Paint of Player 2
type Props = {
  hostingId: string | undefined;
  color: IColor;
  colorPlayer2: IColor;
  size: number;
  sizePlayer2: number;
};
const Painter1: React.FC<Props> = ({
  hostingId,
  color,
  colorPlayer2,
  size,
  sizePlayer2,
}: Props) => {
  const { gl, scene } = useThree();
  let camera: THREE.PerspectiveCamera;
  let controller: any;
  let painter: any, painterPlayer2: any;
  const cursor = new THREE.Vector3();
  const [userDataSelecting, setUserDataSelecting] = useState<boolean>(false);
  const [arrayOfPositionPlayer1] = useState<IPainter[]>([]);
  const [arrayOfPositionPlayer2, setArrayOfPositionPlayer2] = useState<
    IPainter[]
  >([]);

  const [indexOfArrayPositionsT, setIndexOfArrayPositions] =
    useState<number>(0);
  const init = () => {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    painter = new TubePainter();
    painter.setSize(size);
    painter.mesh.material.side = THREE.DoubleSide;
    painter.mesh.material = new THREE.MeshBasicMaterial({
      color: color.hex.slice(0, 7),
    });
    scene.add(painter.mesh);

    painterPlayer2 = new TubePainter();
    painterPlayer2.setSize(sizePlayer2);
    painterPlayer2.mesh.material.side = THREE.DoubleSide;
    painterPlayer2.mesh.material = new THREE.MeshBasicMaterial({
      color: colorPlayer2?.hex.slice(0, 7),
    });
    scene.add(painterPlayer2.mesh);

    function onSelectStart(this: any) {
      this.userData.isSelecting = true;
      this.userData.skipFrames = 2;
      setUserDataSelecting(true);
    }

    function onSelectEnd(this: any) {
      this.userData.isSelecting = false;
      setUserDataSelecting(false);
      updatePlayerPosition();
    }
    if (gl) {
      if (gl.xr) {
        if (gl.xr.getController(0)) {
          controller = gl.xr.getController(0);
          controller.addEventListener("selectstart", onSelectStart);
          controller.addEventListener("selectend", onSelectEnd);
          controller.userData.skipFrames = 0;
          controller.userData.painter = painter;
          scene.add(controller);
        }
      }
    }

    window.addEventListener("resize", onWindowResize);
  };

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    gl.setSize(window.innerWidth, window.innerHeight);
  }
  const handleController = (ctl: any) => {
    if (ctl) {
      const userData = ctl.userData;
      const painter = userData.painter;

      cursor.set(0, 0, -0.2).applyMatrix4(ctl.matrixWorld);

      if (userDataSelecting === true) {
        if (userData.skipFrames >= -2) {
          userData.skipFrames--;

          painter.moveTo(cursor);
          const object: IPainter = {
            x: cursor.x,
            y: cursor.y,
            z: cursor.z,
            type: "move",
          };
          arrayOfPositionPlayer1.push(object);
        } else {
          painter.lineTo(cursor);
          painter.update();
          const object: IPainter = {
            x: cursor.x,
            y: cursor.y,
            z: cursor.z,
            type: "line",
          };
          arrayOfPositionPlayer1.push(object);
        }
      }
    }
  };

  const updatePlayerPosition = async () => {
    if (arrayOfPositionPlayer1.length > 0) {
      const docKey = hostingId;
      const docRef = doc(database, `host/${docKey}`);
      await updateDoc(docRef, {
        player1Position: arrayOfPositionPlayer1,
      });
    }
  };

  const paintFromDB = (positionObj: any) => {
    const painterToUse = painterPlayer2;
    const position = positionObj;

    cursor.set(position.x, position.y, position.z);
    if (position.type === "move") {
      painterToUse.moveTo(cursor);
    }

    if (position.type === "line") {
      painterToUse.lineTo(cursor);
      painterToUse.update();
    }
  };
  const setCursorToLastPosition = (x: number, y: number, z: number) => {
    cursor.set(x, y, z);
    painterPlayer2.moveTo(cursor);
  };

  /**
   * this method read player position from document and array
   */
  const getPlayerPosition = async () => {
    const docKey = hostingId;
    onSnapshot(doc(database, `host/${docKey}`), (doc) => {
      const data = doc.data();
      const id = doc.id;
      if (data) {
        setArrayOfPositionPlayer2(data.player2Position);
      }
    });
  };

  useEffect(() => {
    init();
  }, [userDataSelecting]);

  useEffect(() => {
    getPlayerPosition();
  }, []);

  useEffect(() => {
    init();
    if (painterPlayer2) {
      if (arrayOfPositionPlayer2) {
        if (arrayOfPositionPlayer2.length !== 0) {
          if (indexOfArrayPositionsT < arrayOfPositionPlayer2.length) {
            setCursorToLastPosition(
              arrayOfPositionPlayer2[indexOfArrayPositionsT + 1].x,
              arrayOfPositionPlayer2[indexOfArrayPositionsT + 1].y,
              arrayOfPositionPlayer2[indexOfArrayPositionsT + 1].z
            );
            for (
              let index = indexOfArrayPositionsT + 2;
              index < arrayOfPositionPlayer2.length;
              index++
            ) {
              paintFromDB(arrayOfPositionPlayer2[index]);
            }
            setIndexOfArrayPositions(arrayOfPositionPlayer2.length);
          }
        }
      }
    }
  }, [arrayOfPositionPlayer2]);
  useFrame(() => {
    if (controller) {
      handleController(controller);
      if (gl) {
        gl.render(scene, camera);
      }
    }
  });
  return <></>;
};

export default Painter1;
