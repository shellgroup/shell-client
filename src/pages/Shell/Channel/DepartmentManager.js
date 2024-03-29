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
import {tips, disablesBtns, showDeleteConfirmParames, child, regs} from '../../../utils/utils';
const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;
import styles from './DepartmentManager.less';

/**
 * 渠道商管理
 * */

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    deptData,
    configName,
    isExitDeptNameWhenAdd,
    that
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  let formConfigName = {};
  if(configName){
    formConfigName = {
      validateStatus:"error",
      help:"渠道商名称已存在！"
    }
  }
  return (
    <Modal
      destroyOnClose
      title="新增渠道商"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="渠道商名称"
        {...formConfigName}
      >
        {form.getFieldDecorator('name', {
          rules: [
            { required: true, message: '请输入您的渠道商名称!'}
          ],
        })(<Input placeholder="请输入" onBlur={isExitDeptNameWhenAdd} onChange={that.parseVaule} maxLength={30}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级渠道商">
        {form.getFieldDecorator('parentId', {
          rules: [{ required: true, message: '请选择上级渠道商！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(deptData)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择渠道商"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="渠道推广码">
        {form.getFieldDecorator('deptCode', {
          rules: [{ required: true, message: '请输入您的渠道推广码！' }],
        })(<Input placeholder="请输入" onChange={that.parseVaule} maxLength={100}/>)}
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
        deptCode: props.values.deptCode,
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
      configName,
      isExitDeptNameWhenUpdate,
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
    let formConfigName = {};
    if(configName){
      formConfigName = {
        validateStatus:"error",
        help:"渠道商名称已存在！"
      }
    }
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新渠道商"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('deptId', {
          rules: [{ required: false }],
          initialValue: formVals.deptId,
        })(<Input type={'hidden'} />)}

        <FormItem {...this.formLayout} label="渠道商名称" {...formConfigName} >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入您的渠道商名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" data-id={formVals.deptId} onBlur={isExitDeptNameWhenUpdate} onChange={that.parseVaule} maxLength={30}/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="上级渠道商">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: false, message: '请选择上级渠道商！' }],
            initialValue: formVals.parentId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择渠道商"
              // onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="渠道推广码">
          {form.getFieldDecorator('deptCode', {
            rules: [{ required: true, message: '请输入您的渠道推广码！' }],
            initialValue: formVals.deptCode,
          })(<Input placeholder="请输入" onChange={that.parseVaule} maxLength={100}/>)}
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
    deptData: [], //渠道商树菜单数据
    DeleteBtn: false,
    configName: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
  };

  columns = [
    {
      title: '渠道商名称',
      dataIndex: 'name',
    },
    {
      title: '上级渠道商',
      dataIndex: 'parentName',
      align:'center',
    },
    {
      title: '渠道推广码',
      dataIndex: 'deptCode',
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



  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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

  isExitDeptNameWhenAdd = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'channelUpdate/isExitDeptNameWhenAdd',
      payload: {
        deptName: e.target.value.replace(/\s/g,"")
      },
      callback: res => {

        let us = false;
        if(res == "exist"){
          us = true;
        }
        this.setState({
          configName: us,
        });
        dispatch({
          type: 'channel/fetch',
        });
      },
    });
  };
  //过滤空格
  parseVaule = e =>{
    let str = e.target.value;
    return e.target.value = regs(str,2);
  };
  isExitDeptNameWhenUpdate = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'channelUpdate/isExitDeptNameWhenUpdate',
      payload: {
        deptId:e.currentTarget.getAttribute("data-id"),
        deptName: e.target.value.replace(/\s/g,"")
      },
      callback: res => {

        let us = false;
        if(res == "exist"){
          us = true;
        }
        this.setState({
          configName: us,
        });
        dispatch({
          type: 'channel/fetch',
        });
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
    fields.name = fields.name.replace(/\s/g,"");
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
    fields.name = fields.name.replace(/\s/g,"");
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

  //删除渠道商信息
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
    const { selectedRows, modalVisible, updateModalVisible, configName, stepFormValues,deptData, key, ShowList } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      deptData: deptData,
      configName:configName,
      isExitDeptNameWhenAdd:this.isExitDeptNameWhenAdd,
      that:this
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      deptData: deptData,
      configName:configName,
      isExitDeptNameWhenUpdate:this.isExitDeptNameWhenUpdate,
      that:this
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
