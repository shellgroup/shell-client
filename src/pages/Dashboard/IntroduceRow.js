import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, resultMap }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={<FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => <div>{`${numeral(resultMap.totle).format('0,0')}人`}</div>}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Daily Sales" />}
            value={`${numeral(resultMap.todayTotle).format('0,0')}人`}
          />
        }
        contentHeight={46}
      >
        <Trend flag={resultMap.weekPercentage>0?"up":resultMap.weekPercentage<0?"down":""}>
          <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>{resultMap.weekPercentage && resultMap.weekPercentage!="无" || resultMap.weekPercentage==0?`${Number(resultMap.weekPercentage).toFixed(2)}%`:"无"}</span>
        </Trend>
        <Trend style={{marginLeft:20}} flag={resultMap.dayPercentage>0?"up":resultMap.dayPercentage<0?"down":""}>
          <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
          <span className={styles.trendText}>{resultMap.dayPercentage && resultMap.dayPercentage!="无" || resultMap.dayPercentage==0?`${Number(resultMap.dayPercentage).toFixed(2)}%`:"无"}</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={''}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            {/*<Icon type="info-circle-o" />*/}
          </Tooltip>
        }
        total={''}
        footer={
          <Field
            label={''}
            value={''}
          />
        }
        contentHeight={46}
      >
        <div className={styles.defaultText}>内容待添加</div>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={''}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            {/*<Icon type="info-circle-o" />*/}
          </Tooltip>
        }
        total={''}
        footer={
          <Field
            label={''}
            value={''}
          />
        }
        contentHeight={46}
      >
        <div className={styles.defaultText}>内容待添加</div>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={''}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            {/*<Icon type="info-circle-o" />*/}
          </Tooltip>
        }
        total={''}
        footer={
          <Field
            label={''}
            value={''}
          />
        }
        contentHeight={46}
      >
        <div className={styles.defaultText}>内容待添加</div>
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
