import * as report from "../services/reports.js"

$(document).ready(function (){
    
    $(document).on("click", ".users-report-btn", function (e) {
        e.preventDefault();
        let documentType =  $(this).data().documentType;
        
        $.when(report.users({document_type: documentType})).done( 
            function (data){
                downloadPDF(data);
            }
        );
    });

});


function downloadPDF(htmlContent){
    if(htmlContent){
        let win = window.open("","","");
        win.document.write(htmlContent.html)
        win.document.close();
        win.print();
    } else {
        console.error("HTML content is null or empty.")
    }
}
