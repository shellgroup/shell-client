import React, { PureComponent, Fragment } from 'react';
import { TreeSelect } from 'antd';
import styles from './index.less';

const treeData = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    title: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
}];

class TreeSeltctInput extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      value: undefined
    }
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ value });
  }

  render() {
    //const { treeData } = this.props;
    const { placeholder } = this.props;
    return (
      <TreeSelect
        className={styles.width}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        dropdownMatchSelectWidth={false}
        placeholder={placeholder}
        treeDefaultExpandAll
        onChange={this.onChange}
      />
    );
  }
}

export default TreeSeltctInput;
