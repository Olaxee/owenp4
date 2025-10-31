const supabaseUrl = "https://onvmbhazjlivjedwdusp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udm1iaGF6amxpdmplZHdkdXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzExNzcsImV4cCI6MjA3NzUwNzE3N30.669S7AH9jVtQrDDG7FESAFIgXX04ul2l4TQwBUfjMCo";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Connexion
document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

  if(data){
    localStorage.setItem('user', JSON.stringify(data));
    window.location.href = "game.html";
  } else {
    alert('Erreur de connexion');
  }
});

// Inscription
document.getElementById('signupForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  const { data, error } = await supabase
      .from('users')
      .insert([{ username, password }]);

  if(data) alert('Inscription réussie !');
  else alert('Erreur : ' + error.message);
});