import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Form, Button, Input, DatePicker, Select, TextArea, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { UploadOutlined } from "@ant-design/icons";
import { useGetLoaiTourQuery } from "../../../../api/LoaiTourApi";
import { useGetHuongDanVienQuery } from "../../../../api/HuongDanVienApi";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ITour } from "../../../../interface/tour";
import "../../../css.css";
import { useGetTourQuery, useEditTourMutation, useGetTourByIdQuery } from "../../../../api/TourApi";
const { Option } = Select;

const AdminTourEdit = () => {
  const navigate = useNavigate();
  const [editorData, setEditorData] = useState('');
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };
  const [provinces, setProvinces] = useState([]);
  const [provinces2, setProvinces2] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const dateFormat = "DD-MM-YYYY";
  const { data: loaitourdata } = useGetLoaiTourQuery();
  const { data: huongdanviendata } = useGetHuongDanVienQuery();
  const loaitourArrary = loaitourdata?.data || [];
  const huongdanvienArrary = huongdanviendata?.data || [];
  const { idtour } = useParams<{ idtour: any }>();
  const { data: TourData } = useGetTourByIdQuery(idtour || "");
  const Tour = TourData || {};
  console.log(Tour);

  const [selectedDate, setSelectedDate] = useState(null);
  const [updateTour] = useEditTourMutation();
  const [imageList, setImageList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [form] = Form.useForm();
  const [imageButtonClass, setImageButtonClass] = useState("");
  const [ButtonImage, setButtonImage] = useState("");
  const handleButtonClick = () => {
    // Thêm class mới khi button được click
    setImageButtonClass("new-class");
    setButtonImage("add-class");
  };

  useEffect(() => {
    if (Tour && Tour.data && Tour.data.image_path) {
      const fileList = Tour.data.image_path.map((image, index) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url: `http://localhost:8000/storage/${image}`, // Thay thế bằng domain và đường dẫn thực tế của bạn
      }));
      setImageList(fileList);
    }
    if (Tour && Tour.data && Tour.data.mo_ta) {
      setEditorData(Tour.data.mo_ta);
    }
    fetch('https://provinces.open-api.vn/api/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu từ API');
        }
        return response.json();
      })
      .then((data) => {
        setProvinces(data);
        setProvinces2(data)
      })
      .catch((error) => {
        console.error(error);
      });
    if (Tour && Tour.data && Tour.data.diem_di && Tour.data.mo_ta && Tour.data.diem_den
      && Tour.data.ten_tour && Tour.data.ngay_ket_thuc &&
      Tour.data.lich_khoi_hanh && Tour.data.soluong

    ) {
      form.setFieldsValue({
        diem_di: Tour.data.diem_di,
        mo_ta: Tour.data.mo_ta,
        diem_den: Tour.data.diem_den,
        ma_loai_tour: Tour.data.ma_loai_tour,
        ten_hdv: Tour.data.ten_hdv,
        ten_tour: Tour.data.ten_tour,

        ngay_ket_thuc: Tour.data.ngay_ket_thuc,
        lich_khoi_hanh: Tour.data.lich_khoi_hanh,
        soluong: Tour.data.soluong,

      });

    }


    if (Tour && Tour.data && Tour.data.image_path) {
      const fileList = Tour.data.image_path.map((image, index) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url: `http://localhost:8000/storage/${image}`, // Thay thế bằng domain và đường dẫn thực tế của bạn
      }));
      setImageList(fileList);
    }
  }
    , [Tour, form]);



  const handleChange = (value) => {
    setSelectedValue(value);
    const filteredOptions = provinces2.filter((option) => option.name !== value);
    setProvinces2(filteredOptions);
  };



  const onFinish = (values: ITour) => {
    updateTour({ ...values, id: idtour })
      .unwrap()
      .then(() => navigate("/admin/tour/"))
      .catch((error) => {
        setErrors(error.data.message);
        setLoading(false);
      });
  };
  const disabledDate = (current) => {
    // Get the current date
    const currentDate = new Date();

    // Disable dates before the current date
    return current && current < currentDate.setHours(0, 0, 0, 0);
  };
  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Edit tour</h2>
      </header>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}

        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Tên tour"
          name="ten_tour"
          rules={[
            { required: true, message: "Vui lòng nhập tên tour!" },
            { min: 3, message: "Tên tour ít nhất 3 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ảnh đại diện"
          name="image"
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
          {/* Hiển thị ảnh đại diện nếu có dữ liệu từ API */}
          {Tour && Tour.data && Tour.data.image_dd && (
            <img src={`http://localhost:8000/storage/${Tour.data.image_dd}`} alt="Ảnh đại diện" style={{ width: '200px', marginTop: '10px' }} />
          )}
        </Form.Item>
        <Form.Item
          label="Ảnh mô tả"
          name="hinh[]"
          rules={!imageList.length ? [{ required: true, message: "Vui lòng chọn ảnh" }] : undefined}
        >
          <Upload
            disabled={imageList.length > 0}
            accept="image/*"
            listType="picture"
            multiple
            beforeUpload={() => false}
            fileList={imageList}
            onChange={({ fileList }) => setImageList(fileList)}
          // Disable upload if images exist
          >
            <Button icon={<UploadOutlined />} type="button" disabled={imageList.length > 0}>
              Chọn ảnh
            </Button>
          </Upload>
        </Form.Item>





        <Form.Item
          label="Điểm đi"
          name="diem_di"
          rules={[{ required: true, message: "Vui lòng chọn điểm đến!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn điểm đi"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {provinces.map((province) => (
              <Option key={province.code} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Điểm đến"
          name="diem_den"
          rules={[{ required: true, message: 'Vui lòng chọn điểm đến!' }]}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="Chọn điểm đến"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {provinces2.map((province) => (
              <Option key={province.code} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>





        <Form.Item
          label="Lịch khởi hành"
          name="lich_khoi_hanh"
          rules={[{ required: true, message: 'Vui lòng nhập lịch khởi hành!' }]}
        >
          {/* <DatePicker style={{ width: '100%' }} 
         onChange={(date, dateString) => setSelectedDate(dateString)} /> */}
          <Input />

        </Form.Item>

        <Form.Item
          label="Ngày Kết Thúc"
          name="ngay_ket_thuc"
          rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số Lượng Còn nhận"
          name="soluong"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô Tả"
          name="mo_ta"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        > <CKEditor
            editor={ClassicEditor}
            // config={{
            //   extraPlugins: [EasyImage],
            //   // Cấu hình thêm plugin Easy Image

            // }}
            data={editorData}
            onChange={handleEditorChange}
          />

        </Form.Item>

        <Form.Item
          label="Mã loại tour"
          name="ma_loai_tour"
          rules={[{ required: true, message: "Vui lòng nhập mã loại tour!" }]}
        >
          <Select defaultValue="Chọn" style={{ width: "100%", }}>
            {loaitourArrary.map((option: { id: React.Key | null | undefined; ten_loai_tour: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
              <Option key={option.id} value={option.id}>{option.ten_loai_tour}</Option>
            ))}
          </Select>
        </Form.Item>



        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className='btn-button-sub-pt'>
            <Button type="primary" danger htmlType="submit" className='submit-click'
            >
              Cập Nhật
              {/* <AiOutlineLoading3Quarters className="animate-spin" />   */}
            </Button>
            <Button
              type="primary"
              danger
              className="ml-2"
              onClick={() => navigate("/admin/tour")}
            >
              Quay lại
            </Button>
          </div>

        </Form.Item>
      </Form>
    </div >
  );
};

export default AdminTourEdit;