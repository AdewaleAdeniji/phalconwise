//first thing is to check user token
load('');
var account = {};
function componentDidMount(){
if(token){
    
    http('/accounts/profile')
    .then(response=>response.json())
    .then((data)=>{
        if(response(data)){
            account = data.text;
            dashboard(data.text);
        }   
    })
    .catch((err)=>{
        // console.log(err);
        //componentDidMount();
        load(err+' Please reload the page to try again');
    })
}
else {
    redirectTo('login');
}

}

async function dashboard(data){
//     PinSet: false
// accounts: "0"
// balance: "0"
// bvn: "12345678901"
// created_at: "2021-06-14 20:15:39.692651"
// eastryid: ""
// email: "feranmidev@gmail.com"
// firstname: "Adeniji"
// kyc_level: "1"
// lastname: "Oluwaferanmi"
// limit: "20000"
// message: "Welcome to Falcons!"
// phonenumber: "0"
// refferalcode: "6094217"
// reffered: "0"
// suspended: "0"
// total_balance: "0"
// transacted: "0"
// transaction_status: "1"
// userhandle: "devferanmy"
// userpassword: ""
// userstatus: "1"
// verified: "1"
// walletbalance: "3000"


    //check if verified and not banned
    if(data.verified!="1"){
        toast('Email have not been verified, We will redirect you to login, Please enter your email and password to verify your email');
        window.setTimeout(()=>{
            redirectTo('login');
        },3000);
    }
    else if(data.userstatus!="1"){
        toast(data.message);
    }
    // check if pin set
    else if(!data.PinSet){
        // console.log(data.pin);
        toast('Pin have not been setup');
        // get('btnsetpin').click();
        await tour();
        // SetPin();

        
    }
    else {
        //all done
        displayData();

    }

}
//     PinSet: false
// accounts: "0"
// balance: "0"
// bvn: "12345678901"
// created_at: "2021-06-14 20:15:39.692651"
// eastryid: ""
// email: "feranmidev@gmail.com"
// firstname: "Adeniji"
// kyc_level: "1"
// lastname: "Oluwaferanmi"
// limit: "20000"
// message: "Welcome to Falcons!"
// phonenumber: "0"
// refferalcode: "6094217"
// reffered: "0"
// suspended: "0"
// total_balance: "0"
// transacted: "0"
// transaction_status: "1"
// userhandle: "devferanmy"
// userpassword: ""
// userstatus: "1"
// verified: "1"
// walletbalance: "3000
function displayData(){
    //username first 
    var data = account;
    get('usernameone').innerHTML=data.firstname+' '+data.lastname;
    get('usernametwo').innerHTML=data.userhandle;
    
    getTransactions();
    getCodes();
}
function getCodes(){
    http('/code/')
    .then(response=>response.json())
    .then((data)=>{
        if(response(data)){
            get('codecount').innerHTML=data.text.count;
            if(data.text.count==0){
                get('accountstable').innerHTML=data.text.message;
            }
            else {
                var html = '';
                data.text.content.forEach((code)=>{
                    const codehtml = `<div class="products__row clickable codeopen" code="${code.code}">
                    <div class="products__cell">${code.codename}</div>
                    <div class="products__cell">${code.code}</div>
                    <div class="products__cell">${code.codestatus == '1' ? 'Active' : 'Inactive'}</div>
                    <div class="products__cell">${moment(moment(code.codetime).format('lll')).add(1, 'hours').calendar()}</div>
                    <div class="products__cell"><a class="popup__tag active codeopen" href="#" code="${code.code}"><i class="fa fa-angle-double-right"></i></a></div>
                </div> `;
                html = html + codehtml;
                })
                get('accountstable').innerHTML=html;
                $('.codeopen').click(function(e){
                    var code = e.delegateTarget.getAttribute('code');
                    redirectTo('code#'+code);
                })
            }
        }
    })
    .catch((err)=>{
        console.log(err);
        get('accountstable').innerHTML='Failed to load codes';
    })
}
$('.createcode').click(function(e){
    e.preventDefault();
    redirectTo('create-code')

})
function getTransactions(){
    //moment('2021-06-19 22:17:49.406763').endOf('day').fromNow();    

    //fetch transactions
    http('/transactions/limitransactions')
    .then(response=>response.json())
    .then((data)=>{
        if(response(data)){
            var transactions = data.text;
            var count = transactions.count;
            if(count==0){
                get('transactionslist').innerHTML=transactions.message;
            }
            else {
                var html = '';
                transactions.content.forEach((trx)=>{
                    // amount: "10"
                    // created_at: "2021-06-19 22:17:49.406763"
                    // ref: "0"
                    // transaction: "You have received 10 into your account (Joseph Emmanuel) sent by Feranmi-Airtime"
                    // transactionid: "1"
                    // trxtype: "1"
                    // type: "Transfer"
                    // userid: "12"

                    var trxhtml = `<a class="notifications__item" href="notificationdetails#${trx.transactionid}">
                    <div class="notifications__ava">
                      <img class="notifications__pic" src="img/figure-5.png" alt="" />
                    </div>
                    <div class="notifications__details">

                      <div class="notifications__line">
                        <div class="notifications__user caption">${trx.type == '0' ? 'Transfer' : trx.type }</div>
                        <div class="notifications__time caption"></div>
                      </div>
                      <div class="notifications__text caption-sm">
                        
                        ${trx.transaction}
                        <br>
                        Amount:<span class="notifications__project">&#8358;${trx.amount}</span>
                        <br><br>
                        <span class="notifications__project">${moment(moment(trx.created_at).format('lll')).add(1, 'hours').calendar()} </span>
                        </div>
                    </div>
                  </a>`;

                    html = html +  trxhtml;
                })

                get('transactionslist').innerHTML=html;
            }
        }
    })
    .catch((err)=>{
        // console.log(err);
        get('transactionslist').innerHTML='Transactions Fetch Failed <a href="#" onclick=getTransactions()>Retry</a>';
    })
}
function tour(){
    Swal.fire({
        imageUrl:'img/ava-1.png',
        html:'Welcome to Phalcone, I am Feranmi and I would be your assistant on Phalcone.<br/><br/><br/>Would you like me to take you through a 30 seconds overview of what you can do on Phalcone?',
        footer:'Going through the overview gives you an insight on how fast you can get things done on phalcone, I 100% recommend -> Phalcone User ',
        confirmButtonText:'Okay, Take me through',
        cancelButtonText:'Just take me to the app',
        showCancelButton:true,
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8'
    })
    .then((tour)=>{
        if(tour.value){
            tourStageTwo();
        }
        else {
            SetPin()
        }
    })
}
function tourStageTwo(){
    //this is stage two of the demo
    Swal.fire({
        imageUrl:'img/ava-1.png',
        html:'The Overview Page shows you your wallet balance(instant balance) and your cumulative balance(balance accross your different Phalcon accounts) <br/> The search panel provides quick access to in-app actions, transactions e.t.c. <br/><br/> Your last few transactions are also shown below your balance <br/> If we make any change in the future we\'ll sure let you know. Click Next to continue!',
        footer:'Your funds are safe and secured on phalcone',
        confirmButtonText:'Continue!',
        cancelButtonText:' I\'m tired, Just take me to the app!',
        showCancelButton:true,
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8'
    })
    .then((tour)=>{
        if(tour.value){
            tourStageThree();
        }
        else {
            SetPin()
        }
    })

}
function tourStageThree(){
    Swal.fire({
        imageUrl:'img/figure-3.png',
        title:'Settings Options',
        html:'You can turn on Dark and Light mode on the settings page<br/> You can also hide your balance or set a panic balance in the settings <br/> You can always reach out to our support at any time and we\'ll always respond to you swiftly, You can talk to us about improvments,bugs, account fraud, transactions and suggestions. We\'re always open. Just click the message icon at the bottom right corner',
        footer:'You are safe, Support teams do not have access to your account and cannot perform any transaction on your behalf',
        confirmButtonText:'Continue!',
        cancelButtonText:' I\'m tired, Just take me to the app!',
        showCancelButton:true,
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8'
    })
    .then((tour)=>{
        if(tour.value){
            setDarkMode();
        }
        else {
            SetPin()
        }
    })
}   
function setDarkMode(){
    Swal.fire({
        icon:'success',
        html:'You\'re all done <br/> Welcome to Phalcone Once again. <br/><br/> Do you want to turn on dakrmode?',
        confirmButtonText:'Yes!',
        cancelButtonText:'No',
        showCancelButton:true,
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8'
    })
    .then((turn)=>{
        if(turn.value){
            var body = $('body');
            body.addClass('dark');
            localStorage.setItem('darkMode', "on");
        }
        SetPin();
    })
}

