import UploadArea from '../components/UploadArea';
import ModelViewer from '../components/ModelViewer';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">倾斜摄影3D模型查看器</h1>
        <p className="text-gray-600">上传并查看您的3D模型</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <UploadArea />
        </div>
        <div className="lg:col-span-2">
          <ModelViewer />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">使用说明</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>点击「选择文件夹」按钮或拖拽文件夹到上传区域</li>
          <li>等待文件上传完成，系统会自动查找并加载3D模型文件（.glb或.gltf格式）</li>
          <li>在3D查看区域中，您可以：</li>
          <ul className="list-circle list-inside ml-6 space-y-1">
            <li>鼠标拖拽：旋转模型</li>
            <li>滚轮：缩放模型</li>
            <li>Shift+拖拽：平移模型</li>
          </ul>
        </ul>
      </div>
    </div>
  )
}