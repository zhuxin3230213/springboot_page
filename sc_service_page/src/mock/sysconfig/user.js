import Mock from 'mockjs'
import config from '../../../platform-config'
const Random = Mock.Random;
const baseUrl = config.axios.baseURL;

Mock.mock(`${baseUrl}/user/loadGrid`,'post',(params)=>{
    let rows = [];
    for(let i =0;i<10;i++){
        rows.push({
            id:Random.string(),
            name:Random.string(),
            code:Random.string(),
            sex: Mock.mock({
                "array|1":[
                    '0',
                    '1'
                ]
            }).array,
            birthday:Random.date(),
            deptName:Random.string(),
            deptId:Random.string(),
            mobile:Random.string(),
            weixin:Random.string(),
            qq:Random.string(),
            email:Random.email()
        })
    }
    return {
        rows,
        total:100
    }
})
Mock.mock(`${baseUrl}/user/removeUser`,'post',(ids)=>{
 return {
     success:true
 }
})
Mock.mock(`${baseUrl}/user/addUser`,'post',(user)=>{
    return {
        success:true
    }
   })

   Mock.mock(`${baseUrl}/user/editUser`,'post',(row)=>{
       return {
           success:true
       }
   })