import { useEffect, useState } from 'react'
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';
import Toast from '../components/Toast';


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };

function ProductPage({ setIsAuth }) {
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const [modalMode, setModalMode] = useState(null); //判斷當前動作是新增產品還是編輯產品，新增一個狀態來判斷
    
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
    const getProducts = async (page = 1) => {
        try {
          const res = await axios.get(
            `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
          );
          setProducts(res.data.products);
          setPageInfo(res.data.pagination);
        } catch (error) {
          alert("取得產品失敗");
        }
    };

    useEffect(() => {
        getProducts();
    },[])
    
    
    
    

    const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
        // setTempProduct(product || defaultModalState);//判斷是新增還是編輯
        //也可以使用 switch case來判斷
        switch (mode) {
        case 'create':
            setTempProduct(defaultModalState);
            break;
        
        case 'edit':
            setTempProduct({
            ...product,
            imagesUrl: product.imagesUrl ? [...product.imagesUrl] : [""], // 確保 imagesUrl 是陣列
            });
            break;

        default:
            break;
        }

        setIsProductModalOpen(true);
    }

    const handleOpenDelProductModal = (product) => {
        setTempProduct(product);
        setIsDelProductModalOpen(true);
    }

    
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    

    const handlePageChange = (page) => {
        getProducts(page);
    }

    const handleLogout = async () => {
      try {
        await axios.post(
          `${BASE_URL}/v2/logout`
        );
        setIsAuth(false);
      } catch (error) {
        alert("登出失敗");
      }
    };
    
    return (<>
        <div className="container py-5">
            <div className="row">
              <div className="col">
                <div className="row mb-3">
                    <div className="justify-content-end">
                        <button onClick={handleLogout} type="button" className="btn btn-secondary">
                        登出
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                  <h2>產品列表</h2>
                  <button type="button" className="btn btn-info" onClick={()=> handleOpenProductModal('create')}>建立新的產品</button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">產品名稱</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col">編輯/刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : <span>未啟用</span>}</td>
                        <td>
                          <div className="btn-group">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=> handleOpenProductModal('edit', product)}>編輯</button>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>handleOpenDelProductModal(product)}>刪除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange}/>
            </div>
        </div>

        <ProductModal 
            modalMode={modalMode} 
            tempProduct={tempProduct} 
            isOpen={isProductModalOpen} 
            setIsOpen={setIsProductModalOpen}
            getProducts={getProducts}
        />

        <DelProductModal 
            getProducts={getProducts} 
            tempProduct={tempProduct}
            isOpen={isDelProductModalOpen}
            setIsOpen={setIsDelProductModalOpen}
        />

        <Toast />
     </>
    )
}
export default ProductPage