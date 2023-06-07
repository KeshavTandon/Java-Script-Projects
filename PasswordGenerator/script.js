const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const NumberCheck=document.querySelector("#numbers")
const SymbolCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateButton")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")
const symbols='`~!@#$%^&*(){}:<>?]['

let password=""
let passwordLength=10
let checkCount=0
handleSlider()

function handleSlider()  //password lenght ko UI par reflect karata hai
{
    inputSlider.value=passwordLength
    lengthDisplay.innerText=passwordLength
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color
    //shadow
}

function getRndInteger(min,max)
{
    return Math.floor(Math.random()*(max-min)) + min 
}

function generateRandomNumber()
{
    return getRndInteger(0,9)
}

function generateLowercase()
{
   return String.fromCharCode(getRndInteger(97,123))
}

function generateUppercase()
{
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbols()
{
    const randomNumber=getRndInteger(0,symbols.length)
    return symbols.charAt(randomNumber)
}

function calcStrength()
{
    let hasUpper=false
    let hasLower=false
    let hasNum=false
    let hasSyb=false
    if(uppercaseCheck.checked) hasUpper=true
    if(lowercaseCheck.checked) hasLower=true
    if(NumberCheck.checked) hasNum=true
    if(SymbolCheck.checked) hasSyb=true
    if(hasUpper && hasLower && (hasNum || hasSyb) && passwordLength>=8){
        setIndicator("#0f0")
    }
    else if((hasLower || hasUpper ) && (hasNum || hasSyb) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else
    {
        setIndicator("f00")
    }
}

//Fisher Yate Method
function shufflePassword(array)
{
  for(let i=array.length-1;i>0;i--)
  {
    let j=Math.floor(Math.random() * (i+1))
    const temp=array[i]
    array[j]=array[i]
    array[j]=temp
  }
  let str=""
  array.forEach((el)=>(str+=el))
  return str
}

async function copyContent()
{
  try{
     await navigator.clipboard.writeText(passwordDisplay.value)  //returns Promise
     copyMsg.innerText="copied"
  }
  catch{
    copyMsg.innerText="Failed"
  }
  copyMsg.classList.add("active")
  setTimeout(()=>{
    copyMsg.classList.remove("active")
  },2000)
}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent()
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0) return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    password="";

    let funArr=[]

    if(uppercaseCheck.checked)
    funArr.push(generateUppercase)

    if(lowercaseCheck.checked)
    funArr.push(generateLowercase)

    if(NumberCheck.checked)
    funArr.push(generateRandomNumber)

    if(SymbolCheck.checked)
    funArr.push(generateSymbols)
    
    //Compulsory addition
    for(let i=0;i<funArr.length;i++)
    {
        password+=funArr[i]()
    }

    //Remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
       let randomInt=getRndInteger(0,funArr.length)
       password+=funArr[randomInt]()
    }

    //shuffle the password
    password=shufflePassword(Array.from(password))

    //showing the password in UI
    passwordDisplay.value=password

    //strength
    calcStrength()

});