
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatcontainer = document.querySelector('#chat_container');



// function for loader of three dots in starting of output 
let loadInterval;


function loader(element) {
 element.textContent ='';

 loadInterval = setInterval(() => {
  element.textContent += '.';

  if(element.textContent === '....'){
    element.textContent = '';
  }

 },300 )
  
}

// typing functionality

function typetext(element,text) {

  let index = 0;
  
  let interval = setInterval(()=>{
   if(index < text.length){
    element.innerHTML += text.charAt(index);
    index++;
   }else {
     clearInterval(interval);
   }

  },20)
  
}

// unique id for every single message

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// chat stripe for different color

function chatStripe(isAi , value ,uniqueId) {
  return (
    `
    <div class= "wrapper  ${isAi && 'ai'}">
     <div class= "chat">
       <div class= "profile">
        <img 
          src ="${isAi ? bot : user}"
          alt ="${isAi ? 'bot' : 'user'}"
        />
      </div>
        <div class="message" id=${uniqueId}>${value}</div>
     </div>
    </div>
    `
  )
}


// AI GENERATED RESPONSE

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const data = new FormData(form);

  // GENERATED USER's CHATSTRIPE
  chatcontainer.innerHTML+= chatStripe(false,data.get('prompt'));

  form.reset();

  // GENERATED BOT CHATSTRIPE
   
  const uniqueId = generateUniqueId();
  chatcontainer.innerHTML+= chatStripe(true," ", uniqueId);

  chatcontainer.scrollTop = chatcontainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv)

  // fetch Data from the server to get response from the bot
const response = await fetch('https://ai-app-urgf.onrender.com',{
  method:'POST',
  headers: {
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
    prompt:data.get('prompt')
  })
})

clearInterval(loadInterval);

messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();

  typetext(messageDiv,parsedData);
}else{
  const err = await response.text();
  messageDiv.innerHTML = "Something went Wrong";
  alert(err);
}

}


form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup",(e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})

