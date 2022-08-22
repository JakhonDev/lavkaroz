import React, { useState } from 'react'
import {
    Button,
    PageHeader,
    Collapse,
    List,
    message,
    Space,
    Modal,
    Input,
    Select,
} from 'antd'
import {
    categoryAdd,
    categoryDelete,
    categoryEdit,
    categoryList,
} from '../utils/urls'
import { slugify, postDataF } from '../utils/helpers'
import {
    useDeleteRequest,
    useLoad,
    usePostRequest,
    usePutRequest,
} from '../hooks/request'
const { Panel } = Collapse
const { Option } = Select

const initialPostData = {
    isEdit: false,
    id: null,
    name_uz: '',
    name_ru: '',
    slug: '',
    catImage: '',
    parent_id: null,
}

function Categories() {
    // const [loading, setLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [postData, setPostData] = useState(initialPostData)

    const categoryLoad = useLoad({ url: categoryList })
    const addCategoryRequest = usePostRequest({ url: categoryAdd })
    const updateCategoryRequest = usePutRequest({
        url: categoryEdit.replace('id', postData.id),
    })
    const deleteCategoryRequest = useDeleteRequest({
        url: categoryDelete.replace('id', postData.id),
    })
    const { loading, response } = categoryLoad
    const categories = response && response.categories

    console.log(categories)

    function panelExtra(category) {
        return (
            <Space>
                <Button
                    onClick={() => {
                        setPostData({
                            ...postData,
                            id: category.id,
                            isEdit: true,
                            name_ru: category.name_ru,
                            name_uz: category.name_uz,
                            slug: category.slug,
                            catImage: category.catImage,
                            parent_id: category.parent_id,
                        })
                    }}
                >
                    Edit
                </Button>
                <Button danger onClick={() => deleteCategoryBtn(category.id)}>
                    Delete
                </Button>
            </Space>
        )
    }

    function handleModal(bool) {
        if (!bool) {
            setPostData(initialPostData)
        }
        setModalOpen(bool)
    }

    function handleChange({ target }) {
        if (target.name === 'name_uz') {
            setPostData({
                ...postData,
                [target.name]: target.value,
                slug: slugify(target.value),
            })
        } else {
            setPostData({ ...postData, [target.name]: target.value })
        }
    }
    console.log(postData)

    async function addCategoryBtn() {
        if (postData.name_uz === '') {
            message.warning('Name uz to`ldirilmagan')
        } else if (postData.name_ru === '') {
            message.warning('Name ru to`ldirilmagan')
        } else if (postData.parent_id === null) {
            message.warning('Parent id to`ldirilmagan')
        } else {
            setConfirmLoading(true)
            if (postData.isEdit) {
                const data = postDataF(postData, ['isEdit', 'id'])
                const { success, response } =
                    await updateCategoryRequest.request({
                        data,
                    })
                if (success) {
                    setConfirmLoading(false)
                    handleModal(false)
                    categoryLoad.request()
                    message.success('Categoriya muvofaqqiyatli yangilandi')
                } else {
                    setConfirmLoading(false)
                    message.error(response.data.message)
                }
            } else {
                const data = postDataF(postData, ['isEdit', 'id'])
                const { success, response } = await addCategoryRequest.request({
                    data,
                })
                if (success) {
                    setConfirmLoading(false)
                    handleModal(false)
                    categoryLoad.request()
                    message.success('Categoriya qo`shildi')
                } else {
                    setConfirmLoading(false)
                    message.error(response.data.message)
                }
            }
        }
    }

    async function deleteCategoryBtn(id) {
        setConfirmDeleteLoading(true)
        const { success, response } = await deleteCategoryRequest.request()
        if (success) {
            setConfirmDeleteLoading(false)
            setDeleteModalOpen(false)
            categoryLoad.request()
            message.success('Kategoriya o`chirildi')
        } else {
            setConfirmDeleteLoading(false)
            message.error(response.data.message)
        }
    }

    return (
        <>
            <PageHeader
                title='Categories'
                extra={
                    <Button onClick={() => handleModal(true)}>
                        Add category
                    </Button>
                }
            />

            <Modal
                title='Add category'
                visible={modalOpen}
                onOk={() => addCategoryBtn()}
                okText={postData.isEdit ? 'Edit' : 'Ok'}
                confirmLoading={confirmLoading}
                onCancel={() => handleModal(false)}
            >
                <Space direction='vertical' size='middle'>
                    <Input
                        addonBefore='Name uz'
                        name='name_uz'
                        value={postData.name_uz}
                        onChange={(e) => handleChange(e)}
                    />

                    <Input
                        addonBefore='Name ru'
                        name='name_ru'
                        value={postData.name_ru}
                        onChange={(e) => handleChange(e)}
                    />

                    <Select
                        addonBefore='Parent id'
                        value={postData.parent_id}
                        onChange={(e) =>
                            handleChange({
                                target: { name: 'parent_id', value: e },
                            })
                        }
                    >
                        <Option value={0}>Categories</Option>
                        {categories?.map((item) => {
                            return (
                                <Option key={item.id} value={item.id}>
                                    {item.name_ru}
                                </Option>
                            )
                        })}
                    </Select>
                </Space>
            </Modal>

            <Modal
                title='Kategoriyani o`chirmoqchimisiz'
                visible={deleteModalOpen}
                onOk={deleteCategoryBtn}
                confirmLoading={confirmDeleteLoading}
                onCancel={() => {
                    setPostData({ ...postData, id: null })
                    setDeleteModalOpen(false)
                }}
            ></Modal>

            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <Collapse>
                    {categories?.map((category) => {
                        return (
                            <Panel
                                header={category.name_ru}
                                key={category.id}
                                extra={panelExtra(category)}
                            >
                                <List
                                    bordered
                                    dataSource={category.children}
                                    renderItem={(item) => (
                                        <List.Item actions={[panelExtra(item)]}>
                                            {item.name_ru}
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        )
                    })}
                </Collapse>
            )}
        </>
    )
}

export default Categories
