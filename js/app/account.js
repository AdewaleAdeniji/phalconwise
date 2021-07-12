//first thing is to check user token
var accountdigits = 10;
load('Loading Profile....');
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
    redirectTo('index');
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
    getAccount();
}
function getAccount(){
    var url = window.location.href.split('#');
    var len = url.length;
    if(len<2){
        redirectTo("accounts");
    }
    else {
        var hash = url[len-1];
        if(hash.length<10){
            redirectTo("accounts");
        }
        else {
            if(hash.length==accountdigits){
                fetchAccount(hash);
            }
            else {
                redirectTo("accounts");
            }
        }
    }
}
function fetchAccount(accountnumber){
    var acc = JSON.stringify({"account":accountnumber});
    httpPost('/transactions/accounts',acc)
    .then(response=>response.json())
    .then((data)=>{
        if(response(data)){
            transaction(data.text.content,data.text.count);
            showAccount(data.text.account);
        }
        else {

        }
    })
    .catch((err)=>{
        console.log(err);
        inform('Request Failed,Please reload the page to try again');
    })
}
// account: "7810726139"
// accountid: ""
// accountname: "Joseph Emmanuel"
// accountstatus: "1"
// balance: "18130"
// bank: "WEMA BANK"
// created_date: "2021-06-19 13:03:35"
// description: "Savings"
// easetryid: "1"
// flwref: "FLW-1d8955a77b234b77a3a961aba6070b31"
// orderef: "URF_1624107810723_4988435"
// payouts: "4"
// senders: "18"
// total_balance: "20130"
// userid: "12"
var accountinfo = {};
$(".withdraw").click(function(){
    var account = accountinfo.account;
    var balance = accountinfo.balance;
    Swal.fire({
        icon:'question',
        text:'How much do you want to withdraw?',
        input:'number',
        inputAttributes:{
            required:true,
            min:3
        },
        allowEscapeKey:true,
        allowOutsideClick:true,
        showCancelButton:true,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8',
        confirmButtonText:'Withdraw',
        preConfirm: (pin) => {
            pin = parseFloat(pin);
            if(!valnumber(pin)){
                Swal.showValidationMessage(
                    `Amount must contain only numbers(0-9)`
                  )
            }
            else if(pin>balance){
                // console.log(pin,balance);
                // console.log(pin>balance);
                // console.log(pin<balance);
                Swal.showValidationMessage(
                    `Amount cannot be greater than balance (&#8358;${balance})`
                )
            }
            else if(pin<100){
                Swal.showValidationMessage(
                    `Amount must be greater than 100 naira`
                )
            }
            else {
                return pin
            }
        },
    })
    .then((bal)=>{
        if(bal.isConfirmed){
            if(bal.value){
                withdrawPurpose(bal.value);
            }
        }
    })
})
function withdrawPurpose(amount){
    Swal.fire({
        icon:'question',
        html:'Transaction remarks: <br/>Reason/Purpose for withdrawal',
        input:'text',
        allowEscapeKey:true,
        allowOutsideClick:true,
        showCancelButton:true,
        confirmButtonColor:'#6C5DD3',
        backdrop:'#12112de8',
        confirmButtonText:'Withdraw',
        footer:'Field not required'
    })
    .then((data)=>{
        if(data.isConfirmed){
            if(data.value){
                if(amount<=accountinfo.balance){
                    var json = JSON.stringify({"account": accountinfo.account,"amount":amount,"purpose":data.value})
                    load("Processing Withdrawal...");
                    httpPost('/accounts/withdraw',json)
                    .then(response=>response.json())
                    .then((data)=>{
                        closeload();
                        if(response(data)){
                            inform(data.text,'success');
                            componentDidMount();
                        }
                    })  
                    .catch((err)=>{
                        closeload();
                        console.log(err);
                        inform('Withdrawal Failed','error');
                    })

                }
                else {
                    Swal.showValidationMessage(
                        `Amount must be greater than 100 naira`
                    )
                }
            }
        }
    })
}
function showAccount(accountdata){
    accountinfo = accountdata;
    get('accountname').innerHTML=accountdata.accountname;
    var purpose = accountdata.account+' '+accountdata.bank+'<br/><br/>'+accountdata.description;
    get('accountpurpose').innerHTML=purpose;
    get('balance').innerHTML=accountdata.balance;
    get('payouts').innerHTML=accountdata.payouts;
    get('senders').innerHTML=accountdata.senders;
}
function transaction(trxs,count){
//     account: "7810726139"
// amount: "10"
// audit: "0"
// created_date: "2021-05-29T14:45:38.000Z"
// flw_ref: "090267210529154855529101011940"
// identifier: ""
// payment_type: "bank_transfer"
// sender: "Feranmi-Airtime"
// status: "successful"
// transfer_fee: "0.14"
// transferid: "1"
    get('accountcount').innerHTML=count;
    if(count==0){
        get('accountstable').innerHTML="No transactions performed yet on this account";
    }
    else {
        var thml = '';
        trxs.forEach((trx)=>{
            var html = `<div class="products__row clickable" id="${trx.transferid}">
                        
                        
            <div class="products__cell">
            <div class="products__transaction caption color-gray">${trx.sender}</div>
            </div>
            <div class="products__cell color-blue amounthidden">₦${trx.amount}</div>
            <div class="products__cell color-blue">${trx.flw_ref}</div>
            <div class="products__cell">
            <div class="products__status caption  ${trx.status == "successful" ? "bg-green" : "bg-red"}">${trx.status == "successful" ? "Successful" : trx.status }</div>
            </div>
            <div class="products__cell color-gray">${moment(trx.created_date).format('lll')}</div>
        </div>
        <br/>
        <div class="products__body">
          <div class="products__line">
              <div class="products__col color-red mobilebalance">&#8358;${trx.amount}</div>
              <div class="products__status caption accountstatus ${trx.status == "successful" ? "bg-green" : "bg-red"}">${trx.status == "successful" ? "Successful" : trx.status }</div>
              &nbsp;&nbsp;
          <div class="products__col color-gray datecreated">${moment(trx.created_date).format('lll')}</div>

        </div>
      

   
        </div>`;
            thml = thml + html;

        })
        get('accountstable').innerHTML=thml;
    }
}
function getAccounts(){
    http('/accounts')
    .then(response=>response.json())
    .then((data)=>{
        if(response(data)){
            var count = data.text.count;
            get('accountcount').innerHTML=count;
            if(count==0){
                get('accountstable').innerHTML=data.message;
            }
            else {
            var html = '';
            data.text.content.forEach((data)=>{
            var thtml = `<div class="products__row clickable" account="${data.account}">
                        
            <div class="products__cell">
                
            </div>
            <div class="products__cell">
            <div class="products__price title">${data.accountname}</div>
            <div class="products__transaction caption color-gray">${data.account} : ${data.bank}</div>
            </div>
            <div class="products__cell color-blue">&#8358;${data.balance}</div>
            <div class="products__cell">
            <div class="products__status caption  ${data.accountstatus == "0" ? "bg-red" : "bg-green"}">${data.accountstatus == "0" ? "Inactive" : "Active"}</div>
            </div>
            <div class="products__cell color-gray">${moment(data.created_date).format('lll')}</div>
        </div>
        <div class="products__body">
            <div class="products__line">
                <div class="products__col color-red mobilebalance">&#8358;${data.balance}</div>
                <div class="products__status caption accountstatus ${data.accountstatus == "0" ? "bg-red" : "bg-green"}">${data.accountstatus == "0" ? "Inactive" : "Active"}</div>
                &nbsp;&nbsp;
            <div class="products__col color-gray datecreated">${moment(data.created_date).format('lll')}</div>
            
            </div>
        </div>`;
                html = html+thtml;
        })
        get('accountstable').innerHTML=html;
        $('.clickable').click(function(e){
            var account = e.delegateTarget.getAttribute('account');
            redirectTo('account#'+account);
        })
        }
        }
    })
    .catch((err)=>{
        console.log(err);
        get('accountstable').innerHTML='Error Occured. '
    })
}
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
        html:'Welcome to Phalconwise, I am Feranmi and I would be your assistant on Phalconwise.<br/><br/><br/>Would you like me to take you through a 30 seconds overview of what you can do on Phalconwise?',
        footer:'Going through the overview gives you an insight on how fast you can get things done on phalconwise, I 100% recommend -> Phalconwise User ',
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
        footer:'Your funds are safe and secured on phalconwise',
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
        html:'You\'re all done <br/> Welcome to Phalconwise Once again. <br/><br/> Do you want to turn on dakrmode?',
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
                            html:data.text+'<br/><br/> Now you can perform send, receive and relax while making your transactions because Phalconwise got your back!',
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