jQuery(function(){

    const myModal = document.getElementById('mymodal')
    $('.add').click(function(){
        // alert('hello')
        $('#myModal').modal('show')
        $(".modal-backdrop.in").hide();

    })

    $('.icon').click(function (){
        $(this).toggleClass('selected')
    })
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let todaysdate = `${year}-${month}-${day}`

    
    $('.input-group.date').datepicker({
        endDate:todaysdate,
        format: "yyyy/mm/dd",
        maxViewMode: 3,
        todayBtn: "linked",
        orientation: "bottom auto",
        autoclose:true,
        calendarWeeks: true
    });

    
})