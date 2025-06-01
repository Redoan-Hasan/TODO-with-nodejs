const http = require('http');
const path = require('path');
const fs = require('fs');
const { create } = require('domain');

const filePath = path.join(__dirname, "/db/db.json")
const server = http.createServer((req,res)=>{
    //getting all the todos
    if(req.url === "/todos" && req.method === "GET"){
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
    else if(req.url === "/todos/create" && req.method === "POST"){
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
    else{
        res.end("Route not found");
    }
})

server.listen(5000,"127.0.0.1",()=>{
    console.log("😍 Server is running on port 5000")
})