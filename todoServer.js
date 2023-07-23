const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/todoViews/index.html");
});

app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});

app.get("/todo-data", function (req, res) {
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }
    //res.status(200).send(JSON.stringify(data));
    res.status(200).json(data);
  });
});

app.post("/todo", function (req, res) {
  // console.log(req.body);
  saveTodoInFile(req.body, function (err) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).send("success");
  });
});

app.get("/todoScript", function (req, res) {
  res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
});

function readAllTodos(callback) {
  fs.readFile("./treasure.txt", "utf-8", function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.length === 0) {
      data = "[]";
    }

    try {
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

function saveTodoInFile(todo, callback) {
  readAllTodos(function (err, data) {
    if (err) {
      callback(err);
      return;
    }
    const title = todo.todoText;
    const id = todo.id;
    const completeTask = todo.completeTask;
    if(!title)
    {
      return res.status(500).send("Title is required");
    }
    const todoText = title;
    const newTodo = {id,todoText, completeTask}
    data.push(newTodo);

    fs.writeFile("./treasure.txt", JSON.stringify(data), function (err) {
      if (err) {
        callback(err);
        return;
      } 
      callback(null);
    });
  });
}


app.delete('/todo/:id',(req,res) =>{
  readAllTodos(function (err, data) {
    if (err) {
      callback(err);
      return;
    }
    
    const idToDelete = parseInt(req.params.id);
    const todo = data.filter(({id}) => id !== idToDelete);
    
    fs.writeFile("./treasure.txt", JSON.stringify(todo), function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      } 

    });
    res.status(200).send("success");
  });
});

app.patch('/check/:id', (req,res)=>{
  const idToCheck = req.params.id;
  readAllTodos(function (err, data) {
    if (err) {
      callback(err);
      return;
    }
    
    // console.log(data);
    let change = data.map(function(check){
      if(check.id == idToCheck){
        check.completeTask = req.body.check;
      }
      return check;
    });
    // console.log(change);

    fs.writeFile("./treasure.txt", JSON.stringify(change), function (err) {
      if (err) {
        res.status(500).send("error");
        return;
      } 
    });
    res.status(200).send("success");
  })
});
app.listen(3000, function () {
  console.log("server on port 3000");
});
