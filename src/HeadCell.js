import React from 'react';
import classNames from 'classnames';
import { cellAlignStyle } from './utils';
import Sorter from './Sorter';
import { CS } from './types';

type CellProps = {
  key: string,
  column: Object,
  components: Object,
  headerRowHeight: number,
  current: number,
  orders: Object,
  prefixCls: string,
  onSort: Function
}

function renderCell(props: CellProps) {
  const {
    key,
    column,
    components,
    headerRowHeight,
    current = 0,
    orders,
    prefixCls,
    onSort,
    onHeaderRow,
  } = props;
  const children = column.children || [];
  const Th = components.header.cell;
  const {
    dataIndex,
    align,
    title,
    sortEnable,
    onHeaderCell
  } = column;
  const rowSpan = column[CS.rowSpan];
  const width = column[CS._width];
  const order = orders[dataIndex];
  let style = cellAlignStyle(align);
  if (width) {
    style.width = width;
    style.minWidth = width;
  } else {
    style.flex = 1;
  }
  style.height = (rowSpan || 1) * headerRowHeight;
  if (onHeaderCell) {
    style = { ...style, ...onHeaderCell(column) };
  }
  let cellProps = {
    className: classNames('th', { 'has-child': children.length > 0 }),
    style
  };
  if (onHeaderRow) {
    cellProps = { ...cellProps, ...onHeaderRow(column) };
  }
  if (children.length === 0) {
    cellProps.key = key;
  }
  let text = title;
  if (typeof title === 'function') {
    text = title(column);
  }
  let sorter;
  if (sortEnable && children.length === 0 && order) {
    sorter = Sorter({
      dataIndex,
      order,
      prefixCls,
      onSort
    });
  }
  if (sortEnable && children.length === 0) {
    cellProps.onClick = () => onSort(
      column.dataIndex,
      order === 'desc' || order === true ? 'asc' : 'desc'
    );
  }

  const cell = (
    <Th {...cellProps}>
      {text}
      {sorter}
    </Th>
  );

  if (children.length > 0) {
    return (
      <div className={current === 0 ? 'row-group' : ''} key={key}>
        {cell}
        <div className='col-group'>
          {children.map((child, i) => renderCell({
            key: `${key}-${current}-${i}`,
            column: child,
            components,
            headerRowHeight,
            current: current + 1,
            orders,
            prefixCls,
            onSort
          }))}
        </div>
      </div>
    );
  }
  return cell;
}

type HeadCellProps = {
  key: string,
  column: Object,
  index: number,
  components: Object,
  prefixCls: string,
  fixed: string,
  headerRowHeight: number,
  orders: Object,
  onSort: Function,
  onHeaderRow: Function,
}

function HeadCell(props: HeadCellProps) {
  const {
    key,
    column,
    components,
    prefixCls,
    headerRowHeight,
    orders,
    onSort,
    onHeaderRow,
  } = props;
  return renderCell({
    key,
    column,
    components,
    headerRowHeight,
    orders,
    prefixCls,
    onSort,
    onHeaderRow,
  });
}

export default HeadCell;
