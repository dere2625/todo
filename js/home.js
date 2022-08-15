jQuery(function(){

    if(!checkCookie()){
        redirectToLogin()
    }

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
        if(!checkCookie()){
            redirectToLogin()
        }
        else{
            getPendingTasks()
        }
        
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
        if(!checkCookie()){
            redirectToLogin()
        }
        else{
            getPendingTasks()
        }
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
        if(!checkCookie()){
            redirectToLogin()
        }
        else{
            getPendingTasks()
        }
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
        if(!checkCookie()){
            redirectToLogin()
        }
        else{
            getPendingTasks()
        }
        getArchivedTasks()
    })

    $('#account').click(function (){
        $(this).addClass('selected')
        $('.dash').css('display','none')
        $('.pend').css('display','none')
        $('.comp').css('display','none')
        $('.arch').css('display','none')
        $('.account').css('display','flex')
        if(!checkCookie()){
            redirectToLogin()
        }
        else{
            getPendingTasks()
        }
        setSelected('account')
    })

    $('#create').click(function(){
        createTodo()
    })

    $('#logout').click(function(){
        logout()
        window.location.href = '../index.html'
    })

    $('.pend').on('click','.ops #edit', function(){
        console.log($(this).parent().data('title'));
        $('#title').val('THis is test title')
        $('#myModal').modal('show')
    })

    $('.pend').on('click', '#archive', function(){
        let id = $(this).parent().data('title')
        archiveTodo(id)
        showToast()
    })

    $('.pend').on('click','.form-check', function(){
        let id = $(this).data('id')
        completTodo(id)
    })

    $('.comp').on('click','.form-check', function(){
        let id = $(this).data('id')
        unCompletTodo(id)
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
        if(!checkCookie()){
            redirectToLogin()
        }
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
        .catch((err) => {
            $('#myModal').modal('hide')
            showToast('Something went wrong','Error')
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
        .catch((err) => {
            $('#myModal').modal('hide')
            showToast('Something went wrong','Error')
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
        }).then((data) => {
            let pendingTasks = data.filter(x => x.status === 'Pending')
            $('.pend').children('div').remove()
            for(task of pendingTasks){
                $('.pend').append(
                    `<div class="task">
                    <div class="_left">
                        <div class="form-check" data-id="${task._id}">
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
                        <div class="ops" data-title = "${task._id}">
                            <i id="edit" title="Edit" class="bi bi-pencil" ></i>
                            <i id="archive" title="Archive"class="bi bi-archive"></i>
                        </div>
                    </div>
                </div>`
                )
            }
            
        }).catch((err) => {
            showToast('Something went wrong','Error')
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
            let completedTasks = data.filter(x => x.status === 'Completed')
            $('.comp').children('div').remove()
            for(task of completedTasks){
                $('.comp').append(
                    `<div class="task">
                    <div class="_left">
                        <div class="form-check" data-id="${task._id}">
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
                    </div>
                </div>`
                )
            }
        }).catch((err) => {
            showToast('Something went wrong','Error')
        })
    }

    function getArchivedTasks(){
        fetch('http://127.0.0.1:8082/todo', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
        }).then(response => {
            return response.json()
        }).then(data => {
            let archivedTasks = data.filter(x => x.status === 'Archived')
            $('.arch').children('div').remove()
            for(task of archivedTasks){
                $('.arch').append(
                    `<div class="task">
                    <div class="_left">
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
                    </div>
                </div>`
                )
            }
        }).catch((err) => {
            showToast('Something went wrong','Error')
        })
    }

    function logout(){
        
        fetch('http://127.0.0.1:8082/user/logout', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
        .catch((err) => {
            showToast('Something went wrong','Error')
        })
    }

    function archiveTodo(id){
        fetch('http://127.0.0.1:8082/todo/archive/'+id, {
            method: 'delete',
            mode: 'cors',
            credentials: 'include',
        }).then((data) => {
            getPendingTasks()
            showToast('Task Archived','Success')
        })
        .catch((err) => {
            showToast('Something went wrong','Error')
        })
        
    }

    function completTodo(id){
        fetch('http://127.0.0.1:8082/todo/complete/'+id, {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        }).then((data) => {
            getPendingTasks()
            showToast('Task Completed','Success')
        })
        .catch((err) => {
            showToast('Something went wrong','Error')
        })
    }

    function unCompletTodo(id){
        fetch('http://127.0.0.1:8082/todo/uncomplete/'+id, {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        }).then((data) => {
            getCompletedTasks()
            showToast('Task status changed to Pending','Success')
        })
        .catch((err) => {
            showToast('Something went wrong','Error')
        })
    }

    function showToast(data,title){
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl)
        })
        document.querySelector('.toast-body').innerHTML = data
        document.querySelector('.mr-auto').innerHTML = title
        toastList.forEach(toast => toast.show()) 
    }

    function checkCookie(){
        if($.cookie('token') == undefined){
            return false
        }
        return true
    }

    function redirectToLogin(){
        window.location.href = '../index.html'
    }
})