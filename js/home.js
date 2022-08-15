
jQuery(function(){
    getDashInfo()
    const myModal = document.getElementById('mymodal')
    $('.add').click(function(){
        $('#myModal').modal('show')
    })

    $('#pending').click(function (){
        $(this).addClass('selected')
        $('.dash').css('display','none')
        $('.comp').css('display','none')
        $('.arch').css('display','none')
        $('.pend').css('display','flex')
        $('.account').css('display','none')
        setSelected('pend')
        getPendingTasks()
    })
    

    $('#dashboard').click(function (){
        setSelected('dash')
        $(this).addClass('selected')
        $('.dash').css('display','flex')
        $('.dash').css('flex-direction','column')
        $('.pend').css('display','none')
        $('.comp').css('display','none')
        $('.arch').css('display','none')
        $('.account').css('display','none')
        getDashInfo()
        
    })

    $('#completed').click(function (){
        $(this).addClass('selected')
        $('.dash').css('display','none')
        $('.pend').css('display','none')
        $('.comp').css('display','flex')
        $('.arch').css('display','none')
        $('.account').css('display','none')
        setSelected('comp')
        getCompletedTasks()
        
    })
    

    $('#archived').click(function (){
        $(this).addClass('selected')
        $('.dash').css('display','none')
        $('.pend').css('display','none')
        $('.comp').css('display','none')
        $('.arch').css('display','flex')
        $('.account').css('display','none')
        setSelected('arch')
    })

    $('#account').click(function (){
        $(this).addClass('selected')
        $('.dash').css('display','none')
        $('.pend').css('display','none')
        $('.comp').css('display','none')
        $('.arch').css('display','none')
        $('.account').css('display','flex')
        setSelected('account')
    })

    $('#create').click(function(){
        createTodo()
    })

    function setSelected(item){
        switch (item) {
            case 'dash':
                $('#pending, #completed, #archived, #account').removeClass('selected')
                break;
            case 'pend':
                $('#dashboard, #completed, #archived, #account').removeClass('selected')
                break;
            case 'comp':
                $('#pending, #dashboard, #archived, #account').removeClass('selected')
                break;
            case 'arch':
                $('#pending, #completed, #dashboard, #account').removeClass('selected')
                break;
            case 'account':
                $('#pending, #completed, #archived, #dashboard').removeClass('selected')
                break;
            default:
                break;
        }
    }
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');


    function getDashInfo(){
        
        fetch('http://127.0.0.1:8082/todo/summary', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
        }).then(response => {
            return response.json()
        }).then(data => {
            $('#noPending').text(data.pending)
            $('#noComp').text(data.completed)
            $('#noDue').text(data.dueSoon)
            $('#noArch').text(data.archived)
        })
    }

    function createTodo(){
        fetch('http://127.0.0.1:8082/todo/create', {
            method: 'post',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            body : JSON.stringify({
                title : $('#title').val(),
                description : $('#description').val(),
                category : $('#category').val(),
                status : 'Pending',
                dueDate : $('#start').val(),
                priority : $('#priority').val()
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            if(data.status === 200){
                $('#myModal').modal('hide')
                showToast()
                getDashInfo()
            }else{
                console.log(data)
            }
        })
    }

    function getPendingTasks(){
        fetch('http://127.0.0.1:8082/todo', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
        }).then(response => {
            return response.json()
        }).then(data => {
            let pendingTasks = data.filter(x => x.status === 'Pending')
            $('.pend').children('div').remove()
            for(task of pendingTasks){
                $('.pend').append(
                    `<div class="task">
                    <div class="_left">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="status">
                        </div>
                        <div class="data">
                            <p class="lead">
                                ${task.title}
                            </p>
                            <figcaption class="blockquote-footer">
                                ${task.description}
                            </figcaption>
                        </div>
                    </div>
                    <div class="cont">
                        <div class="tags">
                            <p id="cat"class="lead">
                                ${task.category}
                            </p>
                            <p id="date" class="lead">
                                ${task.dueDate}
                            </p>
                        </div>
                        <div class="edit">
                            <i class="bi bi-pencil"></i>
                        </div>
                    </div>
                </div>`
                )
            }
        }).catch(err => {
            console.log(err);
        })
    }

    function getCompletedTasks(){
        fetch('http://127.0.0.1:8082/todo', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
        }).then(response => {
            return response.json()
        }).then(data => {
            let pendingTasks = data.filter(x => x.status === 'Completed')
            $('.comp').children('div').remove()
            for(task of pendingTasks){
                $('.comp').append(
                    `<div class="task">
                    <div class="_left">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="status" checked>
                        </div>
                        <div class="data">
                            <p class="lead">
                                ${task.title}
                            </p>
                            <figcaption class="blockquote-footer">
                                ${task.description}
                            </figcaption>
                        </div>
                    </div>
                    <div class="cont">
                        <div class="tags">
                            <p id="cat"class="lead">
                                ${task.category}
                            </p>
                            <p id="date" class="lead">
                                ${task.dueDate}
                            </p>
                        </div>
                        <div class="edit">
                            <i class="bi bi-pencil"></i>
                        </div>
                    </div>
                </div>`
                )
            }
        }).catch(err => {
            console.log(err);
        })
    }

    function showToast(){
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl)
        })
        toastList.forEach(toast => toast.show()) 
    }
})