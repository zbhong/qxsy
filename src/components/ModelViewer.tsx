import React, { useEffect, useRef } from 'react';
import { useModelStore } from '../store/useModelStore';

const ModelViewer: React.FC = () => {
  const { modelUrl } = useModelStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelUrl) return;

    // 检查是否为tileset.json文件
    if (modelUrl.includes('tileset.json')) {
      // 这里需要使用Cesium来处理3D Tiles
      // 由于Cesium的集成比较复杂，这里仅作为示例
      console.log('Loading 3D Tiles:', modelUrl);
      // 实际项目中，你需要初始化Cesium Viewer并加载tileset
    }
  }, [modelUrl]);

  if (!modelUrl) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">请先上传3D模型</p>
      </div>
    );
  }

  // 检查是否为tileset.json文件
  if (modelUrl.includes('tileset.json')) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden"
        id="cesiumContainer"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">加载3D Tiles中...</p>
        </div>
      </div>
    );
  }

  // 对于普通的GLTF/GLB模型，使用原来的Canvas
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <iframe 
        src={`/model-viewer.html?model=${encodeURIComponent(modelUrl)}`} 
        className="w-full h-full border-0"
        title="3D Model Viewer"
      ></iframe>
    </div>
  );
};

export default ModelViewer;
