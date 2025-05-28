import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './index.less'
import error404 from '@/assets/images/404.png'
function Error() {
    const navigate = useNavigate()

    useEffect(() => {

    }, []);
  
    return (
        <div className='error404'>
            <canvas id="error404Canvas"></canvas>
            <div className="error_main">
                <div className="errorImg">
                    <img src={error404} alt="" />
                </div>
                <div className="errorText">
                    <h1>404</h1>
                    <h2>UN ON! 页面丢失啦</h2>
                    <p>别灰心，可能是网址输入错误或页面不存在，请返回首页</p>
                    <button onClick={() => navigate("/")}> 返回首页</button>

                </div>

            </div>

        </div>
    );

}

export default Error;