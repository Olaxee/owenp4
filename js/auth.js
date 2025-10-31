const supabaseUrl = "VOTRE_SUPABASE_URL";
const supabaseKey = "VOTRE_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Login
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

// Signup
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