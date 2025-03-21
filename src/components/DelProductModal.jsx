import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function DelProductModal({ getProducts, tempProduct, isOpen, setIsOpen }) {
    const [modalData, setModalData] = useState(tempProduct);
    useEffect(() => {
        setModalData({
            ...tempProduct
        })
    }, [tempProduct])

    const deleteProductModalRef = useRef(null);
    
    useEffect(() => {
        new Modal(deleteProductModalRef.current, {
        backdrop: false
        });
    }, [])

    useEffect(() => {
        if(isOpen){
            const modalInstance = Modal.getInstance(deleteProductModalRef.current);
            modalInstance.show();
        }
    }, [isOpen])

    const deleteProduct = async () => {
        try {
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, { 
            data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0
            } 
        });
        } catch (error) {
        console.log(error);
        alert('刪除產品失敗');
        }
    }

    const handleCloseDelProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    }
    const handleDeleteProduct = async () => {
        try {
        await deleteProduct();
        getProducts();
        handleCloseDelProductModal();
        } catch (error) {
        alert('刪除產品失敗');
        }
    }

    return (<>
        <div
            ref={deleteProductModalRef}
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleCloseDelProductModal}
                    ></button>
                    </div>
                    <div className="modal-body">
                    你是否要刪除 
                    <span className="text-danger fw-bold">{modalData.title}</span>
                    </div>
                    <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseDelProductModal}
                    >
                        取消
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>
                        刪除
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default DelProductModal