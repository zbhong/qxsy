import React, { useEffect, useRef } from 'react';
import { useModelStore } from '../store/useModelStore';

const ModelViewer: React.FC = () => {
  const { modelUrl, tilesetFiles } = useModelStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modelUrl || !tilesetFiles) return;

    // 检查是否为本地tileset格式
    if (modelUrl.startsWith('local-tileset://')) {
      import('cesium').then((Cesium: any) => {
        if (!containerRef.current) return;
        
        // 配置Cesium
        (window as any).CESIUM_BASE_URL = '';
        
        // 初始化Cesium Viewer
        const viewer = new Cesium.Viewer(containerRef.current, {
          baseLayerPicker: false,
          fullscreenButton: false,
          homeButton: false,
          infoBox: false,
          navigationHelpButton: false,
          scene3DOnly: true,
          timeline: false,
          animation: false,
          geocoder: false
        });
        
        // 获取tileset.json的路径和文件
        const tilesetPath = modelUrl.replace('local-tileset://', '');
        const tilesetFile = tilesetFiles.get(tilesetPath);
        
        if (tilesetFile) {
          // 创建一个包含所有文件URL的映射表
          const filesUrlMap = new Map<string, string>();
          tilesetFiles.forEach((file, path) => {
            filesUrlMap.set(path, URL.createObjectURL(file));
          });
          
          // 读取和处理tileset.json
          const reader = new FileReader();
          reader.onload = async (event) => {
            let tilesetContent = event.target?.result as string;
            
            // 获取tileset.json所在的目录
            const baseDir = tilesetPath.split('/').slice(0, -1).join('/');
            
            try {
              const tilesetData = JSON.parse(tilesetContent);
              
              // 创建自定义的资源加载器
              const loadResource = function(url: string) {
                // 处理相对路径
                let fullPath = url;
                if (!url.startsWith('http') && !url.startsWith('blob')) {
                  fullPath = baseDir ? baseDir + '/' + url : url;
                }
                
                // 在我们的URL映射表中查找
                const blobUrl = filesUrlMap.get(fullPath);
                if (blobUrl) {
                  return blobUrl;
                }
                
                // 尝试直接匹配文件名
                for (const [path, url] of filesUrlMap.entries()) {
                  if (path.endsWith('/' + url.split('/').pop() || '')) {
                    return url;
                  }
                }
                
                return url;
              };
              
              // 我们需要直接使用blob URL加载tileset.json
              const tilesetUrl = filesUrlMap.get(tilesetPath);
              if (tilesetUrl) {
                try {
                  // 由于我们无法轻易地拦截Cesium的内部请求，我们将使用一个简单的方法
                  // 创建一个自定义的3D Tileset实例
                  const tileset = new Cesium.Cesium3DTileset({
                    url: tilesetUrl,
                    skipLevelOfDetail: true,
                    baseScreenSpaceError: 1024,
                    skipScreenSpaceErrorFactor: 16,
                    skipLevels: 1,
                    immediatelyLoadDesiredLevelOfDetail: false,
                    loadSiblings: false,
                    cullWithChildrenBounds: true,
                    dynamicScreenSpaceError: true,
                    dynamicScreenSpaceErrorDensity: 0.00278,
                    dynamicScreenSpaceErrorFactor: 4.0,
                    dynamicScreenSpaceErrorHeightFalloff: 0.25
                  } as any);
                  
                  viewer.scene.primitives.add(tileset);
                  
                  // 监听瓦片加载事件来处理外部资源
                  tileset.tileVisible.addEventListener(function(tile: any) {
                    // 可以在这里添加额外的处理
                  });
                  
                  // 等待模型加载并定位
                  try {
                    await tileset.readyPromise;
                    const boundingSphere = tileset.boundingSphere;
                    if (boundingSphere) {
                      viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, boundingSphere.radius * 2));
                    }
                  } catch (error) {
                    console.error('Tileset ready error:', error);
                    alert('模型加载可能不完整，因为缺少一些瓦片文件。请确保上传了完整的3dtitle文件夹。');
                  }
                } catch (error) {
                  console.error('Error loading tileset:', error);
                  alert('加载模型时出错：' + (error as Error).message);
                }
              }
            } catch (error) {
              console.error('Error parsing tileset.json:', error);
              alert('无法解析tileset.json文件');
            }
          };
          
          reader.readAsText(tilesetFile);
        }
      });
    }
  }, [modelUrl, tilesetFiles]);

  if (!modelUrl) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">请先上传3D模型</p>
      </div>
    );
  }

  // 检查是否为本地tileset格式
  if (modelUrl.startsWith('local-tileset://')) {
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
