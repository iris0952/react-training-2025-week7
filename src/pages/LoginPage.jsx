import { useEffect, useState } from 'react'
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
    const [ user, setUser ] = useState({
      username: '',
      password: ''
    });
    
    function handleUser(e) {
      const { name, value } = e.target;
      setUser({//會全部覆蓋值
        ...user,//展開：把原始物件展開帶入
        [name]: value
      })
      // console.log(user);
    }
    // 登入 async await 的寫法
    const login = async(e) => {
        e.preventDefault();//可以解除button的預設行為，這樣 button 可以不加入 type="button" 然後使用 Enter，就可以觸發事件。
        
        try {
            const res = await axios.post(`${BASE_URL}/v2/admin/signin`, user)
            //取得 token
            const { token, expired } = res.data;
            document.cookie = `camiToken=${token}; expires='${new Date(expired)}'; path=/`;

            if (token) {
              axios.defaults.headers.common['Authorization'] = token;//帶入 token
              setIsAuth(true);
            }
        
        } catch (error) {
        console.log('登入失敗');
        
        }
    }


    // const checkUserLogin = async() => {
    //     try {
    //       await axios.post(`${BASE_URL}/v2/api/user/check`);
    //       // setIsAuth(true);
          
    //     } catch (error) {
    //       // console.log(error);
    //       console.log('登入失敗，請重新登入！');
    //     }
    //   }
    
    // useEffect(() => {
    //     const token = document.cookie.replace(
    //         /(?:(?:^|.*;\s*)camiToken\s*\=\s*([^;]*).*$)|^.*$/,
    //         "$1",
    //     );
    //     if (token) {
    //       axios.defaults.headers.common['Authorization'] = token;
    //       checkUserLogin();
    //     }
    // }, [])
    
    

    return (
    <div className="conatiner">
        <div className="row">
          <div className="col-8 m-auto">
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
              <h1 className="mb-5">請先登入</h1>
              <form onSubmit={login} className="d-flex flex-column gap-3" style={{width: '300px'}}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" placeholder="name@example.com" value={user.username} name="username" onChange={handleUser} />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" placeholder="Password" value={user.password} name="password" onChange={handleUser}/>
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-info">登入</button>
              </form>
              <p className="mt-5 mb-3 text-muted">&copy; 2025 ∞~ React 作品實戰 ~∞</p>
            </div>
          </div>
        </div>
    </div>
    )
}
export default LoginPage