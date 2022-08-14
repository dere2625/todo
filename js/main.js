jQuery(function(){
    $('#login').click(()=>{
        let userName = $('#username').val()
        let password = $('#password').val()
        console.log(userName, password)
        getLogin(userName,password).then(data => {
            console.log(data);
            if(data.status === 200){
                window.location.href = './layout/home.html'
            }
        })
    })

    function getLogin(email, password){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return fetch('http://127.0.0.1:8082/user/login', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email : email,
                password : password
            })
        })
    }
})