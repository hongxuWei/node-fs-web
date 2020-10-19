import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

function DirRedirect (props) {
  const { fullPathName, id, fullParentPathId } = props;
  const ids = fullParentPathId.split('/');
  const breadcrumbs = fullPathName.split('/').map((v, i, arr) => {
    if (i === 0) {
      return id === 0 ? <Breadcrumb.Item key={0}>全部文件</Breadcrumb.Item> : <Breadcrumb.Item key={0}><Link to="/dir/0">全部文件</Link></Breadcrumb.Item>;
    }
    const maxIndex = arr.length - 1;
    const isLast = i === maxIndex;
    if (isLast) {
      return <Breadcrumb.Item key={id}>{v}</Breadcrumb.Item>;
    }
    return <Breadcrumb.Item key={ids[i]}><Link to={`/dir/${ids[i]}`}>{v || "全部文件"}</Link></Breadcrumb.Item>;
  });

  return (
    <Breadcrumb className="dir-redirect">
      {breadcrumbs}
    </Breadcrumb>
  );
}

export default DirRedirect;

