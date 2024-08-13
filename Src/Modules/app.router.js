import ProductRouter from './Product/product.router.js'

import cors from 'cors'
import ConnectDB from '../../DB/connection.js';

const initApp=(app,express)=>{
    app.use(express.json());
    app.use(cors())

app.get('/',(req,res)=>{
    return res.json('welcome...')
});
ConnectDB();
app.use('/products',ProductRouter);

app.get('*',(req,res)=>{ 
    return res.json({message:'page not found'})
});
}


export default initApp