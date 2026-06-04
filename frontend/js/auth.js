
// js/auth.js — handles the Login and Register forms.



document.addEventListener('DOMContentLoaded', () => {
  // If the user is ALREADY logged in, skip the auth pages and go to dashboard.
  if (Auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  //  LOGIN 
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // stop the browser's default page reload

      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true; // prevent double-clicks while we wait

      try {
        const body = {
          email: loginForm.email.value,
          password: loginForm.password.value,
        };

        // Call POST /api/auth/login.
        const data = await apiFetch('/auth/login', { method: 'POST', body });

        // Save the token + user, then go to the dashboard.
        Auth.setToken(data.token);
        Auth.setUser(data.user);
        toast('Welcome back!');
        setTimeout(() => (window.location.href = 'dashboard.html'), 500);
      } catch (err) {
        toast(err.message, 'error');
        btn.disabled = false;
      }
    });
  }

  //  REGISTER 
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = registerForm.querySelector('button[type="submit"]');

      
      if (registerForm.password.value !== registerForm.confirmPassword.value) {
        toast('Passwords do not match.', 'error');
        return;
      }

      btn.disabled = true;
      try {
        const body = {
          name: registerForm.name.value,
          email: registerForm.email.value,
          phone: registerForm.phone.value,
          password: registerForm.password.value,
          confirmPassword: registerForm.confirmPassword.value,
        };

        // Call POST /api/auth
        await apiFetch('/auth/register', { method: 'POST', body });

        toast('Account created! Please log in.');
        setTimeout(() => (window.location.href = 'login.html'), 800);
      } catch (err) {
        toast(err.message, 'error');
        btn.disabled = false;
      }
    });
  }
});
