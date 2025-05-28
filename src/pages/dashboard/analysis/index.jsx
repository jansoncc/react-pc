import React, { Component } from 'react';
import './index.less'
import home from "@/assets/images/welcome.png"

class Home extends Component {

    render() {
        const title = window.envConfig.ROOT_APP_NAME

        return (
            <main className="analsis">

                <div className='imgbox'> <img src={home} alt="" /></div>

                {/* <p>欢迎登录{title}</p> */}
            </main>
        );
    }
}

export default Home;