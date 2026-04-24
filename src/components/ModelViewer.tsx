import React, { useEffect, useRef } from 'react';
import { useModelStore } from '../store/useModelStore';

const ModelViewer: React.FC = () => {
  const { modelUrl } = useModelStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelUrl) return;

    // 检查是否为tileset.json文件
    if (modelUrl.includes('tileset.json')) {
      // 动态导入Cesium以避免构建错误
      import('cesium').then((Cesium: any) => {
        // 初始化Cesium Viewer
        if (containerRef.current) {
          const viewer = new Cesium.Viewer(containerRef.current, {
            baseLayerPicker: false,
            fullscreenButton: false,
            homeButton: false,
            infoBox: false,
            navigationHelpButton: false,
            scene3DOnly: true
          });

          // 加载3D Tiles
          const tileset = new Cesium.Cesium3DTileset({
            url: modelUrl
          } as any);

          viewer.scene.primitives.add(tileset);

          // 定位到模型
          if (tileset.readyPromise) {
            tileset.readyPromise.then(() => {
              const boundingSphere = tileset.boundingSphere;
              if (boundingSphere) {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, boundingSphere.radius * 2));
              }
            });
          } else if (tileset.readyEvent) {
            // 兼容旧版本的Cesium
            tileset.readyEvent.addEventListener(() => {
              const boundingSphere = tileset.boundingSphere;
              if (boundingSphere) {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, boundingSphere.radius * 2));
              }
            });
          }

          // 清理函数
          return () => {
            viewer.destroy();
          };
        }
      });
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
      ></div>
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
