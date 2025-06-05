import React, { useState ,useEffect} from 'react';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const MyUploader = ({ onChange, initialValue }) => {
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState( 
       initialValue?.filePath || '' 
   );

  useEffect(() => {
    if (initialValue) {
      setFileInfo( 
        initialValue.filePath, 
       );
    }
  }, [initialValue]);
  

  // 1. 添加 beforeUpload 函数
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // 文件类型验证 (示例：只允许图片)
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    
    // 文件大小验证 (示例：限制2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    
    return isImage && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const { code, data } = info.file.response;
      if (code === 20000) { 
        setFileInfo(data);
        onChange?.( data);
      }
      setLoading(false);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
      setLoading(false);
    }
  };

  // 2. 添加 uploadButton 变量
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div>
      <Upload
        name="file"
        listType="picture-card"
        className="file-uploader"
        showUploadList={false}
        action="/api/upload/image"
        beforeUpload={beforeUpload}  
        onChange={handleChange}
      >
        {fileInfo ? 
        <img src={"/api/"+fileInfo} alt="avatar" style={{ width: '100%' }} /> 
        : uploadButton}
      </Upload>
      {fileInfo && (
        <div style={{ marginTop: 8 }}>
          <div>访问路径: {fileInfo}</div> 
        </div>
      )}
    </div>
  );
};

export default MyUploader;
