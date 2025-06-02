const http = require('http');
const path = require('path');
const fs = require('fs');


const filePath = path.join(__dirname, "/db/db.json")
const server = http.createServer((req,res)=>{
    const url = new URL(req.url,`http://${req.headers.host}`);
    const pathname = url.pathname;
    // console.log(url.pathname);


    //getting all the todos
    if(pathname === "/todos" && req.method === "GET"){
        const data = fs.readFileSync(filePath, {encoding:"utf-8"});
        res.writeHead(200,{
            "content-type" : "application/json"
        })
        //another way
        // res.setHeader("content-type","text/plain");
        // res.setHeader("email","redoan@example.com");
        // res.statusCode = 200;
        res.end(data);
    }

    //creating a todo
    else if(pathname === "/todos/create" && req.method === "POST"){
        let data = "";

        req.on("data",(chunk)=>{
            data = data + chunk;
        });

        req.on("end", ()=>{
            const {title, body} =JSON.parse(data);
            // console.log({title,body});
        const createdAt = new Date();
        // console.log(createdAt);
        const allTodos = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
        // console.log(allTodos);
        allTodos.push({
            title,
            body,
            createdAt
        });
        fs.writeFileSync(filePath, JSON.stringify(allTodos,null,2), {encoding: "utf-8"});
        res.end(JSON.stringify({title,body,createdAt},null,2));
    });
    }
    //single todo
    else if(pathname === "/todo" && req.method === "GET"){
        const title = url.searchParams.get("title");
        // console.log(title);
        const allTodos = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
        const singleTodo = allTodos.find((todo) => todo.title === title);
        console.log(singleTodo);
        res.end(JSON.stringify(singleTodo,null,2));
    }
    //updating a todo
    else if(pathname === "/todo/update" && req.method === "PATCH"){
        const title = url.searchParams.get("title");
        let data = "";

        req.on("data",(chunk)=>{
            data = data + chunk;
        });

        req.on("end", ()=>{
        const {body} =JSON.parse(data);
        // console.log(body);
        // console.log(createdAt);
        const allTodos = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
        const updateTodoIndex = allTodos.findIndex(todo => todo.title === title);
        // console.log(updateTodoIndex);
        const updatedTodo = allTodos[updateTodoIndex];
        // console.log(updatedTodo);
        updatedTodo.body = body;
        
        fs.writeFileSync(filePath, JSON.stringify(allTodos,null,2), {encoding: "utf-8"});
        res.end(JSON.stringify({title,body,createdAt : updatedTodo.createdAt},null,2));
    });
    }
    //deleting a todo 
    else if(pathname === "/todo/delete" && req.method === "DELETE"){
        const title = url.searchParams.get("title");
        
        
        const allTodos = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
        const deletedTodo = allTodos.filter(todo => todo.title !== title);
        
        fs.writeFileSync(filePath, JSON.stringify(deletedTodo,null,2), {encoding: "utf-8"});
        res.end(JSON.stringify({title,"status":"deleted"},null,2));
    }
    else{
        res.end("Route not found");
    }
})

server.listen(5000,"127.0.0.1",()=>{
    console.log("😍 Server is running on port 5000")
})