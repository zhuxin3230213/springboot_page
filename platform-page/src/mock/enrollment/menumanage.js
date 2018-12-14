import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random;
const baseUrl = config.axios.baseURL;


Mock.mock(`${baseUrl}/menumanage/listTree`,'post',()=>{
    return [{
        id:'-1',
        name:'系统菜单',
        code:'152',
        type:'0',
        status:'1',
        builtln:true
    }]
})