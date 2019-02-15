import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Modal,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DictionaryManager.less';
import { tips, disablesBtns, showDeleteConfirmParames } from '../../utils/utils';
/**
 * 字典管理
 * */
const showDeleteTipsParames = showDeleteConfirmParames();
const confirm = Modal.confirm;

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
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
      title="新增字典"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: false, message: '请输入名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: false, message: '请输入类型！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典码">
        {form.getFieldDecorator('code', {
          rules: [{ required: false, message: '请输入字典码！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典值">
        {form.getFieldDecorator('value', {
          rules: [{ required: false, message: '请输入字典值！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('orderNum', {
          rules: [{ required: false, message: '请输入排序！'}],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '请输入备注！'}],
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
        code: props.values.code,
        delFlag: props.values.delFlag,
        id: props.values.id,
        name: props.values.name,
        orderNum: props.values.orderNum,
        remark: props.values.remark,
        type: props.values.type,
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
      handleUpdate,
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
        title="更新字典"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('id', {
          rules: [{ required: false }],
          initialValue: formVals.id,
        })(<Input type={'hidden'} />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: false, message: '请输入名称！'}],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: false, message: '请输入类型！'}],
            initialValue: formVals.type,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典码">
          {form.getFieldDecorator('code', {
            rules: [{ required: false, message: '请输入字典码！'}],
            initialValue: formVals.code,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典值">
          {form.getFieldDecorator('value', {
            rules: [{ required: false, message: '请输入字典值！'}],
            initialValue: formVals.value,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
          {form.getFieldDecorator('orderNum', {
            rules: [{ required: false, message: '请输入排序！'}],
            initialValue: formVals.orderNum,
          })(<InputNumber min={0} placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [{ required: false, message: '请输入备注！'}],
            initialValue: formVals.remark,
          })(<Input placeholder="请输入" />)}
        </FormItem>

      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ dictionary, loading }) => ({
  dictionary,
  loading: loading.models.dictionary,
}))
@Form.create()
class DictionaryManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'id',
    DeleteBtn: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <Button type={'primary'} onClick={() => this.handleUpdateModalVisible(true, record)}>修改</Button>
          <Divider type="vertical" />
          <Button type={'primary'} onClick={() => this.showDeleteConfirm(record)}>删除</Button>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionary/fetch',
    });
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
      type: 'dictionary/fetch',
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
      type: 'dictionary/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //删除参数信息
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
      type: 'dictionary/remove',
      payload: [record.id],
      callback: res => {
        tips(res, this, 'dictionary/fetch');
      },
    });
  };
  //批量删除
  showDeletesConfirm = () => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.handleMenuClick();
      },
      onCancel() {
        that.setState({
          selectedRows: [],
        });
      },
    });
  };
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'dictionary/remove',
      payload: selectedRows.map(row => row.id),
      callback: res => {
        tips(res, this, 'dictionary/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });
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
        name: fieldsValue.name,
        type: fieldsValue.type,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dictionary/fetch',
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
      type: 'dictionary/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'dictionary/fetch');
      },
    });

    this.handleModalVisible();
  };


  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionary/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'dictionary/fetch');
      },
    });


    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      dictionary: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, ShowList } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.state.SaveBtn && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
              {selectedRows.length > 0 && this.state.DeleteBtn && (
                <span>
                  <Button onClick={this.showDeletesConfirm}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              bordered={true}
              data={data}
              tableAlert={true}
              data={ShowList ? data : {}}
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

export default DictionaryManager;
