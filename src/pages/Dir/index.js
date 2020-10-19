import React, { useState, useEffect } from 'react';
import { getDir } from '../../services/dir';
import Item from './Item';
import {
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import './index.css';


function Dir (props) {
  const [dir, setdir] = useState([]);
  const [viewType, setViewType] = useState('1');
  const { dirId } = props.match.params;

  useEffect(() => {
    getDir({ id: dirId }).then((res) => {
      setdir(res);
    })
  }, [dirId]);

  return (
    <div className="dir" key={dirId}>
      <div className="dir-control">
        <AppstoreOutlined
          onClick={() => setViewType('1')}
          className={viewType !== '2' ? "dir-control-active" : ""}/>
        <BarsOutlined
          onClick={() => setViewType('2')}
          className={viewType === '2' ? "dir-control-active" : ""} />
      </div>
      <div className={`dir-content ${viewType === '2' ? 'dir-view-as-list' : ''}`}>
        { dir.map((v) => <Item key={`${v.id}-${v.type}`} {...v}/>) }
      </div>
    </div>
  );
}

export default Dir;