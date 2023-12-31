type Props = {};


import { useEffect } from "react";
import { Table, Button, Skeleton, Popconfirm, Alert } from "antd";
import { Link } from "react-router-dom";
import useNavigate from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

import { ILoaiTour } from "../../../../interface/loaiTour";
const Admin_Danhmuc_baiviet = (props: Props) => {
    const dataSource = [
        {
            key: 1,
            ten_danh_muc: "Danh mục 1",
        },
        {
            key: 2,
            ten_danh_muc: "Danh mục 2",
        },
        // Add more data objects as needed
    ];
    //cương đb
    // const { data: tourdata, error, isLoading } =  //thay bang api getdanhmuc useGetLoaiTourQuery();
    // const [removeProduct, { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess }] =
    //     useRemoveLoaiTourMutation();
    // const confirm = (id: any) => {
    //     removeProduct(id);
    // };
    // // const navigate = useNavigate();
    // const tourArray = tourdata?.data || [];

    // const dataSource = tourArray.map(({ id, image, ten_loai_tour }: ILoaiTour) => ({
    //     key: id,
    //     image,
    //     ten_loai_tour
    // }));

   

    const columns = [
        {
            title: "ID loại bài việt",
            dataIndex: "key",
            key: "key",
        },
       
        {
            title: "Tên danh mục",
            dataIndex: "ten_danh_muc",
            key: "ten_danh_muc",
        },
        {
            title: "Action",
            render: ({ key: id }: any) => {
                return (
                    <>
                        {localStorage.getItem("role") == 'admin' ? <div className="flex space-x-2">
                            <Popconfirm
                                title="Bạn có muốn xóa?"
                                onConfirm={() => confirm(id)}
                                okText="Yes" className="text-black"
                                cancelText="No"
                            >
                                <Button type="primary" danger>
                                    Xóa
                                </Button>
                            </Popconfirm>

                            {/* <Button type="primary" danger>
                                <Link to={`/admin/tour/loai_tour/edit/${id}`}>Sửa</Link>
                            </Button> */}
                        </div> : ""}
                    </>
                );
            },
        },
    ];
    // useEffect(()=>{
    //     if(isRemoveSuccess){
    //         // navigator("/admin/tour/loai_tour")
    //         // Navigator
    //         useNavigate("/admin/tour/loai_tour");
    //     }
    // }, [])
    return (
        <div>
            <header className="mb-4 flex justify-between items-center">
                <h2 className="font-bold text-2xl">Quản lý danh mục bài viết</h2>
                <Button type="primary" danger>
                    <Link to="/admin/post/add_danhmuc" className="flex items-center space-x-2">
                        <AiOutlinePlus />
                        Tạo mới danh mục bài viết 
                    </Link>
                </Button>
            </header>
            {/* {isRemoveSuccess && <Alert message="Success Text" type="success" />} */}
            { <Table dataSource={dataSource} columns={columns} />}
        </div>
    );
};

export default Admin_Danhmuc_baiviet;
