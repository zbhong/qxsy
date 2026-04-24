import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { useModelStore } from '../store/useModelStore';

const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const ModelViewer: React.FC = () => {
  const { modelUrl } = useModelStore();

  if (!modelUrl) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">请先上传3D模型</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <PerspectiveCamera makeDefault fov={75} position={[0, 2, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">加载模型中...</p>
          </div>
        }>
          <Model url={modelUrl} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls 
          enableDamping 
          dampingFactor={0.1} 
          enableZoom={true}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
