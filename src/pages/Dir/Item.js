import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Checkbox } from 'antd';
import { VIEW_TYPE_SQUARE, VIEW_TYPE_LIST } from './index';
import { GLOBAL_CONTEXT, G_KEY_CUSTOMER } from '../../utils/context';
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
  const isSquare = props.viewType === VIEW_TYPE_SQUARE;

  const global = useContext(GLOBAL_CONTEXT);
  const iconClass = getIconClassName(props.name, props.type);

  const onMenu = (e) => {
    e.preventDefault();
    const { clientX, clientY, screenX, screenY } = e;
    global.updateGlobal(G_KEY_CUSTOMER, { clientX, clientY, screenX, screenY, visible: true });
    console.log({ ...e });
  }

  const content = (
    <div onContextMenu={isSquare ? onMenu : undefined} className="dir-item" data-id={props.id} data-type={props.type}>
      <Checkbox className="dir-item-checkbox"/>
      <div className={iconClass}></div>
      <Tooltip title={props.name}>
        <div className="name">{props.name}</div>
      </Tooltip>
    </div>
  );

  if (isSquare) {
    return (
      props.type === DIR
      ? <Link to={`/dir/${props.id}`}>{content}</Link>
      : <a href={`//localhost/file/${props.id}`}>{content}</a>
    );
  }

  return content;
}

export default Item;