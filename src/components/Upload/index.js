import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export default function MyUpload (props) {
  props = {
    name: 'file',
    multiple: true,
    action: '//localhost/file',
    data: typeof props.dirId === "number" ? { dirId: props.dirId } : {},
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(info.file.response.message);
      }
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖动文件上传</p>
    </Dragger>
  );
}
