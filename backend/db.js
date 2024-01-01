const mongoose=require('mongoose');
const mongoURI='mongodb+srv://gofood:1234@cluster0.bqoimzh.mongodb.net/gofoodmern?retryWrites=true&w=majority'
const mongoDB=async()=>{

    mongoose.connect(mongoURI)
    .then(()=>{
        console.log("connected to DB");
        const fetched_data= mongoose.connection.db.collection("food_items");
          
            fetched_data.find({}).toArray()
            .then((data)=>{
                // console.log(data);
                const foodCategory= mongoose.connection.db.collection("foodCategory")
                foodCategory.find({}).toArray()
                .then((catData)=>{
                    global.food_items=data;
                    global.foodCategory=catData;

                })
                
            })
            .catch((err)=>{
                console.log(err);
            })
        
            
            
        
    })
    .catch((err)=>{
        console.log(err);
    });
    

    
}
module.exports=mongoDB;