async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    
    // THIS WILL SHOW THE ERROR MESSAGE
    if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = '/public/dashboard.html';
    } else {
        alert('Error: ' + data.message); // This will show "Invalid credentials"
    }
}