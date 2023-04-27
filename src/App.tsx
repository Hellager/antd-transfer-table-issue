import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ConfigProvider, theme, Switch, Button, Transfer, Tag, Modal, Badge, Table, Layout, Tooltip, Divider, Input, Select, Form, Row, Col, Space, message, InputNumber, Popconfirm, Typography } from 'antd';
import type { ColumnsType, ColumnType, FilterValue, SorterResult, TableRowSelection } from 'antd/es/table/interface';
import type { TableProps } from 'antd';
import type { TransferItem, TransferProps } from 'antd/es/transfer';

import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface CleanFilterItemLabel {
  key: string;
  name: string;
  color?: string;
}

interface CleanFilterItem {
  id: React.Key,
  state: string,
  keyword: string,
  create_at: number,
  edit_at: number,

  author?: string,
  level?: number,
  group?: number,
  labels?: CleanFilterItemLabel[];
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: CleanFilterItem[];
  leftColumns: ColumnsType<CleanFilterItem>;
  rightColumns: ColumnsType<CleanFilterItem>;
}

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
          listSelectedKeys = newSelectedRowKeys as string[];
      };

      const rowSelection: TableRowSelection<TransferItem> = {
        onSelect({ id }, selected) {
          onItemSelect(id as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
        onChange: onSelectChange,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          pagination={{
            pageSize: 5
          }}
          dataSource={filteredItems}
          size="small"
          onRow={({ id }) => ({
            onClick: () => {
              onItemSelect(id as string, !listSelectedKeys.includes(id as string));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const leftTableColumns: ColumnsType<CleanFilterItem> = [
  {
    dataIndex: 'keyword',
    title: 'Keyword',
  },
];

const rightTableColumns: ColumnsType<CleanFilterItem> = [
  {
    dataIndex: 'keyword',
    title: 'Keyword',
  },
];

const Default_Time_String_Format: string = "YYYY/MM/DD HH:mm::ss";

function get_local_timezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function get_random_timestamp(start: Date = new Date(2022, 1, 1), end: Date = new Date(2023, 1, 1), timezone: string = get_local_timezone()): number {
  return dayjs(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))).tz(timezone).unix();
}

const test_list: CleanFilterItem[] = [];

for (let i = 0; i < 50; i +=1) {
  test_list.push({
      id: nanoid(8),
      state: Math.round(Math.random()) ? 'closed' : 'open',
      keyword: faker.word.adjective(),
      create_at: get_random_timestamp(),
      edit_at: get_random_timestamp(),
      author: faker.name.fullName(),
      level: 0,
      labels: [{ key: nanoid(3), name: "black", color: "red"}],
      group: 0,
  })
}


function App() {
  const [isTransfer, setIsTransfer] = useState(false);
  const [transferMode, setTransferMode] = useState("import");
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [showTransferSearch, setShowTransferSearch] = useState(false);

  const leftTableColumns: ColumnsType<CleanFilterItem> = [
    {
      dataIndex: 'keyword',
      title: "Keyword"
    },
  ];

  const rightTableColumns: ColumnsType<CleanFilterItem> = [
    {
      dataIndex: 'keyword',
      title: "Keyword"
    },
  ];

  const onTransferChange = (nextTargetKeys: string[]) => {
    console.log(nextTargetKeys);
    setTargetKeys(nextTargetKeys);
  };

  const on_start_transfer_search = () => {
      setShowTransferSearch(!showTransferModal);
  };

  const showTransferModal = () => {
      setIsTransfer(true);
  }

  const handleTransferModeChange = (value: string) => {
    setTransferMode(value);
  }

  const loopDataSourceFilter = (
    data: readonly CleanFilterItem[],
    id: React.Key | undefined,
  ): CleanFilterItem[] => {
    return data
      .map((item) => {
        if (item.id !== id) {
          return item;
        }
        return null;
      })
      .filter(Boolean) as CleanFilterItem[];
  };

  const on_select_transfer_import_file = () => {
    console.log('open file');
  }

  return (
    <div>
      <Row>
          <TableTransfer
              style={{width: "100%"}}
              dataSource={test_list}
              rowKey={(record) => record.id}
              targetKeys={targetKeys}
              showSearch={showTransferSearch}
              onChange={onTransferChange}
              filterOption={(inputValue, item) =>
                  item.title!.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
              }
              leftColumns={leftTableColumns}
              rightColumns={rightTableColumns}
          />
      </Row>
    </div>
  );
};

export default App;
