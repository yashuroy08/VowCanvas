import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import useDataStore from '../store/useDataStore';

function LoveParticles({ color }) {
  const count = 180; // Total count
  const heartMesh = useRef();
  const petalMesh = useRef();
  const roseMesh = useRef();
  const { viewport, mouse } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Custom Geometries
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.5, 0.5, 1, 0, 0, -1);
    shape.bezierCurveTo(-1, 0, -0.5, 0.5, 0, 0);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const roseGeometry = useMemo(() => {
    // Simplified rose: a few overlapping circle-ish shapes
    const group = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const pShape = new THREE.Shape();
      const angle = (i / 5) * Math.PI * 2;
      const radius = 0.4;
      pShape.absarc(Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5, radius, 0, Math.PI * 2);
      const geo = new THREE.ShapeGeometry(pShape);
      const mat = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mat);
      m.rotation.x = Math.random() * 0.2;
      group.add(m);
    }
    // Convert to a single geometry for instancing is hard with Group, 
    // so let's just use a specialized Shape for the rose instance
    const rShape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) rShape.moveTo(x, y);
      else rShape.quadraticCurveTo(0, 0, x, y);
    }
    return new THREE.ShapeGeometry(rShape);
  }, [color]);

  const petalGeometry = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const type = i % 3; // 0: heart, 1: petal, 2: rose
      const t = Math.random() * 100;
      const factor = 10 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 200;
      const xFactor = -30 + Math.random() * 60;
      const yFactor = -30 + Math.random() * 60;
      const zFactor = -30 + Math.random() * 60;
      const rotationSpeed = Math.random() * 0.02;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, type, rotationSpeed });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor, type, rotationSpeed } = particle;
      t = particle.t += speed;
      const s = Math.cos(t);
      
      const mouse3D = new THREE.Vector3(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      );
      
      const pos = new THREE.Vector3(
        (xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10) / 2,
        (yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10) / 2,
        (zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10) / 2
      );

      const distance = mouse3D.distanceTo(pos);
      if (distance < 8) {
        const force = (8 - distance) / 8;
        const dir = pos.clone().sub(mouse3D).normalize().multiplyScalar(force * 0.5);
        particle.mx += dir.x;
        particle.my += dir.y;
      }
      
      particle.mx *= 0.92;
      particle.my *= 0.92;

      pos.x += particle.mx;
      pos.y += particle.my;

      dummy.position.copy(pos);
      
      if (type === 0) { // Heart
        dummy.scale.setScalar(s * 0.3 + 0.6);
        dummy.rotation.set(0, 0, t * 2);
      } else if (type === 1) { // Petal
        dummy.scale.set(s * 0.4 + 0.5, (s * 0.4 + 0.5) * 0.2, (s * 0.4 + 0.5) * 1.5);
        dummy.rotation.set(s * 5, s * 5, s * 5);
      } else { // Rose
        dummy.scale.setScalar(s * 0.2 + 0.5);
        dummy.rotation.set(t, t * 1.5, 0);
      }
      
      dummy.updateMatrix();
      
      const mesh = type === 0 ? heartMesh : type === 1 ? petalMesh : roseMesh;
      if (mesh.current) {
        mesh.current.setMatrixAt(Math.floor(i / 3), dummy.matrix);
      }
    });

    if (heartMesh.current) heartMesh.current.instanceMatrix.needsUpdate = true;
    if (petalMesh.current) petalMesh.current.instanceMatrix.needsUpdate = true;
    if (roseMesh.current) roseMesh.current.instanceMatrix.needsUpdate = true;
  });

  const materialProps = {
    color,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  };

  return (
    <>
      <instancedMesh ref={heartMesh} args={[heartGeometry, null, count / 3]}>
        <meshStandardMaterial {...materialProps} />
      </instancedMesh>
      <instancedMesh ref={petalMesh} args={[petalGeometry, null, count / 3]}>
        <meshStandardMaterial {...materialProps} />
      </instancedMesh>
      <instancedMesh ref={roseMesh} args={[roseGeometry, null, count / 3]}>
        <meshStandardMaterial {...materialProps} />
      </instancedMesh>
    </>
  );
}

export default function ParticleBackground() {
  const { data } = useDataStore();
  const theme = data?.styleTheme || 'classic';
  
  const themeColors = {
    classic: '#ff4d6d',
    lavender: '#a78bfa',
    midnight: '#f43f5e',
    sage: '#34d399',
    sunset: '#fb923c'
  };
  
  const color = themeColors[theme] || '#ff4d6d';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
      <Canvas camera={{ fov: 75, position: [0, 0, 15] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={color} />
        <LoveParticles color={color} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
