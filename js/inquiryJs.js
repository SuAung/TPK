const form = document.getElementById("contactForm");
const ids = ["company","companyKana","person","personKana","email","emailConfirm","phone","inquiry"];

document.getElementById("inquiry").addEventListener("input", e => {
  document.getElementById("count").textContent = e.target.value.length;
});

form.addEventListener("submit", e => {
  e.preventDefault();
  if (validate()) showConfirm();
});

function val(id){ return document.getElementById(id).value.trim(); }

function validate(){
  document.querySelectorAll(".error").forEach(x => x.textContent = "");
  let ok = true;

  const required = [
    ["company","会社名を入力してください。"],
    ["companyKana","会社名（フリガナ）を入力してください。"],
    ["person","担当者名前を入力してください。"],
    ["personKana","担当者名前（フリガナ）を入力してください。"],
    ["email","メールアドレスを入力してください。"],
    ["emailConfirm","確認用メールアドレスを入力してください。"],
    ["phone","電話番号を入力してください。"],
    ["inquiry","お問い合わせ内容を入力してください。"]
  ];

  required.forEach(([id,msg])=>{
    if(!val(id)){ document.getElementById(id+"Error").textContent=msg; ok=false; }
  });

  const email = val("email");
  const confirm = val("emailConfirm");

  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    document.getElementById("emailError").textContent="正しいメールアドレスを入力してください。";
    ok=false;
  }

  if(email && confirm && email !== confirm){
    document.getElementById("emailConfirmError").textContent="メールアドレスが一致していません。";
    ok=false;
  }

  if(!document.getElementById("privacy").checked){
    document.getElementById("privacyError").textContent="個人情報の取り扱いに同意してください。";
    ok=false;
  }

  if(!ok){
    const first = document.querySelector(".error:not(:empty)");
    if(first) first.scrollIntoView({behavior:"smooth",block:"center"});
  }
  return ok;
}

function showConfirm(){
  const items = [
    ["会社名",val("company")],
    ["会社名（フリガナ）",val("companyKana")],
    ["担当者名前",val("person")],
    ["担当者名前（フリガナ）",val("personKana")],
    ["メールアドレス",val("email")],
    ["メールアドレス（確認）",val("emailConfirm")],
    ["電話番号",val("phone")],
    ["お問い合わせ内容",val("inquiry")]
  ];

  document.getElementById("confirmData").innerHTML = items.map(([label,value]) => `
    <div class="confirm-row">
      <div class="confirm-label">${escapeHTML(label)}</div>
      <div class="confirm-value">${escapeHTML(value)}</div>
    </div>
  `).join("");

  document.getElementById("formScreen").classList.add("d-none");
  document.getElementById("completeScreen").classList.add("d-none");
  document.getElementById("confirmScreen").classList.remove("d-none");
  window.scrollTo({top:0,behavior:"smooth"});
}

function edit(){
  document.getElementById("confirmScreen").classList.add("d-none");
  document.getElementById("formScreen").classList.remove("d-none");
  window.scrollTo({top:0,behavior:"smooth"});
}

function complete(){
  // UI only. Real email sending will be connected later.
  document.getElementById("confirmScreen").classList.add("d-none");
  document.getElementById("formScreen").classList.add("d-none");
  document.getElementById("completeScreen").classList.remove("d-none");
  window.scrollTo({top:0,behavior:"smooth"});
}

function resetToForm(e){
  if(e) e.preventDefault();
  document.getElementById("confirmScreen").classList.add("d-none");
  document.getElementById("completeScreen").classList.add("d-none");
  document.getElementById("formScreen").classList.remove("d-none");
  form.reset();
  document.getElementById("count").textContent="0";
  document.querySelectorAll(".error").forEach(x=>x.textContent="");
  window.scrollTo({top:0,behavior:"smooth"});
  return false;
}

function escapeHTML(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")
          .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
          .replace(/'/g,"&#039;");
}