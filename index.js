const express=require("express");
const bodyparser=require("body-parser")
const mongoose= require("mongoose")
const app=express();
app.use(bodyparser.urlencoded({ extended: true }))
const PORT= 5000;


mongoose.connect('mongodb://localhost:27017/sampleDB',{useNewUrlParser: true});


const noteSchema=({
    title:String,
    content:String
})

const Note = mongoose.model("Note", noteSchema);


app.route("/Notes")

.get((req,res)=>{
   Note.find({},(err,items)=>{
        res.send(items)
   })
})
.post((req,res)=>{
    const ntitle=req.body.title;
    const ncontent=req.body.content;
    const item=new Note({
        title:ntitle,
        content:ncontent
    })
    item.save(function(err){
        if (!err){
          res.send("Successfully added a new article.");
        } else {
          res.send(err);
        }
      });
})

app.route("/Notes/:Notetitle")

.get((req,res)=>{
    const ntitle=req.params.Notetitle;
    Note.findOne({title:ntitle},function(err,foundItem){
        if (foundItem) {
            res.send(foundItem);
          } else {
            res.send("No articles matching that title was found.");
          }
    })
})

.patch((req,res)=>{
    const ntitle=req.params.Notetitle
    const data=req.body;
    Note.findOneAndUpdate(
        {title: ntitle},
        data,
        function(err){
          if(!err){
            res.send("Successfully updated article.");
          } else {
            res.send(err);
          }
        }
    )
})

.put(function(req, res){
    const ntitle=req.params.Notetitle

    Note.findOneAndUpdate(
      {title: ntitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })

.delete((req,res)=>{
    const ntitle=req.params.Notetitle;
    Note.deleteOne({title:ntitle},function(err){
        if(!err){
            res.send("Successsfully Deleted")
        }
    })
})

app.listen(PORT,(res,req)=>{
    console.log("Server running on "+PORT);
})
