import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Checkbox } from 'antd';
import { VIEW_TYPE_SQUARE, VIEW_TYPE_LIST } from './index';
import { GLOBAL_CONTEXT, G_KEY_CUSTOMER_MENUCONTEXT } from '../../utils/context';
import { TYPE_DIR } from '../../constances/types';

function getIconClassName (ext, type) {
  if (type === TYPE_DIR) return 'ficon icon-dir';
  if (/(\.xlsx|\.xls)$/.test(ext)) return 'ficon icon-excel';
  if (/(\.mp4|\.avi)$/.test(ext)) return 'ficon icon-video';
  if (/(\.mp3)$/.test(ext)) return 'ficon icon-music';
  if (/(\.pdf)$/.test(ext)) return 'ficon icon-pdf';
  if (/(\.ppt|\.pptx)$/.test(ext)) return 'ficon icon-ppt';
  if (/(\.doc|\.docx)$/.test(ext)) return 'ficon icon-word';
  if (/(\.txt)$/.test(ext)) return 'ficon icon-txt';
  if (/(\.png|\.jpg|\.jpeg|\.gif)$/.test(ext)) return 'ficon icon-img';
  if (/(\.dmg)$/.test(ext)) return 'ficon icon-apple-app';
  if (/(\.gz|\.zip)$/.test(ext)) return 'ficon icon-zip';
  if (/(\.html|\.js|\.css)$/.test(ext)) return 'ficon icon-code';
  if (/(\.md)$/.test(ext)) return 'ficon icon-md';
  return 'ficon';
}

function Item (props) {
  const isSquare = props.viewType === VIEW_TYPE_SQUARE;
  const isList = props.viewType === VIEW_TYPE_LIST;

  const global = useContext(GLOBAL_CONTEXT);
  const iconClass = getIconClassName(props.ext, props.type);

  const onMenu = (e) => {
    e.preventDefault();
    const { clientX, clientY, screenX, screenY } = e;
    global.updateGlobal(G_KEY_CUSTOMER_MENUCONTEXT, { clientX, clientY, screenX, screenY, visible: true, type: 'dir-list', data: { id: props.id, type: props.type, name: props.name, ext: props.ext }, refresh: props.refresh });
  }
  const mainContent = (
    <>
      <div className={iconClass}></div>
      <Tooltip title={props.name}>
        <div className="name">{props.name}{props.ext || ""}</div>
      </Tooltip>
    </>
  );
  let linkedMainContent = mainContent;
  if (isList && props.type === TYPE_DIR) linkedMainContent = <Link className='dir-item-link' to={`/dir/${props.id}`}>{mainContent}</Link>;
  if (isList && props.type !== TYPE_DIR) linkedMainContent = <span className="dir-item-link" onClick={() => props.changeSelect(!props.checked)}>{mainContent}</span>;

  const content = (
    <div onContextMenu={isSquare ? onMenu : undefined} className="dir-item" data-id={props.id} data-type={props.type}>
      <Checkbox className="dir-item-checkbox" checked={props.checked} onChange={(e) => props.changeSelect(e.target.checked)}/>
      {linkedMainContent}
    </div>
  );

  if (isSquare) {
    return (
      props.type === TYPE_DIR
      ? <Link to={`/dir/${props.id}`}>{content}</Link>
      : <a href={`//localhost/file/${props.id}`}>{content}</a>
    );
  }

  return content;
}

export default Item;