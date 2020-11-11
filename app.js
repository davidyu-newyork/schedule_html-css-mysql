//David Yu - 111922653 - CSE316 - Hw 4
//Implement ClassFind
//Node.Js, MySQL


//Connect to Mysql database



let sql = require("mysql");

let connection = sql.createConnection(
    {
    host: "localhost", port : 3306, user: "root",
    password: "pass", database: "hw4"
    }
);
connection.connect(function(err) {
    if (err) throw err;
});

const url = require("url");
const exp = require("express");
const app = exp();

function main_page(x,y){ //request, response
    y.writeHead(200, {'content-type':'text/html'});


    let query = url.parse(x.url, true).query;
 
    choice = query.choice ? query.choice : "";
    search = query.search ?    query.search : "";

    let main_html = `
    <!DOCTYPE html>
    <html lang = "en">
    <style>
    .collapse {
        cursor : pointer;

        width: 100%;

    }

    .active, .collapse:hover{
        background-color: lightgray;


    }
    .class_content {
        overflow: hidden;
        padding: 0 20px;


    }
</style>
    <head>
    <title> 2021 Spring Classfind Hw4 </title>
    <h1 style = "font-size: 15px"> David Yu, Id-111922653, Hw4 CSE316 Fall2020 </h1>
    <h2> Spring 2021 CSE Classes</h2>
    <body> Search for Classes</body>
    <form action = "/" method = "get">
    <input type = "text" name = "search" value = "">
    <i> FILTER: </i>
    <select name = "choice">
        <option value = "all"> all fields </option>
        <option value = "t"> title </option>
        <option value = "num">class number </option>
        <option value = "day"> day </option>
        <option value = "time"> time </option>

        </select>
    <input type = "submit" value = "Submit">
    <br>
    <body> example searches: MW,1:00 PM,303</body>

    </form>
    <br>

    <div id = "classlist"> 

    `;

    let select = "SELECT * FROM all_classes";

    //to do
    //select different based on "choice" ie time, class num
    if(choice == "all"){
        select = `SELECT * FROM all_classes 
        WHERE Subject LIKE '%` + search + `%' OR
        course_number LIKE '%` + search + `%' OR
        course_name LIKE '%` + search + `%' OR
        course_component LIKE '%` + search + `%' OR
        course_section LIKE '%` + search + `%' OR
        days LIKE '%` + search + `%' OR
        start_time LIKE '%` + search + `%' OR
        end_time LIKE '%` + search + `%' OR
        date_start LIKE '%` + search + `%' OR
        duration LIKE '%` + search + `%' OR
        instruction_mode LIKE '%` + search + `%' OR
        building LIKE '%` + search + `%' OR
        room LIKE '%` + search + `%' OR
        instructor LIKE '%` + search + `%' OR
        enrollment_cap LIKE '%` + search + `%' OR
        waiting_cap LIKE '%` + search + `%' `

    }
    else if(choice =="time"){//time
        select = `SELECT * FROM all_classes
        WHERE start_time LIKE '` + search + `%' OR
        end_time LIKE  '%` + search + `%'
        `

    }
    else if(choice =="t"){//time
        select = `SELECT * FROM all_classes
        WHERE course_name LIKE  '%` + search + `%'
        `

    }
    else if(choice =="num"){//time
        select = `SELECT * FROM all_classes
        WHERE course_number LIKE  '%` + search + `%'
        `

    }
 
    else if(choice =="day"){//time
        select = `SELECT * FROM all_classes
        WHERE days LIKE  '%` + search + `%'
        `

    }
 

    connection.query(select, function(err, result){

        if(err){
            throw err;
        }
        //var ul = main_html.getElementById("classlist");

        for (let item of result){
           // var li = document.createElement('p');
            main_html += `<button class ="collapse"> CSE` + item.course_number + " - " + item.course_name + " - " + item.course_component +  " - " + item.course_section +"</button>";
            //var divv = document.createElement('div');
            //divv.style.display = "none";
            main_html  += `<div style ="display:none;"> <p> <b> Days and times: </b>` + item.days + " - " + item.start_time + "-" + item.end_time 
            +"<br> <b> date start/end: </b>" +  item.date_start +" to " + item.date_end +
            "<br> <b> Duration (min): </b> " + item.duration +
            "<br> <b> Instruction: </b> " + item.instruction_mode + " at " + item.building + ", room " + item.room
            + "<br> <b> Professor: </b> " + item.instructor
            + "<br> <b> Enrollment cap: </b> " + item.enrollment_cap
            + "<br> <b> Wait cap: </b> " + item.waiting_cap 
            + `<form action="/nextpage" method ="get"> <button name = "class" value ="` + item.id +`">Add Class to Schedule</button> </form>`+ "</p> </div>";


        }
        main_html += `<script>var buttons = document.getElementsByClassName("collapse");
        for( var i = 0; i< buttons.length ; i++){
            buttons[i].addEventListener("click", function(){
                this.classList.toggle("active");
                var temp = this.nextElementSibling;
                if(temp.style.display == "block")
                    temp.style.display = "none";
                else   
                    temp.style.display = "block";
            })
        }</script>` ;

        main_html += "</html>";
        y.write(main_html);
        y.end();
    });
   
    
}
function schedule_page(x,y){
    let query = url.parse(x.url, true).query;
    console.log(query.class);
    let insert = `INSERT INTO schedule 
    SELECT * from all_classes 
    WHERE all_classes.id ="` + query.class + `";`;

    let schedule_html = 
    `<!DOCTYPE html>
    <html lang = "en">
    <head>
    <style>
        table,th,tr,td{
            border: 1px solid black;
            height :50px;
            padding :10px;
        
        }

    </style>
    <title> SPRING SCHEDULE </title>
    <h1> New Schedule Spring 2021 </h1>
    <a href = "/">Return to Add classes </a> <br>
    
    </head>
    <body>
    <table>
    <tr>
    <th>Mon</th>
    <th>Tue</th>
    <th>Wed</th>
    <th>Thu</th>
    <th>Fri</th>
    </tr>
    <tr>
    <td>Mon</td>
    <td>Tue</td>
    <td>Wed</td>
    <td>Thu</td>
    <td>Fri</td>
    </tr>

    </table>

    </body>
 
    `

    connection.query(insert, function(err,result){
        connection.query(getDay("M"), function(err,result){
            if (err) throw err;
            schedule_html = schedule_html.replace("<td>Mon</td>", replaceHtml(result));
            connection.query(getDay("TU"), function(err,result){
                if (err) throw err;
                schedule_html = schedule_html.replace("<td>Tue</td>", replaceHtml(result));
                connection.query(getDay("W"), function(err,result){
                    schedule_html = schedule_html.replace("<td>Wed</td>", replaceHtml(result));
                    connection.query(getDay("TH"), function(err,result){
                        schedule_html = schedule_html.replace("<td>Thu</td>", replaceHtml(result));
                        connection.query(getDay("F"), function(err,result){
                            schedule_html = schedule_html.replace("<td>Fri</td>", replaceHtml(result));
                            schedule_html += "</html>";
                            y.write(schedule_html);
                            y.end();
                            
                        });
            
                    });
        
                });
    
            });

        });



    });

   
}

function replaceHtml(result){
    let temp = "<td>";

    for (let x of result){
        console.log(x.start_time);
        temp += " <br> <b>" + x.start_time
        + "<br>" + x.course_name + " " + "CSE " + x.course_number +" <br>" +
        x.course_component + " " +  x.course_section + "<br><b>"
    }
    temp += "</td>";
    return temp;
}

function getDay(day){
    return `SELECT * FROM schedule 
    WHERE  days LIKE '%` + day + `%' 
    ORDER BY start_time`

}
//define funct schedule_page

app.get('/', function(request,response){

    main_page(request,response);

});
app.get('/nextpage', function(request,response){

    schedule_page(request,response);

});

//app.get(/nextpage)

let port = process.env.PORT || 3000;
app.listen(port, ()=> {});


