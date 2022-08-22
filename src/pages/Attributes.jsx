import React, { useState } from 'react'
import {
    Button,
    Card,
    Col,
    Collapse,
    Input,
    List,
    message,
    Modal,
    PageHeader,
    Row,
    Select,
    Space,
} from 'antd'
import {
    useDeleteRequest,
    useLoad,
    usePostRequest,
    usePutRequest,
} from '../hooks/request'
import { postDataF, slugify } from '../utils/helpers'
import $host from '../utils/https'
import {
    attributeAdd,
    attributeDelete,
    attributeList,
    attributeUpdate,
    attributeValueAdd,
    attributeValueDelete,
    attributeValueUpdate,
} from '../utils/urls'
import FullPageLoader from '../components/FullPageLoader'
const { Option } = Select
const { Panel } = Collapse

const initialAttributeState = {
    id: null,
    isEdit: false,
    name_uz: '',
    name_ru: '',
    slug: '',
    is_filterable: 0,
}

const initialAttributeValueState = {
    id: null,
    isEdit: false,
    value_uz: '',
    value_ru: '',
    parent_id: null,
}

function Attributes() {
    const [attribute, setAttribute] = useState(initialAttributeState)
    const [attributeValue, setAttributeValue] = useState(
        initialAttributeValueState
    )

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        loading: false,
        isValue: false,
    })

    const attributesLoad = useLoad({ url: attributeList })
    const addAttributeRequest = usePostRequest({ url: attributeAdd })
    const { loading, response } = attributesLoad
    const attributes = response && response?.attributes
    const deleteAttributeRequest = useDeleteRequest({
        url: attributeDelete.replace('id', attribute.id),
    })
    const deleteAttributeValueRequest = useDeleteRequest({
        url: attributeValueDelete.replace('id', attributeValue.id),
    })
    const editAttributeRequest = usePutRequest({
        url: attributeUpdate.replace('id', attribute.id),
    })
    const addAttributeValueRequest = usePostRequest({
        url: attributeValueAdd.replace('id', attributeValue.parent_id),
    })
    const updateAttributeValueRequest = usePutRequest({
        url: attributeValueUpdate.replace('id', attributeValue.id),
    })

    function handleChange({ target }) {
        if (target.name === 'name_uz') {
            setAttribute({
                ...attribute,
                [target.name]: target.value,
                slug: slugify(target.value),
            })
        } else {
            setAttribute({ ...attribute, [target.name]: target.value })
        }
    }

    function handleValueChange({ target }) {
        setAttributeValue({ ...attributeValue, [target.name]: target.value })
    }

    function panelExtra(attribute, isValue) {
        return (
            <Space>
                <Button onClick={() => {}}>Edit</Button>
                <Button
                    danger
                    onClick={() => deleteBtnHandler(attribute, isValue)}
                >
                    Delete
                </Button>
            </Space>
        )
    }

    function deleteBtnHandler(attribute, isValue) {
        if (isValue) {
            setAttributeValue({
                ...attributeValue,
                id: attribute.id,
            })
            setDeleteModal({
                ...deleteModal,
                open: true,
                isValue: true,
            })
        } else {
            setAttribute({
                ...attribute,
                id: attribute.id,
            })
            setDeleteModal({
                ...deleteModal,
                open: true,
            })
        }
    }

    function editBtnHandler(attribute, isValue) {
        if (isValue) {
            setAttributeValue({
                ...attributeValue,
                id: attribute.id,
                isEdit: true,
                value_uz: attribute.value_uz,
                value_ru: attribute.value_ru,
                parent_id: attribute.attribute_id,
            })
        } else {
            setAttribute({
                id: attribute.id,
                isEdit: true,
                name_uz: attribute.name_uz,
                name_ru: attribute.name_ru,
                slug: attribute.slug,
                is_filterable: attribute.is_filterable,
            })
        }
    }

    async function addAttributeBtn() {
        if (attribute.name_uz === '') {
            message.warning('Name uz kiritilmagan!')
        } else if (attribute.name_ru === '') {
            message.warning('Name ru kiritilmagan!')
        } else {
            const { success, response } = attribute.isEdit
                ? await editAttributeRequest.request({
                      data: postDataF(attribute, ['isEdit', 'id']),
                  })
                : await addAttributeRequest.request({
                      data: postDataF(attribute, ['isEdit', 'id']),
                  })
            if (success) {
                setAttribute(initialAttributeState)
                attributesLoad.request()
                message.success('Attribute qo`shildi')
            } else {
                message.warning(response.data.message)
            }
        }
    }

    async function deleteAttributeBtn() {
        setDeleteModal({ ...deleteModal, loading: true })

        const { success, response } = deleteModal.isValue
            ? await deleteAttributeValueRequest.request()
            : await deleteAttributeRequest.request()
        if (success) {
            setDeleteModal({ open: false, loading: false, isValue: false })
            attributesLoad.request()
            message.success('Attribute muvoffaqiytli o`chirildi')
        } else {
            setDeleteModal({ open: false, loading: false, isValue: false })
            message.success(response.data.message)
        }
    }

    async function addAttributeValueBtn() {
        if (attribute.value_uz === '') {
            message.warning('Name uz kiritilmagan!')
        } else if (attribute.value_ru === '') {
            message.warning('Name ru kiritilmagan!')
        } else if (attribute.parent_id === null) {
            message.warning('Parent id kiritilmagan!')
        } else {
            const { success, response } = attributeValue.isEdit
                ? await updateAttributeValueRequest.request({
                      data: postDataF(attributeValue, [
                          'isEdit',
                          'id',
                          'parent_id',
                      ]),
                  })
                : await addAttributeValueRequest.request({
                      data: postDataF(attributeValue, [
                          'isEdit',
                          'id',
                          'parent_id',
                      ]),
                  })

            if (success) {
                setAttributeValue(initialAttributeValueState)
                attributesLoad.request()
                message.success('Attribut qo`shildi')
            } else {
                message.warning(response.data.message)
            }
        }
    }

    return (
        <>
            <PageHeader title='Attributes' />

            <Modal
                title='Attributni o`chirmoqchimisiz'
                visible={deleteModal.open}
                onOk={deleteAttributeBtn}
                confirmLoading={deleteModal.loading}
                onCancel={() => {
                    setDeleteModal({ open: false, loading: false })
                }}
            ></Modal>

            {loading ? (
                <FullPageLoader />
            ) : (
                <Space
                    direction='vertical'
                    style={{ width: '100%' }}
                    size='large'
                >
                    <Row justify='space-between'>
                        <Col span={8}>
                            <Card
                                title='Attribute create'
                                style={{ width: '100%' }}
                            >
                                <Space
                                    style={{ width: '100%' }}
                                    direction='vertical'
                                >
                                    <Input
                                        addonBefore='Name uz'
                                        name='name_uz'
                                        value={attribute.name_uz}
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                    />

                                    <Input
                                        addonBefore='Name ru'
                                        name='name_ru'
                                        value={attribute.name_ru}
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                    />

                                    <Row justify='space-between'>
                                        <Button
                                            style={{ width: '48%' }}
                                            onClick={() =>
                                                setAttribute(
                                                    initialAttributeState
                                                )
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type='primary'
                                            style={{ width: '48%' }}
                                            onClick={() => addAttributeBtn()}
                                        >
                                            {attribute.isEdit
                                                ? 'Edit attribute'
                                                : 'Add attribute'}
                                        </Button>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title='Attribute value create'
                                style={{ width: '100%' }}
                            >
                                <Space
                                    style={{ width: '100%' }}
                                    direction='vertical'
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        value={attributeValue.parent_id}
                                        onChange={(e) =>
                                            handleValueChange({
                                                target: {
                                                    name: 'parent_id',
                                                    value: e,
                                                },
                                            })
                                        }
                                    >
                                        {attributes?.map((item) => {
                                            return (
                                                <Option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name_ru}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Input
                                        addonBefore='Value uz'
                                        name='value_uz'
                                        value={attributeValue.value_uz}
                                        onChange={(e) => {
                                            handleValueChange(e)
                                        }}
                                    />

                                    <Input
                                        addonBefore='Value ru'
                                        name='value_ru'
                                        value={attributeValue.value_ru}
                                        onChange={(e) => {
                                            handleValueChange(e)
                                        }}
                                    />

                                    <Row justify='space-between'>
                                        <Button
                                            style={{ width: '48%' }}
                                            onClick={() =>
                                                setAttributeValue(
                                                    initialAttributeValueState
                                                )
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type='primary'
                                            style={{ width: '48%' }}
                                            onClick={() =>
                                                addAttributeValueBtn()
                                            }
                                        >
                                            {attributeValue.isEdit
                                                ? 'Edit attribute'
                                                : 'Add attribute'}
                                        </Button>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Collapse>
                                {attributes?.map((attribute) => {
                                    return (
                                        <Panel
                                            header={attribute.name_ru}
                                            key={attribute.id}
                                            extra={panelExtra(attribute, false)}
                                        >
                                            <List
                                                bordered
                                                dataSource={
                                                    attribute.attributeValues
                                                }
                                                renderItem={(item) => (
                                                    <List.Item
                                                        actions={[
                                                            panelExtra(
                                                                item,
                                                                true
                                                            ),
                                                        ]}
                                                    >
                                                        {item.value_ru}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                    )
                                })}
                            </Collapse>
                        </Col>
                    </Row>
                </Space>
            )}
        </>
    )
}

export default Attributes
