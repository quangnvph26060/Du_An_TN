type Props = {};

import { Table, Button, Skeleton,Input,  Popconfirm, Alert } from "antd";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { ITour } from "../../../../interface/tour";
import { useGetTourQuery, useRemoveTourMutation } from "../../../../api/TourApi";
import { useGetLoaiTourQuery } from "../../../../api/LoaiTourApi";
import { useGetHuongDanVienQuery } from "../../../../api/HuongDanVienApi";
import { Modal, Descriptions } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import { Select } from 'antd';
import axios from "axios";
import "./tour.css";

const AdminProduct = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
   
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    // Lọc dữ liệu dựa trên giá trị tìm kiếm
    const filteredData = tourArray.filter((item) =>
      item.ten_tour.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredDataSource(filteredData);
  };


  const { Option } = Select;
  const { data: loaitourdata } = useGetLoaiTourQuery();
  const { data: huongdanviendata } = useGetHuongDanVienQuery();
  const { data: tourdata, error, isLoading } = useGetTourQuery();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState<ITour | null>(null);
  const [sortedTourArray, setSortedTourArray] = useState([]);


  const currentDate = new Date(); // Ngày hiện tại
  const [isSearching, setIsSearching] = useState(false);
  const [removeTour, { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess }] =
    useRemoveTourMutation();

  const confirm = (id: any) => {

    removeTour(id);

  };
  const loaitourArrary = loaitourdata?.data || [];
  const tourArray = tourdata?.data || [];
  console.log(tourArray);

  const tour = () => {
    const [isreadloang, setisreadloang] = useState(false);
    const [hdvtour, sethdvtour] = useState([]);
    const handleSelectChange = (event, item) => {
      const selectedValue = event.target.value;
      const lichKhoiHanh = item.lich_khoi_hanh;
      const ngayKetThuc = item.ngay_ket_thuc;
      const id = item.id;

      axios.post('http://127.0.0.1:8000/api/admin/hdvtour/handleHuongDanVien', {
        selectedValue,
        lichKhoiHanh,
        ngayKetThuc,
        id,
      })
        .then(response => {
          setisreadloang(false)
          // Xử lý kết quả trả về từ API (nếu có)
          console.log(response.data);
        })
        .catch(error => {
          // Xử lý lỗi (nếu có)
          console.error(error);
        });

    };





    const [tourHDVArray, setTourHDVArray] = useState([]);
    const [hdvDuocChon, setHdvDuocChon] = useState([]);
    useEffect(() => {
      const fetchHDVData = async (a, b, c) => {
        if (a && b && c) {
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/admin/hdvtour', {
              start_date: a,
              end_date: b,
              id_tour: c
            });
            const hdvDate = response.data;
            console.log(hdvDate);

            const hdvDuocChon = response.data.hdv_duoc_chon;


            return hdvDate;
          } catch (error) {
            // Xử lý lỗi
            console.error(error);
            return [];
          }
        }
      };

      const fetchData = async () => {
        const tempArray = [];
        for (let i = 0; i < tourArray.length; i++) {
          const item = tourArray[i];
          const hdvData = await fetchHDVData(item.lich_khoi_hanh, item.ngay_ket_thuc, item.id);
          tempArray.push(hdvData);
        }
        setTourHDVArray(tempArray);
      };
      fetchData();
    }, [tourArray]);
    useEffect(() => {
      const sortedArray = [...tourArray].sort((a, b) => {
        // Chuyển đổi chuỗi ngày thành đối tượng Date để so sánh
        const dateA = new Date(a.lich_khoi_hanh);
        const dateB = new Date(b.lich_khoi_hanh);

        // Sắp xếp theo thứ tự giảm dần (mới nhất đến cũ hơn)
        return dateB - dateA;
      });

      setSortedTourArray(sortedArray);
    }, [tourArray]);

    return (
      <table className="table_tour">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Ma Loai Tour</th>
            <th>Ảnh Đại diện</th>
    
            <th>Lich Khoi Hanh</th>
            <th>Ngay Ket Thuc</th>
            <th>Hướng dẫn viên</th>
            <th>Giá người lớn</th>
            <th>Giá trẻ em</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody className="font-semibold">
          {(filteredDataSource.length > 0 ? filteredDataSource : tourArray).map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ten_tour}</td>
              <td>
                {loaitourArrary?.map((loaiTour: { id: number, ten_loai_tour: string }) => {
                  if (loaiTour.id === item.ma_loai_tour) {
                    return loaiTour.ten_loai_tour;
                  }
                })}
              </td>
              <td>
                <img
                  src={`http://localhost:8000/storage/${item.image_dd}`}
                  alt={`Image ${index}`}
                  style={{ width: '200px', cursor: 'pointer', marginRight: '5px' }}
                />
              </td>
              {/* <td>
                {item.image_path.map((image, index) => (


                  <img
                    key={index}
                    src={`http://localhost:8000/storage/${image}`}
                    alt={`Image ${index}`}
                    style={{ width: '200px', cursor: 'pointer', marginRight: '5px' }}
                  />
                ))}
              </td> */}
              <td>{item.lich_khoi_hanh}</td>
              <td>{item.ngay_ket_thuc}</td>
              {
                <td>
                  <select className="select-dropdown" onChange={(event) => handleSelectChange(event, item)}>
                    <option value="">Chọn</option>
                    {tourHDVArray[index]?.hdv_duoc_chon.map((hdvItem) => {
                      const isSelected = hdvItem.id === tourHDVArray[index]?.hdv_duoc_chon[0]?.id;
                      return (
                        <option
                          key={hdvItem.id}
                          value={hdvItem.id}
                          selected={isSelected}
                        >
                          {hdvItem.name}
                        </option>
                      );
                    })}
                    {tourHDVArray[index]?.hdv_abc.map((hdvItem) => (
                      <option key={hdvItem.id} value={hdvItem.id}>
                        {hdvItem.name}
                      </option>
                    ))}
                  </select>
                </td>
              }
              <td>{item.gia_nguoilon} VNĐ </td>
              <td>{item.gia_treem} VNĐ</td>
              <td>{item.soluong}</td>
              <td>
                {(() => {
                  const departureDate = new Date(item.lich_khoi_hanh);
                  const formattedDate = departureDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                  const ngayhientai = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
                  const isExpired = formattedDate < ngayhientai;

                  return (
                    <span className={isExpired ? 'expired-text' : 'active-text'}>
                      {isExpired ? 'Không Hoạt Động' : 'Vẫn Hoạt Động'}
                    </span>
                  );
                })()}
              </td>
              <td>
                {localStorage.getItem("role") === 'admin' && (
                  <div className="flex space-x-2">
                    <button className="delete-button" onClick={() => {
                      if (window.confirm("Bạn có muốn xóa không?")) {
                        confirm(item.id);
                      }
                    }}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <button className="edit-button">
                      <Link to={`/admin/tour/edit/${item.id}`}>
                        <i className="fa fa-wrench"></i>
                      </Link>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <div>


      <header className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-3xl">Quản lý tour</h2>

        <Button type="primary" danger>
          <Link to="/admin/tour/add" className="flex text-lg items-center space-x-2">
            <AiOutlinePlus />
            Tạo mới tour
          </Link>
        </Button>
      </header>
      <div className="flex items-center justify-end mb-4">
  <Input
    style={{ width: "250px" }}
    placeholder="Tìm kiếm lịch trình"
    value={searchValue}
    onChange={handleSearchChange}
  />
  <Button style={{ backgroundColor: "blue" , marginLeft:"5px"}} type="primary" onClick={handleSearch}>
    Tìm kiếm
  </Button>
</div>
      {tour()}
    </div>
  );
};

export default AdminProduct;