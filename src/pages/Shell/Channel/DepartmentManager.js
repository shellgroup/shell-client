import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Modal,
  Divider,
  TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child } from '../../../utils/utils';
const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;
import styles from './DepartmentManager.less';

/**
 * 服务商管理
 * */

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, deptData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新增服务商"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务商名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入您的服务商名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级服务商">
        {form.getFieldDecorator('parentId', {
          rules: [{ required: false, message: '请选择上级服务商！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(deptData)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择服务商"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排&emsp;&emsp;序">
        {form.getFieldDecorator('orderNum', {
          rules: [{ required: false }],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        children: props.values.children,
        delFlag: props.values.delFlag,
        deptId: props.values.deptId,
        key: props.values.key,
        name: props.values.name,
        open: props.values.open,
        orderNum: props.values.orderNum,
        parentId: props.values.parentId,
        parentName: props.values.parentName,
        title: props.values.title,
        value: props.values.value,
      },
      currentStep: 0,
      confirmDirty: false,
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      roleData,
      deptData,
      handleUpdate,
      that,
    } = this.props;
    const { formVals } = this.state;
    const { form } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新服务商"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('deptId', {
          rules: [{ required: false }],
          initialValue: formVals.deptId,
        })(<Input type={'hidden'} />)}

        <FormItem {...this.formLayout} label="服务商名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入您的服务商名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="上级服务商">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: false, message: '请选择上级服务商！' }],
            initialValue: formVals.parentId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择服务商"
              // onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="排&emsp;&emsp;序">
          {form.getFieldDecorator('orderNum', {
            rules: [{ required: false }],
            initialValue: formVals.orderNum,
          })(<InputNumber min={0} placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ channel, loading }) => ({
  channel,
  loading: loading.models.channel,
}))
@Form.create()
class DepartmentManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'deptId',
    deptData: [], //服务商树菜单数据
    DeleteBtn: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
  };

  columns = [
    {
      title: '服务商名称',
      dataIndex: 'name',
    },
    {
      title: '上级服务商',
      dataIndex: 'parentName',
      align:'center',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      align:'center',
    },
    {
      title: '操作',
      align:'center',
      width: 200,
      render: (text, record) => (
        <Fragment>
          {this.state.UpdateBtn && (
            <Button type={'primary'} onClick={() => this.handleUpdateModalVisible(true, record)}>
              修改
            </Button>
          )}
          {this.state.UpdateBtn && this.state.DeleteBtn && <Divider type="vertical" />}
          {this.state.DeleteBtn && (
            <Button type={'primary'} onClick={() => this.showDeleteConfirm(record)}>
              删除
            </Button>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: res.list,
          });
        }
      },
    });
    //调用utils里面的disablesBtns方法判断是否有权限
    disablesBtns(this);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'channel/fetch',
      payload: params,
    });
  };




  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'channel/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: res.list,
            modalVisible: !!flag,
          });
        }
      },
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    if (!fields.parentId) {
      fields.parentId = 0;
    }
    dispatch({
      type: 'channel/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'channel/fetch');
      },
    });


    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'channel/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });

    this.handleUpdateModalVisible();
  };

  //删除服务商信息
  showDeleteConfirm = record => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.deleted(record);
      },
      onCancel() {
      },
    });
  };
  deleted = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/remove',
      payload: record.deptId,
      callback: res => {
        tips(res, this, 'channel/fetch');
      },
    });
  };


  render() {
    const {
      channel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,deptData, key, ShowList } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      deptData: deptData,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      deptData: deptData,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} />
            <div className={styles.tableListOperator}>
              {this.state.SaveBtn && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              rowSelection={null}
              bordered={true}
              tableAlert={false}
              data={ShowList?data:{}}
              rowKey={key}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default DepartmentManager;
