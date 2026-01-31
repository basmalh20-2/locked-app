const form = document.getElementById('form');
const text = document.getElementById('text');
const file = document.getElementById('hide');
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    check();
});

function check() {
    const userName = document.getElementById('name').value;
    const passWord = document.getElementById('password').value;
    const savedName = localStorage.getItem("savedName");
    const savedPassword = localStorage.getItem("savedPassword");

    if (userName === '' || passWord === '') {
        // text.innerText = 'Enter your data please';
    } else if (userName.length < 5) {
        text.innerText = 'The name can not be less than 5 letters';
    } else if (passWord.length < 6) {
        text.innerText = 'The password can not be less than 6 characters'
    } else {
        if (!savedName || !savedPassword) {
            localStorage.setItem("savedName", userName);
            localStorage.setItem("savedPassword", passWord);

            text.innerText = 'Registered successfully';
            text.style.color = 'green';
            text.style.fontStyle = 'italic';
            file.style.display = 'block';
        } else {
            if (userName === savedName && passWord === savedPassword) {
                text.innerText = 'Welcome back Login successful';
                text.style.color = 'green';
                text.style.fontStyle = 'italic';
                file.style.display = 'block';
            } else {
                text.innerText = 'please check your data again';
            }
        }
    }
}

resetBtn.addEventListener("click", function () {
    localStorage.removeItem("savedName");
    localStorage.removeItem("savedPassword");

    if (typeof clearFiles === "function") {
        clearFiles();
    }

    text.innerText = "Account has been reset You can register again.";
    text.style.color = "orange";
    text.style.fontStyle = "italic";
    file.style.display = "none";

    form.reset();
});
