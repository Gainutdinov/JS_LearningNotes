var listOflistOfTaskAndReports = document.getElementsByClassName('ms-acal-ddiv');

/* we declare a function so that it later loads the content of the page and we receive from there the email addresses of people who have not closed the task */

function sleep(ms) {  /* sleep 2000 ms */
    ms += new Date().getTime();
    while (new Date() < ms){}
    } 

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); /* false for synchronous request */
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/* declare a function to determine the day of the week by date */

function getDayOfWeek(date) {    /* var weekDay = getDayOfWeek("2013-07-31") */
    var dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

/* for example parsim value all regs */

var Title = "";
var completionStatus = false;
var linkTask = "";
var completedTasks = 0;
var completedReports = 0;
var incompletedTasks = 0;
var incompletedReports = 0;
var incompletedItem = "";
var endDate = "";
var dateMy = "";
var listOfEmails = []; /* list of people who didn't close his tasks */
var listOfUsers = []; /* list of people who didn't close his tasks */
var itemsList = 0;
var sendTo = "";
var emailBody = "<p>" + "Regular tasks " + document.getElementsByClassName("ms-acal-week-top")[0].children[1].getAttribute('date') +" - "+ document.getElementsByClassName("ms-acal-week-top")[0].children[7].getAttribute('date') + "</p>";
emailBody += "<p>" + "Пожалуйста, закройте таски за прошлую неделю, если они выполнены." + "</p>";
emailBody += "<p>" + 'Не закрывайте таски через "Edit Series". Используйте только "Edit Item."' + "</p>";
emailBody += '<table border="2px" ><tr><td>weekDay</td><td>Date</td><td><a href="#" style="text-decoration: none;color:black;">Title</a></td><td>Responsible</td></tr>';



for (var i = 0; i<listOflistOfTaskAndReports.length; i++) {
    Title = listOflistOfTaskAndReports[i].getElementsByTagName('a')[0].innerText;
    completionStatus = listOflistOfTaskAndReports[i].innerText.includes('Done');
    if (completionStatus) {
        if (Title.slice(0,3)=="REP") {
            completedReports +=1;
        } else {
            completedTasks +=1;
        };
    } else {
        if (Title.slice(0,3)=="REP") {
            incompletedReports +=1;
        } else {
            incompletedTasks +=1;
        };
        /*  change response text to DOM object and obtain from it our information  */
        incompletedItem = "";
        incompletedItem = document.createElement( 'html' );
        console.log(listOflistOfTaskAndReports[i].getElementsByTagName('a')[0].href + i);
        incompletedItem.innerHTML = httpGet( listOflistOfTaskAndReports[i].getElementsByTagName('a')[0].href ); /* type of object */
        /* sleep(2000); */
        dateMy = incompletedItem.getElementsByClassName("ms-formbody")[2].innerText.slice(7,17); /* end date of the assignment */
        endDate = dateMy.slice(6,12) + "-" + dateMy.slice(3,5) +"-" + dateMy.slice(0,2);
        console.log(getDayOfWeek(endDate));
        emailBody += '<tr><td>'+ getDayOfWeek(endDate) + "</td>";
        emailBody += '<td>'+ endDate +'</td>';
        emailBody += '<td><a href="'+listOflistOfTaskAndReports[i].getElementsByTagName('a')[0].href+'" style="text-decoration: none;color:blue;">'+ Title +'</a></td>';
        itemsList = incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByClassName("ms-subtleLink"); /* Live NodeList of your anchor elements */
        emailBody += '<td>';
        for (var j=0; j < itemsList.length; j++) {
            /* istOfUsers.push(incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByClassName("ms-subtleLink")[j].innerText) /* Name of the responsible person */
            listOfEmails.push(incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByTagName('img')[j].getAttribute('sip')); /* email of the affected user */     
            
            emailBody += '<p>' + incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByClassName("ms-subtleLink")[j].innerText +'</p>';   
        }
        emailBody += '</td>';
        emailBody += '</tr>';
    }

    for (var x = 0; x<listOfEmails.length ; x++) {
        if (sendTo.includes(listOfEmails[x])) {

        } else {
            sendTo +=   listOfEmails[x] + ";"
        }
    }
    
    /* linkTask = listOflistOfTaskAndReports[i].getElementsByTagName('a')[0].href;
    console.log(Title + ' ----- '   + completionStatus + "-----------" + linkTask + "\n"); */
}
emailBody +="</table><p></p><p></p><p></p><p></p><p></p><p>Send emails to:</p><p></p>" + sendTo;
emailBody += '<p></p><p></p><p></p><p></p> Carbon Copy: <p></p>' + 'Alexander@ts.com;Marat@ts.com';
emailBody += '<p></p><p></p><p></p><p>ON WEDNESDAY</p> Send ONLY to and Carbon Copy as usual: <p></p>TeamLeaders';

console.log("completedTasks "+completedTasks+'\n'+"completedReports " +completedReports+'\n'+"incompletedTasks "+incompletedTasks+'\n'+"incompletedReports "+incompletedReports);
emailBody +="<p></p><p></p><p></p><p></p>";
emailBody +='<table border="1px solid pink"><tr><td>'+document.getElementsByClassName("ms-acal-week-top")[0].children[1].getAttribute('date') +' - ' + document.getElementsByClassName("ms-acal-week-top")[0].children[7].getAttribute('date') +'</td><td>All</td><td>Done</td><td>Open</td></tr><tr><td>Reports, num / %</td><td>'+(completedReports+incompletedReports)+'</td><td>'+ completedReports + '/' + ((100-(incompletedReports * 100)/(completedReports + incompletedReports)).toFixed(2)) + '%' +'</td><td>' + incompletedReports + '</td></tr><tr><td>Tasks, num / %</td><td>'+(completedTasks+incompletedTasks)+'</td><td>'+ completedTasks + '/' + ((100-(incompletedTasks * 100)/(completedTasks + incompletedTasks)).toFixed(2)) + '%' +'</td><td>' + incompletedTasks + '</td></tr></table>';

var d1 = document.getElementById('s4-titlerow');
d1.insertAdjacentHTML('afterend', emailBody);

/*   получить дату реквеста  
 var emailSubject = "<p>" + "Regular tasks " + document.getElementsByClassName("ms-acal-week-top")[0].children[1].getAttribute('date') +" - "+ document.getElementsByClassName("ms-acal-week-top")[0].children[7].getAttribute('date') + "</p>"
  document.getElementsByClassName("ms-acal-week-top")[0].children[1].getAttribute('date')   start of the week
  document.getElementsByClassName("ms-acal-week-top")[0].children[7].getAttribute('date')   end of the week

 

var incompletedItem = document.createElement( 'html' );
incompletedItem.innerHTML = httpGet(theUrl);   type of object

dateMy = incompletedItem.getElementsByClassName("ms-formbody")[2].innerText.slice(7,17);   end date of the assignment
endDate = dateMy.slice(6,12) + "-" + dateMy.slice(3,5) +"-" + dateMy.slice(0,2);
incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByClassName("ms-subtleLink")   Live NodeList of your anchor elements
incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByClassName("ms-subtleLink")[0].innerText   Name of the responsible person
incompletedItem.getElementsByClassName("ms-formbody")[6].getElementsByTagName('img')[0].getAttribute('sip')   email of the affected user
*/