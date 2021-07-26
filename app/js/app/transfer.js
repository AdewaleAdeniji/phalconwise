//first thing is to check user token
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
    setupBanks();

}

function setupBanks(){
    const loadtext = 'Fetching and populating list of banks ...';
    load(loadtext);
    toast(loadtext);
    http('/transactions/banks')
    .then(response=>response.json())
    .then((data)=>{
        closeload();
        if(response(data)){
            const banks = data.text;
            banks.forEach((bank)=>{
                $("#banklist").append(new Option(bank.name,bank.code));
            })
        }
    })
    .catch((err)=>{
        closeload();
        toast('Failed to fetch list of banks, Please refresh the page and try again');
    })
}
$('.buyairtime').submit(function(e){
    e.preventDefault();
    var amount = parseInt(value('amount'));
    var phonenumber = value('phonenumber');

    if(amount<50){
        inform('Airtime Amount must be more than 100 naira');
    }
    else if(phonenumber.length!=11){
        inform("Phone Number must be 11 characters");
    }
    else if(!valnumber(phonenumber)) {
        inform("Phone number should contain only numbers(0-9) ");
    }
    else {
        Swal.fire({
            icon:'question',
            text:'Enter transaction Pin',
            input:'password',
            inputAttributes:{
                required:true,
                min:4,
                maxinput:4,
                max:4
            },
            allowOutsideClick:true,
            confirmButtonText:'Continue!',
            showCancelButton:true
        })
        .then((pin)=>{
            if(pin.isConfirmed){
                if(pin.value){
                    load('Buying airtime...');
                    var pinn = pin.value;
                    var json = JSON.stringify({"phonenumber":phonenumber,"amount":amount,"transactionPin":pinn})
                    console.log(json);
                    httpPost('/transfer/airtime',json)
                    .then(response=>response.json())
                    .then((data)=>{
                        closeload();
                        if(data.code==200){
                            get('amount').value = '';
                            get('phonenumber').value = '';
                            inform(data.text,'success');
                        }
                        else {
                            inform(data.text,'warning');
                        }
                    })
                    .catch((err)=>{
                        closeload();
                        console.log(err);
                        inform('Error Occured while processing your request, Please try again');
                    })
                }
            }
        })
    }


});
var status = false;
var accountname = '';
var accountno = '';
var bankcode = '';
function findBeneficiary(){
    status = false;
    accountno = value('accountnumber');
    bankcode = value('banklist');
    if(accountno==""||accountno.length!=10){
        inform('Beneficiary Account Number must be ten characters');
    }
    else if(bankcode==""){
        inform("Please choose beneficiary bank to continue");
    }
    else {
        var json = JSON.stringify({
            "accountNumber":accountno,
            "bankCode":bankcode
        });
        load('Validating Bank Account');
        httpPost('/transfer/initiate',json)
        .then(response=>response.json())
        .then((data)=>{
            closeload();
            if(response(data)){
                status = true;
                accountname = data.text;
                get('accountname').innerHTML = data.text;
                get('accountname2').innerHTML = data.text;
            }
        })
        .catch((err)=>{
            closeload();
            get('accountname').innerHTML = 'Beneficiary Account Number could not be validated';
        })
    }
}
$('.sendmoney').submit(function(e){
    e.preventDefault();
    var accountno = value('accountnumber');
    var bankcode = value('banklist');
    var amount = value('amount');
    if(accountno==""||accountno.length!=10){
        inform('Beneficiary Account Number must be ten characters');
    }
    else if(bankcode==""){
        inform("Please choose beneficiary bank to continue");
    }
    else if(amount<100){
        inform('Amount must be greater than &#8358;100');
    }
    else {
        var json = JSON.stringify({
            "accountNumber":accountno,
            "bankCode":bankcode
        });
        load('Validating Bank Account');
        httpPost('/transfer/initiate',json)
        .then(response=>response.json())
        .then((data)=>{
            closeload();
            if(response(data)){
               Swal.fire({
                   icon:'question',
                   html:'You are about to transfer &#8358;'+amount+' to '+data.text+'<br/> Please enter your transaction PIn to confirm this transaction:',
                   input:'password',
                   inputAttributes:{
                       required:true,
                       maxlength:4,
                       minlength:4
                   },
                   validationMessage:'Transaction Pin must be 4 characters',
                   allowEscapeKey:false,
                   allowOutsideClick:false,
                   backdrop:'rgba(0,0,0,0.7)',
                    confirmButtonText:'Send &#8358;'+amount,
                    confirmButtonColor:'#6C5DD3',
                    showCancelButton:true,
                    cancelButtonText:'Cancel'
               })
               .then((data)=>{
                   if(data.isConfirmed){
                       
                       var remarks = value('remarks');
                       var anony = value('anony');
                        var obj = {
                            "accountNumber":accountno,
                            "bankCode":bankcode,
                            "transactionPin":data.value,
                            "amount":amount,
                            "narration":remarks,
                            "anony": anony=='' ? false : true
                        }
                        var payload = JSON.stringify(obj);
                        load('Sending....');
                        httpPost('/transfer/transfer',payload)
                        .then(response=>response.json())
                        .then((data)=>{
                            if(response(data)){
                                inform(data.text,'success');
                                toast(data.text);
                                get('accountnumber').value='';
                                get('banklist').value = '';
                                get('amount').value=0;
                                get('remarks').value='';
                            }
                        })
                        .catch((err)=>{
                            closeload();
                            console.log(err);
                            inform('Transaction Failed');
                            toast('Error: Transaction Failed');
                        })

                   }
               })
            }
        })
        .catch((err)=>{
            closeload();
            get('accountname').innerHTML = 'Beneficiary Account Number could not be validated';
        })
    }
})  
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
            <div class="products__price title">${data.accountname}</div>
            
            <div class="products__transaction caption color-gray">${data.account} : ${data.bank}</div>
            </div>
            <div class="products__cell">         
            </div><div class="products__cell">         
            </div>
            <div class="products__cell color-blue">&#8358;${data.balance}</div>
            <div class="products__cell">
            <div class="products__status caption  ${data.accountstatus == "0" ? "bg-red" : "bg-green"}">${data.accountstatus == "0" ? "Inactive" : "Active"}</div>
            </div>
            <div class="products__cell color-gray">${moment(moment(data.created_date).format('lll')).add(1, 'hours').calendar()}</div>
        </div>
        <div class="products__body">
            <div class="products__line">
                <div class="products__col color-red mobilebalance">&#8358;${data.balance}</div>
                <div class="products__status caption accountstatus ${data.accountstatus == "0" ? "bg-red" : "bg-green"}">${data.accountstatus == "0" ? "Inactive" : "Active"}</div>
                &nbsp;&nbsp;
            <div class="products__col color-gray datecreated">${moment(moment(data.created_date).format('lll')).add(1, 'hours').calendar()}</div>
            
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
$('.createaccount').click(function(e){
    e.preventDefault();
    Swal.fire({
        imageUrl:'img/ava-1.png',
        title:'Create Account',
        text:'What would you like the account name to be called?',
        input:'text',
        inputAttributes:{
            required:true,
            min:6,
        },
        validationMessage:'Account name cannot be empty and must be more than 6 characters',
        allowEscapeKey:true,
        showCancelButton:true,
        backdrop:'rgba(0,0,0,0.7)',
        confirmButtonText:'Continue ',
        confirmButtonColor:'#6C5DD3'
        // backdrop:'#12112de8'
    })
    .then((accountname)=>{
        if(accountname.value){
            Swal.fire({
                icon:'question',
                text:'For what purpose do you want to create this account ? A little description would do',
                input:'text',
                footer:'Not a required field',
                backdrop:'rgba(0,0,0,0.7)',
                confirmButtonText:'Continue ',
                confirmButtonColor:'#6C5DD3',
                allowEscapeKey:true,
                showCancelButton:true,
            })
            .then((purpose)=>{
                if(purpose.isConfirmed){
                    var purpose = purpose.value ? purpose.value  : '';
                    if(accountname.value==""||accountname.value.length<6){
                        inform('Account name cannot be empty and must be more than 6 characters');
                    }
                    else {
                        load('Creating Account...');
                        var data = JSON.stringify({"purpose":purpose,"accountname":accountname.value});
                        httpPost('/accounts/create',data)
                        .then(response=>response.json())
                        .then((data)=>{
                            closeload();
                            if(response(data)){
                                Swal.fire({
                                    icon:'success',
                                    html:`Account Created Successfully <br/>
                                         Account Name: ${data.text.accountname} <br/>
                                         Account Number: ${data.text.account} <br/>
                                         Bank: ${data.text.bank}<br/>
                                         You can now make transfers into this account.`,
                                    confirmButtonText:'Okay!',
                                    confirmButtonColor:'#6C5DD3',
                                })
                                .then((data)=>{
                                    componentDidMount();
                                })
                            }
                        })
                        .catch((err)=>{
                            closeload();
                            inform('Error Occured','error');
                        })
                    }
                }
            })
        }
    })
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