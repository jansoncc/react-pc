//Three.js
//react组件必须
import React, { Component } from 'react';

import Particles  from 'particles-bg'
import "./index.less"
//内容
class Three extends Component{

      render(){
            return(
               //type: random，circle，lines
               <Particles type="circle" bg={true}/>
            )
      }
}
export default Three;
