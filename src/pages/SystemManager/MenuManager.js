import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio, TreeSelect,
} from 'antd';
import TreeTableNoCheckBox from '@/components/TreeTableNoCheckBox';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child, menuChild } from '../../utils/utils';
import styles from './MenuManager.less';
const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['normal', 'disabled'];
const status = ['正常', '停用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, statusMenuText, statusValue, deptData, menuList } = props;
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
      title="新增菜单&按钮"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="型&emsp;类">
        {form.getFieldDecorator('status', {
          rules: [{ required: false }],
          initialValue: statusValue,
        })(
          <RadioGroup>
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
            <Radio value={0}>目录</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入菜单名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择父级菜单！' }],
          initialValue: statusMenuText,
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(menuList)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择父级菜单"
            //onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路&emsp;&emsp;由">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少8个字符的用户名！', min: 8 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排&emsp;&emsp;序">
        {form.getFieldDecorator('orderNum', {
          rules: [{ required: false }],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权标识">
        {form.getFieldDecorator('desc', {
          rules: [{ required: false, message: '请输入授权标识！', min: 8 }],
        })(<Input placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图&emsp;&emsp;标">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少8个字符的用户名！', min: 8 }],
        })(<Input placeholder="请输入" />)}
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
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };
}

/* eslint react/no-multi-comp:0 */
@connect(({ menulist, loading }) => ({
  menulist,
  loading: loading.models.menulist,
}))
@Form.create()
class MenuManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'menuId',
    DeleteBtn: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    statusMenuText:"父级菜单",
    statusValue:1,
    menuList:[],
    deptData:[]
  };

  columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '图标',
      render: record => (record.icon !=null && (<Icon type={record.icon} />)),
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '路由',
      dataIndex: 'path',
    },
    {
      title: '授权标识',
      dataIndex: 'perms',
    },
    {
      title: '操作',
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
      type: 'menulist/fetch',
    });
    dispatch({
      type: 'dept/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: child(res.list),
          });
        }
      },
    });
    dispatch({
      type: 'menu/getMenuData',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            menuList: menuChild(res.list),
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
      type: 'menulist/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'menulist/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'menulist/remove',
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

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'menulist/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
    dispatch({
      type: 'menulist/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menulist/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      menulist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, statusMenuText, statusValue, deptData, menuList} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      statusMenuText: statusMenuText,
      statusValue: statusValue,
      menuList: menuList,
      deptData: deptData

    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
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
            <TreeTableNoCheckBox
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey={this.state.key}
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

export default MenuManager;
