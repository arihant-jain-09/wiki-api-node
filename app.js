const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000
app.listen(port,function () {
 console.log("Server is running at port 3000");
});
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true , useUnifiedTopology: true});
const articleSchema=new mongoose.Schema({
  title:String,
  content:String
})
const Article=mongoose.model('Article',articleSchema);
app.route('/articles')
  .get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
      if(err){res.send(err);}
      else{
        res.send(foundArticles);
      }
    })
  })
  .post((req,res)=>{
    const article=new Article({
      title:req.body.title,
      content:req.body.content
    })
    article.save((err)=>{
      if(err){res.send(err)}
      else{res.send('successfully added a new article')}
    });
  })
  .delete((req,res)=>{
    Article.deleteMany({},(err)=>{
      if(err){res.send(err);}
      else{res.send("Successfully deleted all articles");}
    })
  })

app.route('/articles/:topicId')
  .get((req,res)=>{
    Article.findOne({title:req.params.topicId},(err,results)=>{
      if(err){res.send(err);}
      else{res.send(results)}
    })
  })
  .put((req,res)=>{
    Article.replaceOne({title:req.params.topicId},{
      title:req.body.title,
      content:req.body.content
    },(err,results)=>{
        if(err){res.send(err)}
        else if(results.n===1 && results.nModified===1){
          res.send("Successfully updated Specific Article")
        }
        else if(results.n===1 && results.nModified===0){
          res.send("Could not update Article although it exists")
        }
        else{res.send("Article not found")}
      })
  })
  .patch((req,res)=>{
    Article.updateOne({title:req.params.topicId},{
    $set:req.body
  },(err,results)=>{
      if(err){res.send(err)}
      else if(results.n===1 && results.nModified===1){
        res.send("Successfully updated Specific Article")
      }
      else if(results.n===1 && results.nModified===0){
        res.send("Could not update Article although it exists")
      }
      else{res.send("Article not found")}
    })
  })
  .delete((req,res)=>{
    Article.deleteOne({title:req.params.topicId},(err,results)=>{
      if(err){res.send(err)}
      else if(results.n===1 && results.ok===1){
          res.send("Successfully deleted Specific Article")
      }
      else if(results.n===1 && results.ok===0){
          res.send("Could not delete Article although it exists")
      }
      else{
        res.send("Article does not exists")
      }
    })
  })
