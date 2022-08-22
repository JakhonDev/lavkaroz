import {
    Button,
    Cascader,
    Col,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Row,
    Select,
    Space,
    Tabs,
    Typography,
    Upload,
} from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useLoad, usePostRequest } from '../hooks/request'
import { attributeList, categoryList, productAdd } from '../utils/urls'
import { PlusOutlined } from '@ant-design/icons'
import {
    imageUpload,
    postDataF,
    postDataWarning,
    slugify,
} from '../utils/helpers'

const { TabPane } = Tabs
const { Option } = Select

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => resolve(reader.result)

        reader.onerror = (error) => reject(error)
    })

const initialPostData = {
    isEdit: false,
    id: null,
    name_uz: '',
    name_ru: '',
    description_uz: '',
    description_ru: '',
    slug: '',
    price: 0,
    quantity: 0,
    previous_price: 0,
    images: "",
    attributes: '[]',
    category_id: null,
    brand_id: 3,
}

function ProductAdd() {
    const navigate = useNavigate()
    const categoriesLoad = useLoad({ url: categoryList })
    const attributesLoad = useLoad({ url: attributeList })
    const categories =
        categoriesLoad?.response && categoriesLoad?.response?.categories

    const attributes =
        attributesLoad?.response && attributesLoad?.response?.attributes
    const addProductRequest = usePostRequest({ url: productAdd })

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState([])
    const [selectedAttributes, setSelectedAttributes] = useState([])

    const [postData, setPostData] = useState(initialPostData)

    const handleCancel = () => setPreviewVisible(false)

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        )
    }

    // const handleImageChange = ({ fileList: newFileList }) => {
    //     setFileList(newFileList)
    // }

    async function uploadImage(e) {
        let image = await imageUpload(e.file)
        setPostData({
            ...postData,
            images: postData.images === "" ? image : postData.images + ',' + image,
        })
        setFileList([
            ...fileList,
            {
                uid:
                    fileList.length > 0
                        ? fileList[fileList.length - 1].uid + 1
                        : 1,
                status: 'done',
                url: await imageUpload(e.file),
            },
        ])
    }

    function handlePostData({ target }) {
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

    async function addProductBtn() {
        const post_data = postDataF(postData, ['isEdit', 'id'])
        for (let item in postDataF(post_data, ['brand_id', 'attributes'])) {
            if (post_data[item] === initialPostData[item]) {
                return message.warning(
                    `Mahsulot ${postDataWarning[item]} kiritilmagan!`
                )
            }
        }

        let { success, response } = await addProductRequest.request({
            data: post_data,
        })
        if (success) {
            setPostData(initialPostData)
            message.success('Mahsulot muvoffaqiyatli qo`shildi')
            navigate('/products')
        } else {
            message.warning(response.data.message)
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    )

    function selectedAttributesHandler(arr) {
        setSelectedAttributes(
            attributes.filter((item) => arr.includes(item.id))
        )
    }
    return (
        <>
            <PageHeader
                title='Product add'
                extra={<Button onClick={() => addProductBtn()}>Add</Button>}
            />
            <Tabs defaultActiveKey='1' tabPosition='left'>
                <TabPane tab='Naming' key='1'>
                    <Tabs defaultActiveKey='1'>
                        <TabPane tab='Uz' key='1'>
                            <Space
                                direction='vertical'
                                style={{ width: '100%' }}
                            >
                                <Input
                                    name='name_uz'
                                    addonBefore='Name uz'
                                    placeholder='name'
                                    value={postData.name_uz}
                                    onChange={(e) => handlePostData(e)}
                                />
                                <ReactQuill
                                    theme='snow'
                                    value={postData.description_uz}
                                    onChange={(e) =>
                                        handlePostData({
                                            target: {
                                                name: 'description_uz',
                                                value: e,
                                            },
                                        })
                                    }
                                />
                            </Space>
                        </TabPane>
                        <TabPane tab='Ru' key='2'>
                            <Space
                                direction='vertical'
                                style={{ width: '100%' }}
                            >
                                <Input
                                    name='name_ru'
                                    addonBefore='Name ru'
                                    placeholder='name'
                                    value={postData.name_ru}
                                    onChange={(e) => handlePostData(e)}
                                />
                                <ReactQuill
                                    theme='snow'
                                    value={postData.description_ru}
                                    onChange={(e) =>
                                        handlePostData({
                                            target: {
                                                name: 'description_ru',
                                                value: e,
                                            },
                                        })
                                    }
                                />
                            </Space>
                        </TabPane>
                    </Tabs>
                </TabPane>
                <TabPane tab='Pricing' key='2'>
                    <Space direction='vertical'>
                        <InputNumber
                            addonBefore='Price'
                            value={postData.price}
                            onChange={(e) =>
                                handlePostData({
                                    target: {
                                        name: 'price',
                                        value: e,
                                    },
                                })
                            }
                        />
                        <InputNumber
                            addonBefore='Quantity'
                            value={postData.quantity}
                            onChange={(e) =>
                                handlePostData({
                                    target: {
                                        name: 'quantity',
                                        value: e,
                                    },
                                })
                            }
                        />
                        <InputNumber
                            addonBefore='Previous Price'
                            value={postData.previous_price}
                            onChange={(e) =>
                                handlePostData({
                                    target: {
                                        name: 'previous_price',
                                        value: e,
                                    },
                                })
                            }
                        />
                    </Space>
                </TabPane>
                <TabPane tab='Categories' key='3'>
                    <Cascader
                        options={categories?.map((category) => {
                            return {
                                value: category.id,
                                label: category.name_uz,
                                children:
                                    category.children.length > 0
                                        ? category.children.map((child) => {
                                              return {
                                                  value: child.id,
                                                  label: child.name_uz,
                                              }
                                          })
                                        : null,
                            }
                        })}
                        onChange={(e) =>
                            handlePostData({
                                target: {
                                    name: 'category_id',
                                    value: e[e.length - 1],
                                },
                            })
                        }
                        placeholder='Please select'
                    />
                </TabPane>
                <TabPane tab='Images' key='4'>
                    <>
                        <Upload
                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                            listType='picture-card'
                            fileList={fileList}
                            onPreview={handlePreview}
                            // onChange={handleImageChange}
                            customRequest={(file) => uploadImage(file)}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img
                                alt='example'
                                style={{
                                    width: '100%',
                                }}
                                src={previewImage}
                            />
                        </Modal>
                    </>
                </TabPane>
                <TabPane tab='Attributes' key='5'>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Select
                            mode='multiple'
                            style={{
                                width: '100%',
                            }}
                            placeholder='select attribute'
                            onChange={(e) => selectedAttributesHandler(e)}
                        >
                            {attributes.map((attribute) => {
                                return (
                                    <Option
                                        value={attribute.id}
                                        key={attribute.id}
                                    >
                                        {attribute.name_ru}
                                    </Option>
                                )
                            })}
                        </Select>

                        <Row gutter={16}>
                            {selectedAttributes.map((attribute) => {
                                return (
                                    <Col key={attribute.id} span={6}>
                                        <Typography>
                                            {attribute.name_ru}
                                        </Typography>
                                        <Select placeholder='select attribute value'>
                                            {attribute.attributeValues.map(
                                                (value) => {
                                                    return (
                                                        <Option
                                                            key={value.id}
                                                            value={value.id}
                                                        >
                                                            {value.value_ru}
                                                        </Option>
                                                    )
                                                }
                                            )}
                                        </Select>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Space>
                </TabPane>
            </Tabs>
        </>
    )
}

export default ProductAdd
