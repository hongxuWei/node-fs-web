import React, { useState, useEffect } from 'react';
import { Button, Empty } from 'antd';
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

export const VIEW_TYPE_SQUARE = 1;
export const VIEW_TYPE_LIST = 2;

function Dir (props) {
  const defaultViewType = getLocalData('dirViewType', VIEW_TYPE_SQUARE);
  const [dir, setDir] = useState([]);
  const [dirInfo, setDirInfo] = useState(defaultDirInfo);
  const [viewType, setViewType] = useState(defaultViewType);
  const [selectIndexs, setSelectIndexs] = useState([]);
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
            onClick={() => onViewTypeChange(VIEW_TYPE_SQUARE)}
            className={`${viewType !== VIEW_TYPE_LIST ? "dir-control-active" : ""} dir-control-action`}/>
          <BarsOutlined
            onClick={() => onViewTypeChange(VIEW_TYPE_LIST)}
            className={`${viewType === VIEW_TYPE_LIST ? "dir-control-active" : ""} dir-control-action`} />
        </div>
      </div>
      <div className={`dir-content ${viewType === VIEW_TYPE_LIST ? 'dir-view-as-list' : ''}`}>
        {
          dir.length === 0 &&
          <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有任何文件' />
        }
        { dir.map((v, i) => (
            <Item
              {...v}
              viewType={viewType}
              changeSelect={(selected) => {
                if (selected) {
                  setSelectIndexs([...selectIndexs, i]);
                } else {
                  const index = selectIndexs.findIndex(index => i === index);
                  selectIndexs.splice(index, 1);
                  setSelectIndexs([...selectIndexs]);
                }
              }}
              key={`${v.id}-${v.type}`}
            />
          ))
        }
      </div>
    </div>
  );
}

export default Dir;