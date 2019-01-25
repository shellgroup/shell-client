import React, { PureComponent, Fragment } from 'react';
import {Input, Table, Form, Row, Col, Button} from 'antd';
import 'antd/dist/antd.css';
import styles from './index.less';
const FormItem = Form.Item;
class StandardTableNoCheckBox extends PureComponent {

  constructor(props) {
    super(props);
  }
  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  render() {
    const { data = {}, rowKey, columns } = this.props;
    const { list = [], pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          className={styles.table}
          columns={columns}
          rowKey={rowKey}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTableNoCheckBox;

