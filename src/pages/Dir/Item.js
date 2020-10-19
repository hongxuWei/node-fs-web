import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

const DIR = 1;

function getIconClassName (name, type) {
  if (type === DIR) return 'ficon icon-dir';
  if (/(\.xlsx|\.xls)$/.test(name)) return 'ficon icon-excel';
  if (/(\.mp4|\.avi)$/.test(name)) return 'ficon icon-video';
  if (/(\.mp3)$/.test(name)) return 'ficon icon-music';
  if (/(\.pdf)$/.test(name)) return 'ficon icon-pdf';
  if (/(\.ppt|\.pptx)$/.test(name)) return 'ficon icon-ppt';
  if (/(\.word)$/.test(name)) return 'ficon icon-word';
  if (/(\.txt)$/.test(name)) return 'ficon icon-txt';
  if (/(\.png|\.jpg|\.jpeg|\.gif)$/.test(name)) return 'ficon icon-img';
  if (/(\.dmg)$/.test(name)) return 'ficon icon-apple-app';
  if (/(\.gz|\.zip)$/.test(name)) return 'ficon icon-zip';
  if (/(\.html|\.js|\.css)$/.test(name)) return 'ficon icon-code';
  return 'ficon';
}

function Item (props) {
  const iconClass = getIconClassName(props.name, props.type);
  const content = (
    <div className="dir-item">
      <div className={iconClass}></div>
      <Tooltip title={props.name}>
      <div className="name">{props.name}</div>
      </Tooltip>
    </div>
  );
  if (props.type === DIR) {
    return (
      <Link to={`/dir/${props.id}`}>{content}</Link>
    );
  }

  const onMenu = (e) => {
    e.preventDefault();
    console.log(e);
  }

  return <a onContextMenu={onMenu} target="_blank" href={`//localhost/file/${props.id}`}>{content}</a>;
}

export default Item;