function SetPin(){
    Swal.fire({
        icon:'question',
        text:'To ensure safety and security while performing transactions, You\'re required to set up a 4 digits transaction pin of your choice',
        input:'tel',
        inputAttributes:{
            required:true,
            min:4,
            max:4,
        },
        confirmButtonText:'Continue ',
        cancelButtonText:'No',
        showCancelButton:true,
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        footer:'Only Numbers are allowed (0-9)',
        preConfirm: (pin) => {
            if(!valnumber(pin)){
                Swal.showValidationMessage(
                    `Pin must contain only numbers(0-9)`
                  )
            }
            else if(pin.length!=4){
                Swal.showValidationMessage(
                    `Pin must be four characters`
                  )
            }
            else {
                return pin
            }
        },
        allowOutsideClick:false,
        allowEscapeKey:false,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8',
        showCancelButton:false
    }).then((pin)=>{
        if(pin.value){
            const chosenpin = pin.value;
            console.log(chosenpin);
            if(valnumber(chosenpin)&&chosenpin.length==4){
                var data = JSON.stringify({
                    "pin":chosenpin
                })
                load('Setting Pin');
                httpPost('/transactions/setpin',data)
                .then(response=>response.json())
                .then((data)=>{
                    if(response(data)){
                        Swal.fire({
                            icon:'success',
                            html:data.text+'<br/><br/> Now you can perform send, receive and relax while making your transactions because Phalcone got your back!',
                            confirmButtonText:'Okay good!',
                            confirmButtonColor:'#6C5DD3',
                            backdrop:'#12112de8'
                        })
                        .then((done)=>{
                            componentDidMount();
                        })
                        
                    }
                })
                .catch((err)=>{
                // console.log(err);
                closeload();
                SetPin();
                Swal.showValidationMessage(
                    `Password set failed, Please try again`
                  )
                })
            }
            else {
                SetPin();
                Swal.showValidationMessage(
                    `Pin must contain only numbers(0-9) and must be 4 characters`
                  )
            }
        }
        else {
            SetPin();
            Swal.showValidationMessage(
                `Pin must contain only numbers(0-9)`
              );
        }
    })

    
}