import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { getDir, getDirInfo } from '../../services/dir';
import DirRedirect from './DirRedirect';
import Item from './Item';
import { getLocalData, setLocalData } from '../../utils/local';
import {
  AppstoreOutlined,
  BarsOutlined,
  PlusOutlined
} from "@ant-design/icons";
import './index.css';

const defaultDirInfo = {
  id: 0,
  fullPathName: '',
  fullParentPathId: '',
  parentId: -1,
}

function Dir (props) {
  const defaultViewType = getLocalData('dirViewType', 1);
  const [dir, setDir] = useState([]);
  const [dirInfo, setDirInfo] = useState(defaultDirInfo);
  const [viewType, setViewType] = useState(defaultViewType);
  const { dirId } = props.match.params;

  const onViewTypeChange = (value) => {
    setLocalData('dirViewType', value);
    setViewType(value);
  }

  useEffect(() => {
    getDir({ id: dirId }).then((res) => {
      setDir(res);
    });
    if (dirId !== '0') {
      getDirInfo({ dirId }).then((res) => {
        setDirInfo(res);
      })
    } else {
      setDirInfo(defaultDirInfo);
    }
  }, [dirId]);

  return (
    <div className="dir" key={dirId}>
      <div className="dir-control">
        <div className="dir-control-left">
          <DirRedirect {...dirInfo}/>
        </div>
        <div className="dir-control-right">
          <Button type="primary" className="dir-control-action" size="small" icon={<PlusOutlined />}>新增文件夹</Button>
          <AppstoreOutlined
            onClick={() => onViewTypeChange(1)}
            className={`${viewType !== 2 ? "dir-control-active" : ""} dir-control-action`}/>
          <BarsOutlined
            onClick={() => onViewTypeChange(2)}
            className={`${viewType === 2 ? "dir-control-active" : ""} dir-control-action`} />
        </div>
      </div>
      <div className={`dir-content ${viewType === 2 ? 'dir-view-as-list' : ''}`}>
        { dir.map((v) => <Item key={`${v.id}-${v.type}`} {...v}/>) }
      </div>
    </div>
  );
}

export default Dir;