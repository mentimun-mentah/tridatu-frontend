import { useState } from 'react'
import { Form, Input, Select, InputNumber, Divider, Button, Cascader, Space, Upload, DatePicker } from 'antd'

import dynamic from 'next/dynamic'
import Card from 'react-bootstrap/Card'

import { formImage } from 'formdata/formImage'
import { imageValidation, uploadButton } from 'lib/imageUploader'

import { productsData } from 'data/products'

import AddStyleAdmin from 'components/Admin/addStyle'

const Editor = dynamic(import('../../../components/Editor'), { ssr: false })

const NewPromo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [imageList, setImageList] = useState(formImage)

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Rincian Dasar</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form form={form} layout="vertical">
            <Form.Item label="Nama Voucher" required>
              <Input placeholder="Nama Voucher" />
            </Form.Item>

            <Form.Item label="Kode Voucher" required>
              <Input placeholder="Kode Voucher" />
            </Form.Item>
            
            <Form.Item label="Periode Klaim Voucher" required>
              <DatePicker.RangePicker />
            </Form.Item>

            <Form.Item label="Deskripsi Voucher" required>
              <Input placeholder="Deskripsi Voucher" />
            </Form.Item>

            <Form.Item label="Diskon" required>
              <InputNumber
                className="w-100"
                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
              />
            </Form.Item>

            <Form.Item label="Minimum Pembelian" required>
              <InputNumber
                className="w-100"
                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
              />
            </Form.Item>

            <Form.Item label="Produk yang Berlaku">
              <Select
                showSearch
                placeholder="Cari Produk"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {productsData.map(val => (
                  <Select.Option value={val} key={val}>{val}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Syarat dan Ketentuan">
              <Editor 
                initialValue=""
                setContent={() => {}} 
                height="200"
              />
            </Form.Item>

          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Media</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form form={form} layout="vertical">

            <Form.Item label="Foto Thumbnail Card Voucher (600 × 328 px)" className="mb-2" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                fileList={imageList.file.value}
                beforeUpload={(file) => imageValidation(file, "www.google.com", "avatar", "formHeader")}
              >
                {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Form.Item>

            <Form.Item label="Foto Detail Voucher (1275 × 320 px)" className="mb-0" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                fileList={imageList.file.value}
                beforeUpload={(file) => imageValidation(file, "www.google.com", "avatar", "formHeader")}
              >
                {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Form.Item>

          </Form>
        </Card.Body>
      </Card>

      <Space>
        <Button className="btn-tridatu">Simpan</Button>
        <Button>Batal</Button>
      </Space>

      <style jsx>{AddStyleAdmin}</style>
    </>
  )
}

export default NewPromo
