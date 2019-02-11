import React, { PureComponent, Fragment } from 'react';
import { baseURL } from '../../services/baseurl';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './DruidSql.less';
/**
 * SQL监控
 * */
class DruidSql extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} />
            <div className={styles.box}>
              <iframe src={`${baseURL}/druid/sql.html`} className={styles.iheight} />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DruidSql;
