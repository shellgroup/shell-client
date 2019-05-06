import React, { Component, Suspense } from 'react';
import { connect } from 'dva';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));

@connect(({ chart, dataFilter, ranking, loading }) => ({
  chart,
  dataFilter,
  ranking,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('today'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
    dispatch({
      type: 'dataFilter/WxUserInfoByDataFilter',
    });
    const { rangePickerValue } = this.state;
    this.queryRankingMsg(rangePickerValue);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };
  //排序
  queryRankingMsg = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'ranking/queryRankingMsg',
      payload: {
        createBeginTime:rangePickerValue[0].format('YYYY-MM-DD HH:mm:ss'),
        createEndTime:rangePickerValue[1].format('YYYY-MM-DD HH:mm:ss')
      },
      callback: res => {
        //tips(res);
      },
    });
  };
  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {

    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    this.queryRankingMsg(getTimeDistance(type));
  };

  isActive = type => {

    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading, dataFilter, ranking } = this.props;
    const { salesData } = chart;
    let { resultMap } = dataFilter;
    let { result } = ranking;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} resultMap={resultMap} />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={salesData}
            rankingListData={result}
            isActive={this.isActive}
            queryRankingMsg={this.queryRankingMsg}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>

      </GridContent>
    );
  }
}

export default Analysis;









