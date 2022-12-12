const { request } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkedOrdersId = (request, response, next) =>{
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index <0){
        return response.status(404).json({error:"Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const informeData = express.Router()

informeData.use = ((request, response, next) => {

    console.log(request.method, request.url)

    next()

})

app.get('/orders', informeData, (request, response) =>{

    return response.json(orders)

})
app.post('/orders', informeData,  (request, response) =>{

    const {product, clientName, price, status}  = request.body

    const order = {id:uuid.v4(), product, clientName, price, status}
    
    orders.push(order)

    return response.status(201).json(order)

})
app.put('/orders/:id',informeData, checkedOrdersId, (request, response) =>{
        
    const {product, clientName, price, status} = request.body

    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, product, clientName, price, status}

    
    orders[index] = updateOrder

    return response.json(updateOrder)

})
app.patch('/orders/:id', informeData,  checkedOrdersId, (request, response) =>{
        
    const {status} = request.body

    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {status}

    
    orders[index] = updateOrder

    return response.json(updateOrder)

})
app.delete('/orders/:id', informeData, checkedOrdersId, (request, response) =>{

    const index = request.orderIndex

    
    orders.splice(index,1)

    return response.status(204).json()

})
app.listen(port, () =>{
    console.log(`🚀 Server started on port ${port} ✈`)
})


