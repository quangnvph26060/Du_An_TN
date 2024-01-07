import React from "react";
import { Form, Button, Input, Upload, Checkbox, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAddLoaiTourMutation } from "../../../../api/LoaiTourApi";
import { ILoaiTour } from "../../../../interface/loaiTour";
import moment from 'moment';

const AdminLoai_tourADD: React.FC = () => {
  const [addLoaiTour] = useAddLoaiTourMutation();
  const navigate = useNavigate();

  const onFinish = (values: ILoaiTour) => {
    const formData = new FormData();
    formData.append("hinh", values.hinh.fileList[0].originFileObj);
    formData.append("ten_loai_tour", values.ten_loai_tour);
    formData.append("thoi_gian", moment().format()); // Thêm các trường dữ liệu khác vào formData (nếu cần)
    formData.append("trang_thai", values.trang_thai);

    addLoaiTour(formData)
      .unwrap()
      .then(() => navigate("/admin/tour/loai_tour"))
      .catch((error) => {
        console.log(error);
        // Xử lý lỗi (nếu có)
      });

    console.log(values);
  };

  return (
    <div className="container">
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Tạo mới tour</h2>
      </header>
      <Form
        className="tour-form"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Image"
          name="hinh"
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
        >
          <Upload
            accept="image/*"
            listType="picture"
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />} type="button">
              Chọn ảnh
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Tên loại tour"
          name="ten_loai_tour"
          rules={[
            { required: true, message: "Vui lòng nhập tên loại tour!" },
            { min: 3, message: "Tên tour ít nhất 3 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="w-full"
          label="Trạng thái"
          name="trang_thai"
          rules={[
            { required: true, message: "Vui lòng chọn checkout!" },
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }} defaultValue={[1]}>
            <Space direction="vertical">
              <Checkbox value={1}>Kích hoạt</Checkbox>
              <Checkbox value={0}>Vô hiệu hóa</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
          <Button
            type="default"
            className="ml-2"
            onClick={() => navigate("/admin/tour/loai_tour")}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLoai_tourADD;
