import React from 'react';
import moment from 'moment';
import { Table } from 'antd';
import Upload from '../components/Upload';
import { useAntdTable } from 'ahooks';
import { getFileList } from '../services/common';
import * as sizeUtils from '../utils/size';

const columns = [
  { title: '名称', key: 'name', render: (record) => `${record.name}${record.ext}` },
  { title: '大小', dataIndex: 'size', render: (v) => sizeUtils.format(v) },
  { title: '上传时间', dataIndex: 'createTime', render: (v) => moment(v).format('YYYY-MM-DD HH:mm:ss') },
  { title: '下载', dataIndex: 'id', render: (v, record) => <a href={`//localhost/file/${v}`}>下载</a> }
];

function FileList () {
  const { tableProps } = useAntdTable(getFileList, {
    defaultPageSize: 10,
  });

  return (
    <>
      <Upload />
      <Table
        rowKey='id'
        columns={columns}
        {...tableProps}
      />
    </>
  );
}

export default FileList;